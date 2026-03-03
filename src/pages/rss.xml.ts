import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getAllArticles, type Article } from '../lib/db';
import { getRuntimeEnv } from '../lib/runtime';
import { makeExcerpt } from '../utils/excerpt';
import config from '../../config.json';

export async function GET(context: APIContext): Promise<Response> {
  const env = getRuntimeEnv(context.locals);
  let articles: Article[] = [];
  try {
    articles = await getAllArticles(env);
  } catch (err) {
    console.error('RSS feed DB error:', err);
  }

  const feed = await rss({
    title: `${config.site_name} — writing`,
    description: config.description,
    site: context.site!,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.date + 'T00:00:00Z'),
      description: article.description || makeExcerpt(article.content),
      link: `/writing/${article.slug}/`,
    })),
    customData: `<language>id</language><atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml"/>`,
  });

  feed.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  return feed;
}
