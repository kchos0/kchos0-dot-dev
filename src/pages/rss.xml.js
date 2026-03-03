import rss from '@astrojs/rss';
import { getAllArticles } from '../lib/db';
import config from '../../config.json';

// Extracts a plain-text excerpt from raw markdown content
function bodyExcerpt(content = '', maxLen = 160) {
  const lines = content.split('\n');
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
  const articles = await getAllArticles();

  return rss({
    title: `${config.site_name} — writing`,
    description: config.description,
    site: context.site,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.date),
      description: article.description || bodyExcerpt(article.content),
      link: `/writing/${article.slug}/`,
    })),
    customData: `<language>id</language>`,
  });
}
