import { chromium } from 'playwright';
import type { RawJob } from './adapter';

export class WellfoundPlaywrightScraper {
  private baseUrl = 'https://wellfound.com/location/india/software-engineer';

  async scrape(limit = 10): Promise<RawJob[]> {
    console.log(`[Wellfound] Starting manual stealth scrape for India software jobs...`);
    const browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();

    // Manual Stealth: Override some navigator properties
    await page.addInitScript(() => {
      // @ts-ignore
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      // @ts-ignore
      window.chrome = { runtime: {} };
      // @ts-ignore
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      // @ts-ignore
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    });

    try {
      console.log(`[Wellfound] Navigating to ${this.baseUrl}...`);
      // Use random delays
      await page.goto('https://wellfound.com/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000 + Math.random() * 3000);
      
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 90000 });

      const content = await page.content();
      if (content.includes('captcha') || content.includes('DataDome')) {
        console.error('[Wellfound] Still blocked by CAPTCHA.');
        // If blocked, we'll try one more "human" move - clicking something if possible, 
        // but likely we need a better URL or proxy.
        return [];
      }

      console.log(`[Wellfound] Waiting for job results...`);
      const jobSelector = '[data-test="JobResult"], [class*="JobCard"], [class*="styles_jobCard"]';
      
      try {
        await page.waitForSelector(jobSelector, { timeout: 30000 });
      } catch (e) {
        console.log('[Wellfound] Timeout. HTML sample:', content.substring(0, 500));
        throw new Error('No job elements found');
      }

      const jobElements = await page.$$(jobSelector);
      console.log(`[Wellfound] Found ${jobElements.length} job elements.`);

      const jobs: RawJob[] = [];

      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval('h3, h4, [class*="title"]', node => node.textContent?.trim() || '').catch(() => '');
          const company = await el.$eval('[class*="company"], [class*="name"], [class*="styles_name"]', node => node.textContent?.trim() || '').catch(() => '');
          const url = await el.$eval('a[href*="/jobs/"], a[class*="title"]', node => (node as HTMLAnchorElement).href).catch(() => '');
          const location = await el.$eval('[class*="location"]', node => node.textContent?.trim() || 'India').catch(() => 'India');
          
          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: 'Wellfound',
              url,
              posted_at: new Date().toISOString(),
              skills: [],
              original_json: {
                scraped_at: new Date().toISOString(),
                source_site: 'Wellfound'
              }
            });
          }
        } catch (jobError) {}
      }

      return jobs;

    } catch (error) {
      console.error(`[Wellfound] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
