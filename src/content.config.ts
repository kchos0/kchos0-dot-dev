import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.string(), // e.g. "February 22, 2026"
    featured: z.boolean().default(false),
  }),
});

export const collections = { writing };
