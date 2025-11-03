import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://puffert.github.io',
  base: isProduction ? '/eriksson' : '/',
  integrations: [sitemap()],
  output: 'static',
});
