import { webkit } from 'playwright';
import type { RawJob } from './adapter';

export class IndiaWellfoundScraper {
  private baseUrl = 'https://wellfound.com/location/india/software-engineer';

  async scrape(limit = 15): Promise<RawJob[]> {
    console.log(`[IndiaWellfound] Starting human-like scrape for India software jobs using Webkit...`);
    const browser = await webkit.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    try {
      console.log(`[IndiaWellfound] Navigating to homepage first...`);
      await page.goto('https://wellfound.com/', { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 5000 + Math.random() * 5000));

      console.log(`[IndiaWellfound] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 90000 });
      
      await new Promise(r => setTimeout(r, 3000));

      // Check for blocks
      const content = await page.content();
      if (content.includes('captcha') || content.includes('DataDome') || content.includes('Cloudflare')) {
        console.error('[IndiaWellfound] Blocked by anti-bot.');
        return [];
      }

      // Try to extract structured data from __NEXT_DATA__
      const nextData = await page.evaluate(() => {
        const script = document.getElementById('__NEXT_DATA__');
        return script ? JSON.parse(script.innerText) : null;
      });

      const jobs: RawJob[] = [];

      if (nextData && nextData.props?.pageProps?.apolloState) {
        console.log('[IndiaWellfound] Found __NEXT_DATA__ Apollo state. Extracting jobs...');
        const state = nextData.props.pageProps.apolloState;
        
        // Find keys that look like "Job:..."
        const jobKeys = Object.keys(state).filter(k => k.startsWith('Job:'));
        
        for (const key of jobKeys.slice(0, limit)) {
          const jobData = state[key];
          const companyKey = jobData.startup?.__ref;
          const companyData = companyKey ? state[companyKey] : null;

          if (jobData.title && companyData?.name) {
            jobs.push({
              title: jobData.title,
              company: companyData.name,
              city: jobData.locationNames?.join(', ') || 'India',
              source: 'Wellfound India',
              url: `https://wellfound.com/jobs/${jobData.id}-${jobData.slug}`,
              posted_at: new Date().toISOString(),
              skills: [],
              original_json: {
                scraped_at: new Date().toISOString(),
                source_site: 'Wellfound India',
                job_id: jobData.id
              }
            });
          }
        }
      }

      // Fallback to DOM scraping if __NEXT_DATA__ is missing or empty
      if (jobs.length === 0) {
        console.log('[IndiaWellfound] Structured data extraction failed or empty. Falling back to DOM selectors...');
        const jobSelector = '[data-test="JobResult"], [class*="JobCard"]';
        await page.waitForSelector(jobSelector, { timeout: 15000 }).catch(() => {});
        const jobElements = await page.$$(jobSelector);
        
        for (const el of jobElements.slice(0, limit)) {
          try {
            const title = await el.$eval('h3, h4, [class*="title"]', node => node.textContent?.trim() || '').catch(() => '');
            const company = await el.$eval('[class*="company"], [class*="name"]', node => node.textContent?.trim() || '').catch(() => '');
            const url = await el.$eval('a[href*="/jobs/"]', node => (node as HTMLAnchorElement).href).catch(() => '');
            const location = await el.$eval('[class*="location"]', node => node.textContent?.trim() || 'India').catch(() => 'India');
            
            if (title && company && url) {
              jobs.push({
                title,
                company,
                city: location,
                source: 'Wellfound India',
                url,
                posted_at: new Date().toISOString(),
                skills: [],
                original_json: {
                  scraped_at: new Date().toISOString(),
                  source_site: 'Wellfound India'
                }
              });
            }
          } catch (jobError) {}
        }
      }

      console.log(`[IndiaWellfound] Successfully scraped ${jobs.length} jobs.`);
      return jobs;

    } catch (error) {
      console.error(`[IndiaWellfound] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
