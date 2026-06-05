import type { APIRoute } from 'astro';
import { getMarketOutlook } from '../services/outlookService';
import { getTopSkills } from '../services/jobService'; // Assuming getTopSkills can be used for skill pages

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Astro site is not defined in astro.config.mjs');
  }

  const staticPages = [
    `${site.origin}/`,
    `${site.origin}/about`,
    `${site.origin}/privacy-policy`,
    `${site.origin}/terms-and-conditions`,
    `${site.origin}/cities`,
    `${site.origin}/layoffs`,
    `${site.origin}/roles`,
    `${site.origin}/salaries`,
    `${site.origin}/skills`,
    `${site.origin}/trends`,
    `${site.origin}/search`,
    `${site.origin}/contact`,
  ];

  const marketOutlook = await getMarketOutlook();
  const rolePages = marketOutlook
    .filter(r => r.role)
    .map(r => `${site.origin}/role/${encodeURIComponent(r.role)}`);

  const allPages = [...staticPages, ...rolePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
