import 'dotenv/config';
import { LinkedInAdapter, WellfoundAdapter } from '../src/scraper/adapter';
import { IndeedPlaywrightScraper } from '../src/scraper/indeedPlaywright';
import { getGoogleScraper, getMicrosoftScraper, getMetaScraper } from '../src/scraper/companies';
import { processAndStoreJobs, captureSnapshots } from '../src/services/jobService';
import { generateWeeklyInsights } from '../src/services/aiService';

async function main() {
  const apiToken = process.env.APIFY_API_TOKEN;

  console.log('--- STARTING ENHANCED CAREER INTELLIGENCE PIPELINE ---');

  try {
    const scrapers = [];
    
    if (apiToken) {
      console.log('Adding Apify scrapers...');
      scrapers.push(new LinkedInAdapter(apiToken).scrape());
      scrapers.push(new WellfoundAdapter(apiToken).scrape());
    }

    console.log('Adding direct scrapers (Indeed, US Companies)...');
    scrapers.push(new IndeedPlaywrightScraper().scrape(10));
    scrapers.push(getGoogleScraper().scrape(5));
    scrapers.push(getMicrosoftScraper().scrape(5));
    scrapers.push(getMetaScraper().scrape(5));

    const jobResults = await Promise.allSettled(scrapers);
    const allJobs = jobResults
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);

    console.log(`Fetched ${allJobs.length} total raw jobs from all sources.`);

    // 2. Processing & Storage
    if (allJobs.length > 0) {
      console.log('Processing and storing jobs...');
      await processAndStoreJobs(allJobs);
    } else {
      console.log('No new jobs fetched, skipping storage.');
    }

    // 3. Snapshots (Historical Tracking)
    console.log('Capturing historical snapshots...');
    await captureSnapshots();

    // 4. AI Insights
    console.log('Generating AI insights...');
    await generateWeeklyInsights();

    console.log('--- PIPELINE COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Pipeline failed:', error);
    process.exit(1);
  }
}

main();
