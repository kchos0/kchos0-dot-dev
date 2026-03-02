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
            type: 'string',
            label: 'Description',
            name: 'description',
            description: 'Short summary used for RSS feed and SEO meta description',
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
      {
        label: 'Projects',
        name: 'projects',
        path: 'src/content/projects',
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
            label: 'Description',
            name: 'description',
            description: 'Short summary of the project',
            required: true,
          },
          {
            type: 'string',
            label: 'Link',
            name: 'link',
            description: 'Project URL (GitHub repo, live demo, etc.)',
          },
          {
            type: 'string',
            label: 'Date',
            name: 'date',
            description: 'e.g. March 2, 2026',
            required: true,
          },
          {
            type: 'image',
            label: 'Image',
            name: 'image',
            description: 'Project screenshot or thumbnail',
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
