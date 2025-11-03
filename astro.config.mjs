import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// For GitHub Pages subdirectory: use '/eriksson'
// For custom domain (vortexnode.net): use '/'
// Set CUSTOM_DOMAIN=true in GitHub Actions to use custom domain
const isProduction = process.env.NODE_ENV === 'production' || process.env.CI === 'true';
const useCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

export default defineConfig({
  site: useCustomDomain ? 'https://vortexnode.net' : 'https://puffert.github.io',
  base: (isProduction && !useCustomDomain) ? '/eriksson' : '/',
  integrations: [sitemap()],
  output: 'static',
});
