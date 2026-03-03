import { createClient, type InValue } from '@libsql/client';

export type Article = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  date: string;
  featured: boolean;
  content: string;
};

/**
 * Partial env shape — pass Astro.locals.runtime?.env from each page.
 * Falls back to import.meta.env for local dev (astro dev / Node.js).
 */
export type DbEnv = { TURSO_DATABASE_URL?: string; TURSO_AUTH_TOKEN?: string };

function getClient(env?: DbEnv) {
  // On Cloudflare Pages, runtime secrets are in locals.runtime.env (passed as `env`).
  // During local dev (astro dev), fall back to import.meta.env from .env file.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolved: Record<string, string | undefined> = (env ?? (import.meta as any).env) as Record<string, string | undefined>;
  const url = resolved.TURSO_DATABASE_URL;
  const authToken = resolved.TURSO_AUTH_TOKEN;

  if (!url) throw new Error('TURSO_DATABASE_URL is not set');

  return createClient({ url, ...(authToken ? { authToken } : {}) });
}

/**
 * Ambil semua artikel, diurutkan dari terbaru
 */
export async function getAllArticles(env?: DbEnv): Promise<Article[]> {
  const client = getClient(env);
  const result = await client.execute(
    `SELECT id, slug, title, description, date, featured, content
     FROM articles
     ORDER BY date DESC`
  );
  return result.rows.map((r) => rowToArticle(r as Record<string, unknown>));
}

/**
 * Ambil artikel berdasarkan slug
 */
export async function getArticleBySlug(slug: string, env?: DbEnv): Promise<Article | null> {
  const client = getClient(env);
  const result = await client.execute({
    sql: `SELECT id, slug, title, description, date, featured, content
          FROM articles
          WHERE slug = ?`,
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return rowToArticle(result.rows[0] as Record<string, unknown>);
}

/**
 * Ambil artikel yang di-featured
 */
export async function getFeaturedArticles(env?: DbEnv): Promise<Article[]> {
  const client = getClient(env);
  const result = await client.execute(
    `SELECT id, slug, title, description, date, featured, content
     FROM articles
     WHERE featured = 1
     ORDER BY date DESC`
  );
  return result.rows.map((r) => rowToArticle(r as Record<string, unknown>));
}

/**
 * Tambah artikel baru
 */
export async function insertArticle(article: Omit<Article, 'id'>, env?: DbEnv): Promise<void> {
  const client = getClient(env);
  await client.execute({
    sql: `INSERT INTO articles (slug, title, description, date, featured, content)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      article.slug,
      article.title,
      article.description ?? null,
      article.date,
      article.featured ? 1 : 0,
      article.content,
    ],
  });
}

/**
 * Update artikel yang sudah ada
 */
export async function updateArticle(slug: string, article: Partial<Omit<Article, 'id' | 'slug'>>, env?: DbEnv): Promise<void> {
  const client = getClient(env);
  const fields: string[] = [];
  const args: unknown[] = [];

  if (article.title !== undefined) { fields.push('title = ?'); args.push(article.title); }
  if (article.description !== undefined) { fields.push('description = ?'); args.push(article.description); }
  if (article.date !== undefined) { fields.push('date = ?'); args.push(article.date); }
  if (article.featured !== undefined) { fields.push('featured = ?'); args.push(article.featured ? 1 : 0); }
  if (article.content !== undefined) { fields.push('content = ?'); args.push(article.content); }

  if (fields.length === 0) return;
  args.push(slug);

  await client.execute({
    sql: `UPDATE articles SET ${fields.join(', ')} WHERE slug = ?`,
    args: args as InValue[],
  });
}

/**
 * Hapus artikel berdasarkan slug
 */
export async function deleteArticle(slug: string, env?: DbEnv): Promise<void> {
  const client = getClient(env);
  await client.execute({
    sql: `DELETE FROM articles WHERE slug = ?`,
    args: [slug],
  });
}

// Helper: konversi row dari libsql ke tipe Article
function rowToArticle(row: Record<string, unknown>): Article {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string | null,
    date: row.date as string,
    featured: Boolean(row.featured),
    content: row.content as string,
  };
}
