import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const offering = z.object({
  title: z.string(),
  summary: z.string(),
  icon: z.enum(['shield', 'cloud', 'chart', 'cog', 'code', 'users', 'network', 'lock', 'database', 'support']).default('cog'),
  order: z.number().default(100),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  draft: z.boolean().default(false),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: offering,
});

const solutions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/solutions' }),
  schema: offering.extend({ benefits: z.array(z.string()).default([]) }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    lead: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
  }),
});

export const collections = { services, solutions, pages };
