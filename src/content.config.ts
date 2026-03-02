import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.string(), // e.g. "February 22, 2026"
    description: z.string().optional(), // short summary for RSS & SEO
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    link: z.string().optional(),
    date: z.string(), // e.g. "March 2, 2026"
    image: z.string().optional(),
  }),
});

export const collections = { writing, projects };
