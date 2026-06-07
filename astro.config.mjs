// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Allow SITE_URL to be overridden by environment variables for staging/previews
const SITE_URL = process.env.SITE_URL || 'https://techjobmarket.com';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    mode: 'directory'
  }),
  site: SITE_URL, // REQUIRED: Your final deployed domain for sitemap generation
});

