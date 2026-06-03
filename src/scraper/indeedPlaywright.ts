import { chromium } from 'playwright';
import type { RawJob } from './adapter';

export class IndeedPlaywrightScraper {
  private baseUrl = 'https://www.indeed.com/jobs?q=software+engineer+AI+ML+cloud+devops&l=United+States&sort=date';

  async scrape(limit = 10): Promise<RawJob[]> {
    console.log(`[Indeed] Starting scrape for US software & AI jobs...`);
    const browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    try {
      console.log(`[Indeed] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 60000 });

      // Handle potential popups/overlays
      try {
        await page.click('button.icl-CloseButton', { timeout: 5000 }).catch(() => {});
      } catch (e) {}

      const jobSelector = '.job_seen_beacon';
      await page.waitForSelector(jobSelector, { timeout: 30000 });

      const jobElements = await page.$$(jobSelector);
      console.log(`[Indeed] Found ${jobElements.length} job elements.`);

      const jobs: RawJob[] = [];

      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval('h3.jobTitle span', node => node.textContent?.trim() || '').catch(() => '');
          const company = await el.$eval('[data-testid="company-name"]', node => node.textContent?.trim() || '').catch(() => '');
          const url = await el.$eval('h3.jobTitle a', node => (node as HTMLAnchorElement).href).catch(() => '');
          const location = await el.$eval('[data-testid="text-location"]', node => node.textContent?.trim() || 'United States').catch(() => 'United States');
          const salaryText = await el.$eval('.salary-snippet-container, .estimated-salary', node => node.textContent?.trim() || '').catch(() => '');
          
          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: 'Indeed',
              url,
              salary_text: salaryText,
              posted_at: new Date().toISOString(),
              skills: [],
              original_json: {
                scraped_at: new Date().toISOString(),
                source_site: 'Indeed',
                salary_raw: salaryText
              }
            });
          }
        } catch (jobError) {
          console.error('[Indeed] Error parsing card:', jobError instanceof Error ? jobError.message : String(jobError));
        }
      }

      console.log(`[Indeed] Successfully scraped ${jobs.length} jobs.`);
      return jobs;

    } catch (error) {
      console.error(`[Indeed] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
