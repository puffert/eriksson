import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// For GitHub Pages, we always need the base path in production
// In dev mode (npm run dev), base is '/'
// In build mode, base is '/eriksson'
const isProduction = process.env.NODE_ENV === 'production' || process.env.CI === 'true';

export default defineConfig({
  site: 'https://puffert.github.io',
  base: isProduction ? '/eriksson' : '/',
  integrations: [sitemap()],
  output: 'static',
});
