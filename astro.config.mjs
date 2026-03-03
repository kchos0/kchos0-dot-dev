import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://kchos0.dev',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'compile',
  }),
  session: {
    driver: 'cloudflare-kv-binding',
    options: {
      binding: 'SESSION',
    },
  },
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    syntaxHighlight: false, // Ditangani oleh marked + highlight.js di runtime
  },
});
