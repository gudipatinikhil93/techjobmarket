import { webkit } from 'playwright';
import type { RawJob } from './adapter';

export class IndiaInstahyreScraper {
  // Targeting high-signal tech roles in India
  private baseUrl = 'https://www.instahyre.com/search-jobs?locations=India&roles=Software+Engineer%2C+Frontend+Developer%2C+Backend+Developer%2C+Full+Stack+Developer%2C+Data+Scientist%2C+Machine+Learning+Engineer';

  async scrape(limit = 20): Promise<RawJob[]> {
    console.log(`[IndiaInstahyre] Starting human-like scrape for India tech jobs using Webkit...`);
    const browser = await webkit.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    try {
      console.log(`[IndiaInstahyre] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 90000 });
      
      await new Promise(r => setTimeout(r, 5000));

      // Check for blocks
      const content = await page.content();
      if (content.includes('captcha') || content.includes('DataDome') || content.includes('Cloudflare')) {
        console.error('[IndiaInstahyre] Blocked by anti-bot.');
        return [];
      }

      const jobSelector = '.job-listing-container, [id^="job-"]';
      await page.waitForSelector(jobSelector, { timeout: 30000 }).catch(() => {
        console.warn('[IndiaInstahyre] Job selector not found. Might be empty or blocked.');
      });

      const jobElements = await page.$$(jobSelector);
      console.log(`[IndiaInstahyre] Found ${jobElements.length} job elements.`);

      const jobs: RawJob[] = [];

      // Instahyre often requires clicking to see details or has JSON-LD in the page source for each job card
      // However, most reliable is clicking the job link and reading JSON-LD from the detail page
      // To keep it simple and efficient, we'll try to extract what we can from the list page first.
      
      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval('.designation', node => node.textContent?.trim() || '').catch(() => '');
          const company = await el.$eval('.company-name', node => node.textContent?.trim() || '').catch(() => '');
          const url = await el.$eval('a[id^="view-job"]', node => (node as HTMLAnchorElement).href).catch(() => '');
          const location = await el.$eval('.locations', node => node.textContent?.trim() || 'India').catch(() => 'India');
          const experience = await el.$eval('.experience', node => node.textContent?.trim() || '').catch(() => '');
          const skills = await el.$$eval('.skill', nodes => nodes.map(n => n.textContent?.trim() || ''));

          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: 'Instahyre',
              url,
              posted_at: new Date().toISOString(),
              skills: skills,
              original_json: {
                scraped_at: new Date().toISOString(),
                source_site: 'Instahyre',
                experience_raw: experience
              }
            });
          }
        } catch (jobError) {
          // Skip individual failed cards
        }
      }

      console.log(`[IndiaInstahyre] Successfully scraped ${jobs.length} jobs.`);
      return jobs;

    } catch (error) {
      console.error(`[IndiaInstahyre] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
