import { chromium } from 'playwright';
import type { RawJob, JobScraper } from './adapter';

export class FounditScraper extends JobScraper {
  private baseUrl = 'https://www.foundit.in/srp/results?query=software+engineer&locations=India';

  async scrape(limit = 10): Promise<RawJob[]> {
    console.log(`[Foundit] Starting scrape for software jobs...`);
    const browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    try {
      console.log(`[Foundit] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 60000 });

      // Wait for job cards
      const jobSelector = '.srpCardWrapper';
      await page.waitForSelector(jobSelector, { timeout: 30000 });

      const jobElements = await page.$$(jobSelector);
      console.log(`[Foundit] Found ${jobElements.length} job elements.`);

      const jobs: RawJob[] = [];

      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval('.jobTitle', node => node.textContent?.trim() || '').catch(() => '');
          const company = await el.$eval('.companyName', node => node.textContent?.trim() || '').catch(() => '');
          const url = await el.$eval('.jobTitle a', node => (node as HTMLAnchorElement).href).catch(() => '');
          const location = await el.$eval('.location', node => node.textContent?.trim() || 'India').catch(() => 'India');
          
          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: 'Foundit',
              url,
              posted_at: new Date().toISOString(),
              skills: [],
              original_json: {
                scraped_at: new Date().toISOString(),
                source_site: 'Foundit'
              }
            });
          }
        } catch (jobError) {
          console.error('[Foundit] Error parsing card:', jobError);
        }
      }

      console.log(`[Foundit] Successfully scraped ${jobs.length} jobs.`);
      return jobs;

    } catch (error) {
      console.error(`[Foundit] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
