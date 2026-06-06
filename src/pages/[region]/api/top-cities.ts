import type { APIRoute } from 'astro';
import { getTopCities } from '../../../services/jobService';
import { isValidRegion, DEFAULT_REGION } from '../../../regions';

export const GET: APIRoute = async ({ params }) => {
  try {
    const region = params.region && isValidRegion(params.region) ? params.region : DEFAULT_REGION;
    const cities = await getTopCities(region);
    
    // Baseline for hiring index
    const baseline = region === 'us' ? 50 : 25;
    
    const enrichedCities = cities.map(c => ({
      city: c.city,
      hiringIndex: Math.min(10, (c.job_count / baseline) + 5).toFixed(1), // Normalized index
      avgSalary: c.avg_salary
    }));

    return new Response(JSON.stringify(enrichedCities), {
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
