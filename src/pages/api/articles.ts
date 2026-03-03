import { insertArticle, updateArticle, deleteArticle } from '../../lib/db';
import { getRuntimeEnv } from '../../lib/runtime';

export async function POST({
  request,
  redirect,
  locals,
}: {
  request: Request;
  redirect: (url: string) => Response;
  locals: unknown;
}) {
  const env = getRuntimeEnv(locals);

  const formData = await request.formData();
  const action = formData.get('_action') as string | null;

  // Handle delete action
  if (action === 'delete') {
    const slug = formData.get('slug') as string | null;
    if (!slug) return new Response('Missing slug', { status: 400 });
    await deleteArticle(slug, env);
    return redirect('/admin');
  }

  // Handle quick hide/unhide toggle
  if (action === 'set_hidden') {
    const slug = formData.get('slug') as string | null;
    const hidden = formData.get('hidden') === '1';
    if (!slug) return new Response('Missing slug', { status: 400 });
    await updateArticle(slug, { hidden }, env);
    return redirect('/admin');
  }

  const title = (formData.get('title') as string | null)?.trim();
  const rawSlug = (formData.get('slug') as string | null)?.trim().toLowerCase() ?? '';
  const slug = rawSlug
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
  const description = (formData.get('description') as string | null)?.trim() || null;
  const date = formData.get('date') as string | null; // ISO format: YYYY-MM-DD
  const featured = formData.get('featured') === '1';
  const hidden = formData.get('hidden') === '1';
  const content = (formData.get('content') as string | null)?.trim();

  if (!title || !slug || !date || !content) {
    return new Response('Missing required fields', { status: 400 });
  }

  if (action === 'update') {
    const originalSlug = (formData.get('original_slug') as string | null)?.trim();
    if (!originalSlug) return new Response('Missing original_slug', { status: 400 });

    await updateArticle(originalSlug, { slug, title, description, date, featured, hidden, content }, env);
    return redirect(`/writing/${slug}`);
  }

  // Default: insert new article
  await insertArticle({ slug, title, description, date, featured, hidden, content }, env);
  return redirect(`/writing/${slug}`);
}
