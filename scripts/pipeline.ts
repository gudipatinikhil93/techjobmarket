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
  const region = process.argv[2] || 'us';
  console.log(`--- STARTING ENHANCED CAREER INTELLIGENCE PIPELINE [REGION: ${region.toUpperCase()}] ---`);
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    // For now, most scrapers are US-centric, we might need regional adapters in the future
    const scrapers = [
      new GreenhouseAdapter().scrape(),
      new LeverAdapter().scrape(),
      new AshbyAdapter().scrape(),
      new RemoteOKAdapter().scrape(),
      new IndeedPlaywrightScraper().scrape(20) 
    ];

    console.log(`[Pipeline] Triggering ${scrapers.length} job scraping sources concurrently for ${region}...`);

    const jobResults = await Promise.allSettled(scrapers);
    const allJobs = jobResults
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);

    console.log(`[Pipeline] Fetched ${allJobs.length} total raw jobs for ${region}.`);

    const failedCount = jobResults.filter(r => r.status === 'rejected').length;
    if (failedCount > 0) {
      console.warn(`[Pipeline] ${failedCount} sources failed to fetch job data.`);
    }

    // 2. Processing & Storage for Jobs
    if (allJobs.length > 0) {
      console.log(`[Pipeline] Processing and storing jobs for ${region}...`);
      await processAndStoreJobs(allJobs, region);
      console.log(`[Pipeline] Successfully processed and stored jobs for ${region}.`);
    } else {
      console.log(`[Pipeline] No new jobs fetched for ${region}, skipping storage.`);
    }

    // 2.1 Fetch and Store Layoffs
    console.log(`[Pipeline] Fetching layoffs data for ${region}...`);
    try {
      const layoffsAdapter = new LayoffsFyiAdapter();
      const rawLayoffs = await layoffsAdapter.scrape();
      if (rawLayoffs.length > 0) {
        await processAndStoreLayoffs(rawLayoffs, region);
      } else {
        console.log(`[Pipeline] No layoffs data fetched for ${region}.`);
      }
    } catch (layoffErr) {
      console.error(`[Pipeline] Layoffs scraping failed for ${region}:`, layoffErr);
    }

    // 3. Snapshots (Historical Tracking)
    console.log(`[Pipeline] Capturing historical snapshots for ${region}...`);
    await captureSnapshots(region);

    // 4. AI Insights
    console.log(`[Pipeline] Generating AI insights for ${region}...`);
    await generateWeeklyInsights(region);

    console.log(`--- PIPELINE COMPLETED SUCCESSFULLY [REGION: ${region.toUpperCase()}] ---`);
  } catch (error) {
    console.error(`[Pipeline] Pipeline failed for ${region}:`, error);
    process.exit(1);
  }
}

main();
