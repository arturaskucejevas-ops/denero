import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const offering = z.object({
  title: z.string(),
  summary: z.string(),
  icon: z.enum(['shield', 'cloud', 'chart', 'cog', 'code', 'users', 'network', 'lock', 'database', 'support', 'doc']).default('cog'),
  order: z.number().default(100),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  draft: z.boolean().default(false),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  // Papildomi (neprivalomi) blokai išsamiam produkto puslapiui
  eyebrow: z.string().optional(),
  headline: z.string().optional(),          // H1, jei turi skirtis nuo pavadinimo
  card_summary: z.string().optional(),      // trumpesnis tekstas kortelėje
  gallery: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).default([]),
  highlights_title: z.string().optional(),
  highlights: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  reports_title: z.string().optional(),
  reports: z.array(z.string()).default([]),
  steps_title: z.string().optional(),
  steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: offering,
});

const solutions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/solutions' }),
  schema: offering.extend({
    benefits: z.array(z.string()).default([]),
    coming_soon: z.boolean().default(false),   // „Ruošiama informacija“
    price: z.string().optional(),              // rodoma kaina, pvz. „50 € + PVM / metams“
    price_note: z.string().optional(),
    price_amount: z.number().optional(),       // kaina skaičiumi (Google / AI duomenims)
    price_period: z.string().optional(),       // pvz. „P1Y“ (metai)
    cta_url: z.string().optional(),            // papildomas mygtukas, pvz. prisijungimas
    cta_label: z.string().optional(),
  }),
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
