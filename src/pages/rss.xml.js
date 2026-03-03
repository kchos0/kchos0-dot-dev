import rss from '@astrojs/rss';
import { getAllArticles } from '../lib/db';
import { getRuntimeEnv } from '../lib/runtime';
import { makeExcerpt } from '../utils/excerpt';
import { getISODate } from '../utils/date';
import config from '../../config.json';

export async function GET(context) {
  const env = getRuntimeEnv(context.locals);
  let articles = [];
  try {
    articles = await getAllArticles(env);
  } catch (err) {
    console.error('RSS feed DB error:', err);
  }

  const feed = await rss({
    title: `${config.site_name} — writing`,
    description: config.description,
    site: context.site,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(getISODate(article.date)),
      description: article.description || makeExcerpt(article.content),
      author: config.author,
      link: `/writing/${article.slug}/`,
    })),
    customData: `<language>id</language>`,
  });

  feed.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  return feed;
}
