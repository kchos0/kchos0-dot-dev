import { marked } from '../../lib/markdown';
import { formatDate } from '../../utils/date';

// Inline all CSS so the iframe is fully self-contained
const globalCss = `
html[data-theme='dark'] {
  --bg-color: #111111;
  --text-main: #efefef;
  --text-muted: #888888;
  --border-color: #333333;
  --hover-color: #efefef;
}
:root {
  --bg-color: #ffffff;
  --text-main: #000000;
  --text-muted: #888888;
  --border-color: #efefef;
  --hover-color: #333333;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 6rem;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 100%; -webkit-text-size-adjust: 100%; }
body {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: var(--font-sans);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
::selection { background-color: var(--text-main); color: var(--bg-color); }
a { color: inherit; text-decoration: none; transition: color 0.2s ease, opacity 0.2s ease; }
ul { list-style: none; }
`;

const articleCss = `
.back-link {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  display: inline-block;
}
.article-header {
  margin-top: 1.5rem;
  margin-bottom: var(--space-lg);
}
.article-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  margin-bottom: 0.5rem;
  line-height: 1.1;
}
.article-date {
  font-family: monospace;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.article-body {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--text-main);
}
.article-body p { margin-bottom: 1.5rem; }
.article-body h2 {
  font-family: var(--font-sans);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 3rem;
  margin-bottom: 0.85rem;
  line-height: 1.2;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border-color);
}
.article-body h3 {
  font-family: var(--font-sans);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 2.5rem;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}
.article-body h1, .article-body h4, .article-body h5, .article-body h6 {
  font-family: var(--font-sans);
  font-weight: 700;
  line-height: 1.2;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
.article-body ul, .article-body ol { list-style: disc; padding-left: 1.75rem; margin-bottom: 1.5rem; }
.article-body ol { list-style: decimal; }
.article-body li { margin-bottom: 0.45rem; }
.article-body hr { border: none; border-top: 1px dashed var(--border-color); margin: 2.5rem 0; }
.article-body blockquote {
  border-left: 3px solid var(--border-color);
  padding: 0.25rem 0 0.25rem 1.25rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
  font-style: italic;
}
.article-body code {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, 'Courier New', monospace;
  font-size: 0.85em;
  background-color: var(--border-color);
  padding: 0.15em 0.45em;
  border-radius: 4px;
}
html[data-theme='dark'] .article-body code { background-color: #2a2a2a; }
.article-body pre {
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 1.1rem 1.25rem;
  overflow-x: auto;
  margin-bottom: 1.75rem;
  font-size: 0.88rem;
  line-height: 1.65;
  background-color: #f6f8fa;
}
html[data-theme='dark'] .article-body pre { background-color: #161b22; border-color: #30363d; }
.article-body pre code { background: none; padding: 0; border-radius: 0; font-size: inherit; }
.article-body strong, .article-body b { font-weight: 700; }
.article-body em, .article-body i { font-style: italic; }
.article-body img {
  max-width: 100%; height: auto; display: block;
  border-radius: 8px; border: 1px solid var(--border-color); margin-top: 1rem;
}
.article-body img + p em, .article-body img + em {
  display: block; text-align: center;
  font-size: 0.9rem; color: var(--text-muted); margin: 0.5rem 0 2rem 0;
}
`;

export async function POST({ request }: { request: Request }) {
  const form = await request.formData();
  const title = (form.get('title') as string | null) ?? 'Untitled';
  const date = (form.get('date') as string | null) ?? '';
  const content = (form.get('content') as string | null) ?? '';
  const theme = (form.get('theme') as string | null) ?? 'light';

  const contentHtml = await marked.parse(content, { gfm: true, breaks: false });
  const displayDate = date ? formatDate(date) : '';

  const html = `<!doctype html>
<html lang="en" data-theme="${theme === 'dark' ? 'dark' : ''}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    ${globalCss}
    ${articleCss}
    body { padding: 2rem 2.5rem; }
  </style>
</head>
<body>
  <article>
    <header class="article-header">
      <h1 class="article-title">${title}</h1>
      <time class="article-date">${displayDate}</time>
    </header>
    <div class="article-body">${contentHtml}</div>
  </article>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
