import type { APIRoute } from 'astro';
import { getTrendingRoles } from '../../../services/jobService';
import { isValidRegion, DEFAULT_REGION } from '../../../regions';

export const GET: APIRoute = async ({ params }) => {
  try {
    const region = params.region && isValidRegion(params.region) ? params.region : DEFAULT_REGION;
    const roles = await getTrendingRoles(region);
    
    const enrichedRoles = roles.map(r => ({
      role: r.role,
      job_count: r.job_count,
      growth: `${r.growth_percentage > 0 ? '+' : ''}${r.growth_percentage}%`,
      demand: r.job_count > (region === 'us' ? 100 : 50) ? 'Critical' : 'High'
    }));

    return new Response(JSON.stringify(enrichedRoles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
};
