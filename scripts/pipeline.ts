import 'dotenv/config';
import { IndeedPlaywrightScraper } from '../src/scraper/indeedPlaywright';
import { GreenhouseAdapter } from '../src/scraper/greenhouse';
import { LeverAdapter } from '../src/scraper/lever';
import { AshbyAdapter } from '../src/scraper/ashby';
import { RemoteOKAdapter } from '../src/scraper/remoteok';
import { LayoffsFyiAdapter } from '../src/scraper/layoffsFyi';
import { processAndStoreJobs, captureSnapshots } from '../src/services/jobService';
import { processAndStoreLayoffs } from '../src/services/layoffService';
import { generateWeeklyInsights } from '../src/services/aiService';

async function main() {
  console.log('--- STARTING ENHANCED CAREER INTELLIGENCE PIPELINE ---');
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    const scrapers = [
      new GreenhouseAdapter().scrape(),
      new LeverAdapter().scrape(),
      new AshbyAdapter().scrape(),
      new RemoteOKAdapter().scrape(),
      // Keep Indeed but perhaps limit it or keep it as is
      new IndeedPlaywrightScraper().scrape(20) 
    ];

    console.log(`[Pipeline] Triggering ${scrapers.length} job scraping sources concurrently...`);

    const jobResults = await Promise.allSettled(scrapers);
    const allJobs = jobResults
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);

    console.log(`[Pipeline] Fetched ${allJobs.length} total raw jobs from all sources.`);

    const failedCount = jobResults.filter(r => r.status === 'rejected').length;
    if (failedCount > 0) {
      console.warn(`[Pipeline] ${failedCount} sources failed to fetch job data.`);
    }

    // 2. Processing & Storage for Jobs
    if (allJobs.length > 0) {
      console.log('[Pipeline] Processing and storing jobs...');
      const storedCount = await processAndStoreJobs(allJobs);
      console.log(`[Pipeline] Successfully processed and stored jobs.`);
    } else {
      console.log('[Pipeline] No new jobs fetched, skipping storage.');
    }

    // 2.1 Fetch and Store Layoffs
    console.log('[Pipeline] Fetching layoffs data...');
    try {
      const layoffsAdapter = new LayoffsFyiAdapter();
      const rawLayoffs = await layoffsAdapter.scrape();
      if (rawLayoffs.length > 0) {
        await processAndStoreLayoffs(rawLayoffs);
      } else {
        console.log('[Pipeline] No layoffs data fetched.');
      }
    } catch (layoffErr) {
      console.error('[Pipeline] Layoffs scraping failed:', layoffErr);
    }

    // 3. Snapshots (Historical Tracking)
    console.log('[Pipeline] Capturing historical snapshots...');
    await captureSnapshots();

    // 4. AI Insights
    console.log('[Pipeline] Generating AI insights...');
    await generateWeeklyInsights();

    console.log('--- PIPELINE COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('[Pipeline] Pipeline failed:', error);
    process.exit(1);
  }
}

main();
