import type { APIRoute } from 'astro';
import { LinkedInAdapter, WellfoundAdapter } from '../../scraper/adapter';
import { InternshalaScraper } from '../../scraper/internshala';
import { FounditScraper } from '../../scraper/foundit';
import { getTCSScraper, getInfosysScraper } from '../../scraper/companies';
import { processAndStoreJobs, captureSnapshots } from '../../services/jobService';

export const POST: APIRoute = async () => {
  const apiToken = import.meta.env.APIFY_API_TOKEN || process.env.APIFY_API_TOKEN;

  try {
    const scrapers = [];
    
    // Add Apify scrapers if token available
    if (apiToken) {
      scrapers.push(new LinkedInAdapter(apiToken).scrape());
      scrapers.push(new WellfoundAdapter(apiToken).scrape());
    }

    // Add direct scrapers
    scrapers.push(new InternshalaScraper().scrape(5));
    scrapers.push(new FounditScraper().scrape(5));
    scrapers.push(getTCSScraper().scrape(3));
    scrapers.push(getInfosysScraper().scrape(3));

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
