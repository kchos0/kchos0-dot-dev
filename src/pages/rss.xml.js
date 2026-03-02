import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import config from '../../config.json';

// Extracts a plain-text excerpt from raw markdown body
function bodyExcerpt(body = '', maxLen = 160) {
  const lines = body.split('\n');
  for (const line of lines) {
    const s = line.trim();
    if (!s || s.startsWith('#') || s.startsWith('<') || s.startsWith('!') || s.startsWith('---')) continue;
    const text = s
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1');
    return text.length > maxLen ? text.slice(0, maxLen - 3) + '...' : text;
  }
  return '';
}

export async function GET(context) {
  const writing = await getCollection('writing');

  const sorted = writing.sort(
    (a, b) => Date.parse(b.data.date) - Date.parse(a.data.date)
  );

  return rss({
    title: `${config.site_name} — writing`,
    description: config.description,
    site: context.site,
    items: sorted.map((article) => ({
      title: article.data.title,
      pubDate: new Date(article.data.date),
      description: article.data.description || bodyExcerpt(article.body),
      link: `/writing/${article.id}/`,
    })),
    customData: `<language>id</language>`,
  });
}
