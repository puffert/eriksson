import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://puffert.github.io',
  base: import.meta.env.MODE === 'production' ? '/eriksson' : '/',
  integrations: [sitemap()],
  output: 'static',
});
