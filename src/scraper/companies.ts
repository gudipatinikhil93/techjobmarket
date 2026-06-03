import { chromium } from 'playwright';
import { JobScraper, type RawJob } from './adapter';

export class CompanyScraper extends JobScraper {
  constructor(private companyName: string, private careersUrl: string, private selector: string) {
    super();
  }

  async scrape(limit = 5): Promise<RawJob[]> {
    console.log(`[${this.companyName}] Starting scrape for career page...`);
    const browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    try {
      console.log(`[${this.companyName}] Navigating to ${this.careersUrl}...`);
      await page.goto(this.careersUrl, { waitUntil: 'networkidle', timeout: 60000 });

      await page.waitForSelector(this.selector, { timeout: 30000 });

      const jobElements = await page.$$(this.selector);
      console.log(`[${this.companyName}] Found ${jobElements.length} job elements.`);

      const jobs: RawJob[] = [];

      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.textContent().then(t => t?.trim() || '');
          const url = await el.$eval('a', node => (node as HTMLAnchorElement).href).catch(() => this.careersUrl);
          
          if (title) {
            jobs.push({
              title,
              company: this.companyName,
              city: 'United States',
              source: 'Direct',
              url,
              posted_at: new Date().toISOString(),
              skills: [],
              original_json: {
                scraped_at: new Date().toISOString(),
                source_site: this.companyName
              }
            });
          }
        } catch (jobError) {}
      }

      return jobs;
    } catch (error) {
      console.error(`[${this.companyName}] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}

export const getGoogleScraper = () => new CompanyScraper('Google', 'https://careers.google.com/jobs/results/', '.gc-card');
export const getMicrosoftScraper = () => new CompanyScraper('Microsoft', 'https://jobs.careers.microsoft.com/global/en/search', '.job-item');
export const getMetaScraper = () => new CompanyScraper('Meta', 'https://www.metacareers.com/jobs', '.job-listing');
