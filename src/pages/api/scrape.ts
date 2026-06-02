import type { APIRoute } from 'astro';
import { LinkedInAdapter, WellfoundAdapter } from '../../scraper/adapter';
import { processAndStoreJobs, captureSnapshots } from '../../services/jobService';

export const POST: APIRoute = async () => {
  const apiToken = import.meta.env.APIFY_API_TOKEN || process.env.APIFY_API_TOKEN;

  if (!apiToken) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'APIFY_API_TOKEN is missing. Please configure it in your environment variables to enable real scraping.' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const linkedin = new LinkedInAdapter(apiToken);
    const wellfound = new WellfoundAdapter(apiToken);

    const [liJobs, wfJobs] = await Promise.all([
      linkedin.scrape(),
      wellfound.scrape()
    ]);

    const allJobs = [...liJobs, ...wfJobs];
    
    if (allJobs.length > 0) {
      await processAndStoreJobs(allJobs);
    }
    
    await captureSnapshots();

    return new Response(JSON.stringify({ 
      success: true, 
      count: allJobs.length,
      message: 'Scraping and storage completed successfully.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
