import { LayoffsFyiAdapter } from '../src/scraper/layoffsFyi';
import { processAndStoreLayoffs } from '../src/services/layoffService';

async function testLayoffsScraper() {
  console.log('--- Starting Layoffs.fyi Scraper Test ---');
  const scraper = new LayoffsFyiAdapter();
  try {
    const layoffs = await scraper.scrape();
    console.log(`Scraped ${layoffs.length} layoff entries.`);
    if (layoffs.length > 0) {
      console.log('First 5 layoff entries:');
      layoffs.slice(0, 5).forEach((layoff, index) => {
        console.log(`--- Entry ${index + 1} ---`);
        console.log(`Company: ${layoff.company}`);
        console.log(`Layoffs Count: ${layoff.layoffs_count}`);
        console.log(`Percentage Affected: ${layoff.percentage_affected}`);
        console.log(`Date: ${layoff.date}`);
        console.log(`Sector: ${layoff.sector}`);
        console.log(`Reason: ${layoff.reason}`);
        console.log(`Source URL: ${layoff.source_url}`);
      });
      console.log('Storing layoffs in the database...');
      await processAndStoreLayoffs(layoffs);
    } else {
      console.log('No layoff entries scraped. Check scraper logic or website availability.');
    }
  } catch (error) {
    console.error('Error during layoffs scraper test:', error);
  }
  console.log('--- Layoffs.fyi Scraper Test Finished ---');
}

testLayoffsScraper();
