import { createClient, type InValue } from '@libsql/client';

// Column lists for DRY SQL
const LIST_COLS = 'id, slug, title, description, date, featured, hidden';
const ALL_COLS = `${LIST_COLS}, content`;

// Project-specific column lists
const PROJECT_LIST_COLS = 'id, slug, title, description, url, date, featured, hidden';
const PROJECT_ALL_COLS = `${PROJECT_LIST_COLS}, content`;

export type Article = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  date: string;
  featured: boolean;
  hidden: boolean;
  content: string;
};

/** Article without the heavy `content` column — used by listing pages */
export type ArticleSummary = Omit<Article, 'content'>;

// Module-level client cache: reuse within the same Worker isolate
const clientCache = new Map<string, ReturnType<typeof createClient>>();

function getClient(env: Record<string, string | undefined>) {
  const url = env.TURSO_DATABASE_URL;
  const authToken = env.TURSO_AUTH_TOKEN;

  if (!url) throw new Error('TURSO_DATABASE_URL is not set');

  const cached = clientCache.get(url);
  if (cached) return cached;

  const client = createClient({ url, ...(authToken ? { authToken } : {}) });
  clientCache.set(url, client);
  return client;
}

/** Convert a DB row to ArticleSummary (no content) */
function rowToSummary(row: Record<string, unknown>): ArticleSummary {
  return {
    id: Number(row.id),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    description: row.description != null ? String(row.description) : null,
    date: String(row.date ?? ''),
    featured: Boolean(row.featured),
    hidden: Boolean(row.hidden),
  };
}

/** Convert a DB row to Article (includes content) */
function rowToArticle(row: Record<string, unknown>): Article {
  return {
    ...rowToSummary(row),
    content: String(row.content ?? ''),
  };
}

/**
 * Fetch latest + featured articles in a single round trip (home page)
 * Only returns articles that are not hidden.
 */
export async function getHomepageData(
  env: Record<string, string | undefined>,
  limit = 3
): Promise<{ latest: ArticleSummary[]; featured: ArticleSummary[] }> {
  const client = getClient(env);
  const batchResults = await client.batch(
    [
      {
        sql: `SELECT ${LIST_COLS} FROM articles WHERE hidden = 0 ORDER BY date DESC LIMIT ?`,
        args: [limit],
      },
      {
        sql: `SELECT ${LIST_COLS} FROM articles WHERE featured = 1 AND hidden = 0 ORDER BY date DESC`,
        args: [],
      },
    ],
    'read'
  );
  return {
    latest: (batchResults[0]?.rows ?? []).map((r) => rowToSummary(r as Record<string, unknown>)),
    featured: (batchResults[1]?.rows ?? []).map((r) => rowToSummary(r as Record<string, unknown>)),
  };
}

/**
 * Fetch all articles without content (for listing pages — excludes hidden)
 */
export async function getArticleSummaries(
  env: Record<string, string | undefined>
): Promise<ArticleSummary[]> {
  const client = getClient(env);
  const result = await client.execute(
    `SELECT ${LIST_COLS} FROM articles WHERE hidden = 0 ORDER BY date DESC`
  );
  return result.rows.map((r) => rowToSummary(r as Record<string, unknown>));
}

/**
 * Fetch all articles without content for admin (includes hidden articles)
 */
export async function getAdminArticleSummaries(
  env: Record<string, string | undefined>
): Promise<ArticleSummary[]> {
  const client = getClient(env);
  const result = await client.execute(`SELECT ${LIST_COLS} FROM articles ORDER BY date DESC`);
  return result.rows.map((r) => rowToSummary(r as Record<string, unknown>));
}

/**
 * Fetch all articles with content (for RSS feed — excludes hidden)
 */
export async function getAllArticles(env: Record<string, string | undefined>): Promise<Article[]> {
  const client = getClient(env);
  const result = await client.execute(
    `SELECT ${ALL_COLS} FROM articles WHERE hidden = 0 ORDER BY date DESC`
  );
  return result.rows.map((r) => rowToArticle(r as Record<string, unknown>));
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(
  slug: string,
  env: Record<string, string | undefined>
): Promise<Article | null> {
  const client = getClient(env);
  const result = await client.execute({
    sql: `SELECT ${ALL_COLS} FROM articles WHERE slug = ?`,
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return rowToArticle(result.rows[0] as Record<string, unknown>);
}

/**
 * Insert a new article
 */
export async function insertArticle(
  article: Omit<Article, 'id'>,
  env: Record<string, string | undefined>
): Promise<void> {
  const client = getClient(env);
  await client.execute({
    sql: `INSERT INTO articles (slug, title, description, date, featured, hidden, content)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      article.slug,
      article.title,
      article.description ?? null,
      article.date,
      article.featured ? 1 : 0,
      article.hidden ? 1 : 0,
      article.content,
    ],
  });
}

/**
 * Update an existing article (supports slug changes)
 */
export async function updateArticle(
  originalSlug: string,
  article: Partial<Omit<Article, 'id'>>,
  env: Record<string, string | undefined>
): Promise<void> {
  const client = getClient(env);
  const fields: string[] = [];
  const args: unknown[] = [];

  if (article.slug !== undefined) {
    fields.push('slug = ?');
    args.push(article.slug);
  }
  if (article.title !== undefined) {
    fields.push('title = ?');
    args.push(article.title);
  }
  if (article.description !== undefined) {
    fields.push('description = ?');
    args.push(article.description);
  }
  if (article.date !== undefined) {
    fields.push('date = ?');
    args.push(article.date);
  }
  if (article.featured !== undefined) {
    fields.push('featured = ?');
    args.push(article.featured ? 1 : 0);
  }
  if (article.hidden !== undefined) {
    fields.push('hidden = ?');
    args.push(article.hidden ? 1 : 0);
  }
  if (article.content !== undefined) {
    fields.push('content = ?');
    args.push(article.content);
  }

  if (fields.length === 0) return;
  args.push(originalSlug);

  await client.execute({
    sql: `UPDATE articles SET ${fields.join(', ')} WHERE slug = ?`,
    args: args as InValue[],
  });
}

/**
 * Delete an article by slug
 */
export async function deleteArticle(
  slug: string,
  env: Record<string, string | undefined>
): Promise<void> {
  const client = getClient(env);
  await client.execute({
    sql: `DELETE FROM articles WHERE slug = ?`,
    args: [slug],
  });
}

// ─── Projects ──────────────────────────────────────────────────────────────

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  url: string | null;
  date: string;
  featured: boolean;
  hidden: boolean;
  content: string | null;
};

/** Project without the heavy `content` column — used by listing pages */
export type ProjectSummary = Omit<Project, 'content'>;

/** Convert a DB row to ProjectSummary (no content) */
function rowToProjectSummary(row: Record<string, unknown>): ProjectSummary {
  return {
    id: Number(row.id),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    description: row.description != null ? String(row.description) : null,
    url: row.url != null ? String(row.url) : null,
    date: String(row.date ?? ''),
    featured: Boolean(row.featured),
    hidden: Boolean(row.hidden),
  };
}

/** Convert a DB row to Project (includes content) */
function rowToProject(row: Record<string, unknown>): Project {
  return {
    ...rowToProjectSummary(row),
    content: row.content != null ? String(row.content) : null,
  };
}

/**
 * Fetch all projects without content (for listing pages — excludes hidden)
 */
export async function getProjectSummaries(
  env: Record<string, string | undefined>
): Promise<ProjectSummary[]> {
  const client = getClient(env);
  const result = await client.execute(
    `SELECT ${PROJECT_LIST_COLS} FROM projects WHERE hidden = 0 ORDER BY date DESC`
  );
  return result.rows.map((r) => rowToProjectSummary(r as Record<string, unknown>));
}

/**
 * Fetch all projects without content for admin (includes hidden projects)
 */
export async function getAdminProjectSummaries(
  env: Record<string, string | undefined>
): Promise<ProjectSummary[]> {
  const client = getClient(env);
  const result = await client.execute(
    `SELECT ${PROJECT_LIST_COLS} FROM projects ORDER BY date DESC`
  );
  return result.rows.map((r) => rowToProjectSummary(r as Record<string, unknown>));
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(
  slug: string,
  env: Record<string, string | undefined>
): Promise<Project | null> {
  const client = getClient(env);
  const result = await client.execute({
    sql: `SELECT ${PROJECT_ALL_COLS} FROM projects WHERE slug = ?`,
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return rowToProject(result.rows[0] as Record<string, unknown>);
}

/**
 * Insert a new project
 */
export async function insertProject(
  project: Omit<Project, 'id'>,
  env: Record<string, string | undefined>
): Promise<void> {
  const client = getClient(env);
  await client.execute({
    sql: `INSERT INTO projects (slug, title, description, url, date, featured, hidden, content)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      project.slug,
      project.title,
      project.description ?? null,
      project.url ?? null,
      project.date,
      project.featured ? 1 : 0,
      project.hidden ? 1 : 0,
      project.content ?? null,
    ],
  });
}

/**
 * Update an existing project (supports slug changes)
 */
export async function updateProject(
  originalSlug: string,
  project: Partial<Omit<Project, 'id'>>,
  env: Record<string, string | undefined>
): Promise<void> {
  const client = getClient(env);
  const fields: string[] = [];
  const args: unknown[] = [];

  if (project.slug !== undefined) {
    fields.push('slug = ?');
    args.push(project.slug);
  }
  if (project.title !== undefined) {
    fields.push('title = ?');
    args.push(project.title);
  }
  if (project.description !== undefined) {
    fields.push('description = ?');
    args.push(project.description);
  }
  if (project.url !== undefined) {
    fields.push('url = ?');
    args.push(project.url);
  }
  if (project.date !== undefined) {
    fields.push('date = ?');
    args.push(project.date);
  }
  if (project.featured !== undefined) {
    fields.push('featured = ?');
    args.push(project.featured ? 1 : 0);
  }
  if (project.hidden !== undefined) {
    fields.push('hidden = ?');
    args.push(project.hidden ? 1 : 0);
  }
  if (project.content !== undefined) {
    fields.push('content = ?');
    args.push(project.content ?? null);
  }

  if (fields.length === 0) return;
  args.push(originalSlug);

  await client.execute({
    sql: `UPDATE projects SET ${fields.join(', ')} WHERE slug = ?`,
    args: args as InValue[],
  });
}

/**
 * Delete a project by slug
 */
export async function deleteProject(
  slug: string,
  env: Record<string, string | undefined>
): Promise<void> {
  const client = getClient(env);
  await client.execute({
    sql: `DELETE FROM projects WHERE slug = ?`,
    args: [slug],
  });
}
