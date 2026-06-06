import type { APIRoute } from 'astro';
import { getMarketOutlook } from '../services/outlookService';
import { regions } from '../regions';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Astro site is not defined in astro.config.mjs');
  }

  const allPages: string[] = [`${site.origin}/`];

  for (const [regionId, config] of Object.entries(regions)) {
    if (!config.public) continue;
    
    const staticPages = [
      `${site.origin}/${regionId}`,
      `${site.origin}/${regionId}/about`,
      `${site.origin}/${regionId}/privacy-policy`,
      `${site.origin}/${regionId}/terms-and-conditions`,
      `${site.origin}/${regionId}/cities`,
      `${site.origin}/${regionId}/layoffs`,
      `${site.origin}/${regionId}/roles`,
      `${site.origin}/${regionId}/salaries`,
      `${site.origin}/${regionId}/skills`,
      `${site.origin}/${regionId}/trends`,
      `${site.origin}/${regionId}/contact`,
    ];

    const marketOutlook = await getMarketOutlook(regionId);
    const rolePages = marketOutlook
      .filter(r => r.role)
      .map(r => `${site.origin}/${regionId}/role/${encodeURIComponent(r.role)}`);

    allPages.push(...staticPages, ...rolePages);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url.endsWith('/') || Object.keys(regions).some(r => url.endsWith(`/${r}`)) ? '1.0' : '0.7'}</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
