/**
 * Extract a plain-text excerpt from raw Markdown content.
 * Skips headings, HTML blocks, horizontal rules, and blank lines.
 * Strips inline Markdown formatting (bold, italic, code, links).
 */
export function makeExcerpt(content: string, maxLen = 160): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const s = line.trim();
    if (
      !s ||
      s.startsWith('#') ||
      s.startsWith('<') ||
      s.startsWith('!') ||
      s.startsWith('---')
    )
      continue;
    let excerpt = s
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1');
    if (excerpt.length > maxLen) excerpt = excerpt.slice(0, maxLen - 3) + '...';
    return excerpt;
  }
  return '';
}
