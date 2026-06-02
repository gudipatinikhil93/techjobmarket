import type { APIRoute } from 'astro';
import { getTrendingRoles } from '../../services/jobService';

export const GET: APIRoute = async () => {
  try {
    const roles = await getTrendingRoles();
    
    const enrichedRoles = roles.map(r => ({
      role: r.role,
      job_count: r.job_count,
      growth: `+${r.growth_percentage}%`,
      demand: r.job_count > 100 ? 'Critical' : 'High'
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
