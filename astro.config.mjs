// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: pakeiskite į tikrąjį domeną (svarbu SEO: canonical, hreflang, sitemap)
const SITE = 'https://denero-web.netlify.app';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  output: 'static',
  build: {
    // Jokių inline <style> – leidžia griežtą CSP be 'unsafe-inline'
    inlineStylesheets: 'never',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/aciu') && !page.includes('/thank-you')
    }),
  ],
});
