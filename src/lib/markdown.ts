import { marked } from 'marked';

// Strip raw HTML blocks to prevent XSS
marked.use({
  renderer: {
    html: () => '',
  },
});

// Module-level cache for rendered markdown (reused within same Worker isolate)
const markdownCache = new Map<string, string>();

/**
 * Render markdown to HTML with caching for improved performance.
 * Cache is stored in memory and reused within the same Worker isolate.
 *
 * @param content - Markdown content to render
 * @param options - Marked options (optional)
 * @returns Rendered HTML string
 */
export async function renderMarkdown(
  content: string,
  options?: marked.MarkedOptions
): Promise<string> {
  // Create cache key from content and options
  const cacheKey = JSON.stringify({ content, options });

  // Check cache first
  const cached = markdownCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  // Render and cache the result
  const html = await marked.parse(content, options);
  markdownCache.set(cacheKey, html);

  return html;
}

// Export marked for backward compatibility and direct access if needed
export { marked };
