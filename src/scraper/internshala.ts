import { chromium } from 'playwright';
import type { RawJob, JobScraper } from './adapter';

export class InternshalaScraper extends JobScraper {
  private baseUrl = 'https://internshala.com/jobs/software-development-jobs/';

  async scrape(limit = 10): Promise<RawJob[]> {
    console.log(`[Internshala] Starting scrape for software jobs...`);
    const browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    try {
      console.log(`[Internshala] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 60000 });

      // Wait for job cards
      const jobSelector = '.container-fluid.individual_internship.visibility_container';
      await page.waitForSelector(jobSelector, { timeout: 30000 });

      const jobElements = await page.$$(jobSelector);
      console.log(`[Internshala] Found ${jobElements.length} job elements.`);

      const jobs: RawJob[] = [];

      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval('.job-internship-name', node => node.textContent?.trim() || '').catch(() => '');
          const company = await el.$eval('.company-name', node => node.textContent?.trim() || '').catch(() => '');
          const url = await el.$eval('.view_detail_button_desktop', node => (node as HTMLAnchorElement).href).catch(() => '');
          const location = await el.$eval('.location_link', node => node.textContent?.trim() || 'India').catch(() => 'India');
          
          // Salary/Stipend extraction
          const stipend = await el.$eval('.stipend_container_desktop', node => node.textContent?.trim() || '').catch(() => '');
          
          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: 'Internshala',
              url,
              posted_at: new Date().toISOString(),
              skills: [],
              original_json: {
                scraped_at: new Date().toISOString(),
                source_site: 'Internshala',
                stipend
              }
            });
          }
        } catch (jobError) {
          console.error('[Internshala] Error parsing card:', jobError);
        }
      }

      console.log(`[Internshala] Successfully scraped ${jobs.length} jobs.`);
      return jobs;

    } catch (error) {
      console.error(`[Internshala] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
