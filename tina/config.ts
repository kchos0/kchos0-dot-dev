import { defineConfig } from 'tinacms';

export default defineConfig({
  // Local-only setup — no TinaCloud credentials needed
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        label: 'Writing',
        name: 'writing',
        path: 'src/content/writing',
        format: 'md',
        fields: [
          {
            type: 'string',
            label: 'Title',
            name: 'title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            label: 'Date',
            name: 'date',
            description: 'e.g. February 22, 2026',
            required: true,
          },
          {
            type: 'boolean',
            label: 'Featured',
            name: 'featured',
            description: 'Show in the "Selected Writings" section on the homepage',
          },
          {
            type: 'rich-text',
            label: 'Body',
            name: 'body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
