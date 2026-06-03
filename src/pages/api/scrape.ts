import type { APIRoute } from 'astro';
import { LinkedInAdapter, WellfoundAdapter } from '../../scraper/adapter';
import { getGoogleScraper, getMicrosoftScraper, getMetaScraper } from '../../scraper/companies';
import { IndeedPlaywrightScraper } from '../../scraper/indeedPlaywright';
import { processAndStoreJobs, captureSnapshots } from '../../services/jobService';

export const POST: APIRoute = async () => {
  const apiToken = import.meta.env.APIFY_API_TOKEN || process.env.APIFY_API_TOKEN;

  try {
    const scrapers = [];
    
    // Add US Tech Job Scrapers
    if (apiToken) {
      scrapers.push(new LinkedInAdapter(apiToken).scrape());
      scrapers.push(new WellfoundAdapter(apiToken).scrape());
    }

    // Playwright based US scrapers
    scrapers.push(new IndeedPlaywrightScraper().scrape(15));
    scrapers.push(getGoogleScraper().scrape(5));
    scrapers.push(getMicrosoftScraper().scrape(5));
    scrapers.push(getMetaScraper().scrape(5));

    const jobResults = await Promise.allSettled(scrapers);
    const allJobs = jobResults
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);
    
    if (allJobs.length > 0) {
      await processAndStoreJobs(allJobs);
    }
    
    await captureSnapshots();

    return new Response(JSON.stringify({ 
      success: true, 
      count: allJobs.length,
      message: 'US Market scraping and intelligence update completed.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Scrape API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
