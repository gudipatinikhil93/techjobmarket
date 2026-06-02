import type { APIRoute } from 'astro';
import { MockScraper } from '../../scraper/adapter';
import { processAndStoreJobs } from '../../services/jobService';

export const POST: APIRoute = async () => {
  try {
    const scraper = new MockScraper();
    const rawJobs = await scraper.scrape();
    await processAndStoreJobs(rawJobs);

    return new Response(JSON.stringify({ 
      success: true, 
      count: rawJobs.length,
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
