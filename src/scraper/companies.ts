import { chromium } from 'playwright';
import type { RawJob, JobScraper } from './adapter';

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
          // generic extraction logic - might need specific adjustments per company
          const title = await el.textContent().then(t => t?.trim() || '');
          const url = await el.$eval('a', node => (node as HTMLAnchorElement).href).catch(() => this.careersUrl);
          
          if (title) {
            jobs.push({
              title,
              company: this.companyName,
              city: 'India',
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

export const getTCSScraper = () => new CompanyScraper('TCS', 'https://www.tcs.com/careers/india', '.card-container');
export const getInfosysScraper = () => new CompanyScraper('Infosys', 'https://career.infosys.com/joblist', '.job-list-item');
export const getAccentureScraper = () => new CompanyScraper('Accenture', 'https://www.accenture.com/in-en/careers/jobsearch', '.job-card');
