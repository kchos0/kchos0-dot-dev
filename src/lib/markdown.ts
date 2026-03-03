import { marked } from 'marked';

// Strip raw HTML blocks to prevent XSS
marked.use({
  renderer: {
    html: () => '',
  },
});

export { marked };
