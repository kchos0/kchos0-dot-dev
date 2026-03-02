/**
 * Copy button for code blocks.
 *
 * Attaches a "copy" button to every <pre> inside any element matching
 * `selector` (defaults to '.article-body'). Works with Shiki dual-theme
 * output and requires no external libraries.
 *
 * @param {string} [selector='.article-body'] - Container selector to scope the search.
 */
export function initCopyButtons(selector = '.article-body') {
  const containers = document.querySelectorAll(selector);
  if (!containers.length) return;

  containers.forEach((container) => {
    container.querySelectorAll('pre').forEach((pre) => {
      // Avoid double-injecting when the script runs more than once (e.g. SPA nav)
      if (pre.querySelector('.code-copy-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.textContent = 'copy';

      pre.appendChild(btn);

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (!code) return;

        // Guard: clipboard API may be unavailable in non-secure contexts
        if (!navigator.clipboard) {
          console.warn('copy-button: navigator.clipboard is not available.');
          return;
        }

        navigator.clipboard.writeText(code.innerText).then(() => {
          btn.textContent = 'copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch((err) => {
          console.error('copy-button: failed to copy text.', err);
        });
      });
    });
  });
}
