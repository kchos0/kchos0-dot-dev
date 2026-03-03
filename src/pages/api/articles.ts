import { insertArticle, updateArticle } from '../../lib/db';
import { getRuntimeEnv } from '../../lib/runtime';

export async function POST({ request, redirect, locals }: {
  request: Request;
  redirect: (url: string) => Response;
  locals: unknown;
}) {
  const env = getRuntimeEnv(locals);

  const formData = await request.formData();
  const action = formData.get('_action') as string;

  const title = (formData.get('title') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim().toLowerCase();
  const slug = rawSlug
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
  const description = (formData.get('description') as string)?.trim() || null;
  const dateRaw = formData.get('date') as string;
  const featured = formData.get('featured') === '1';
  const content = (formData.get('content') as string)?.trim();

  if (!title || !slug || !dateRaw || !content) {
    return new Response('Missing required fields', { status: 400 });
  }

  // Format date: "2026-03-02" → "March 2, 2026"
  const date = new Date(dateRaw + 'T12:00:00Z').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (action === 'update') {
    const originalSlug = (formData.get('original_slug') as string)?.trim();
    if (!originalSlug) return new Response('Missing original_slug', { status: 400 });

    await updateArticle(originalSlug, { slug, title, description, date, featured, content }, env);
    return redirect(`/writing/${slug}`);
  }

  // Default: insert new article
  await insertArticle({ slug, title, description, date, featured, content }, env);
  return redirect(`/writing/${slug}`);
}
