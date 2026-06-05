import 'dotenv/config';
import { IndeedPlaywrightScraper } from '../src/scraper/indeedPlaywright';
import { processAndStoreJobs } from '../src/services/jobService';

async function testScrape() {
  console.log('🚀 Starting Indeed Scraper Test...');
  
  const scraper = new IndeedPlaywrightScraper();
  
  try {
    const jobs = await scraper.scrape(5); // Scrape 5 jobs for testing
    
    if (jobs.length === 0) {
      console.warn('⚠️ No jobs found. Check selectors or Wellfound site status.');
      return;
    }

    console.log(`✅ Scraped ${jobs.length} jobs.`);
    console.table(jobs.map(j => ({
      title: j.title,
      company: j.company,
      city: j.city,
      skills: j.skills.length, // Should be 0 here as Indeed scraper doesn't populate it yet
      url: j.url.substring(0, 30) + '...'
    })));

    console.log('📦 Inserting into Supabase...');
    const stored = await processAndStoreJobs(jobs);
    console.log(`✅ Successfully stored ${stored.length} jobs in database.`);
    
    if (stored.length > 0) {
      console.log('--- Extracted Skills Sample ---');
      stored.slice(0, 3).forEach(j => {
        console.log(`Job: ${j.title} @ ${j.company}`);
        console.log(`Skills: ${j.skills.join(', ')}`);
        console.log('---');
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testScrape();
