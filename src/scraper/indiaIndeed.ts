import { chromium } from 'playwright';
import type { RawJob } from './adapter';

export class IndiaIndeedScraper {
  // Targeting major India tech hubs: Bangalore, Hyderabad, Pune, Delhi NCR, Mumbai, Chennai
  private baseUrl = 'https://in.indeed.com/jobs?q=software+engineer+frontend+backend+fullstack+AI+ML&l=India&sort=date';

  async scrape(limit = 20): Promise<RawJob[]> {
    console.log(`[IndiaIndeed] Starting human-like scrape for India software jobs...`);
    const browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    try {
      console.log(`[IndiaIndeed] Navigating to homepage first...`);
      await page.goto('https://in.indeed.com/', { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 4000));

      console.log(`[IndiaIndeed] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 60000 });

      await new Promise(r => setTimeout(r, 3000));


      // Check for blocks
      const content = await page.content();
      if (content.includes('captcha') || content.includes('Cloudflare') || content.includes('Blocked')) {
        console.error('[IndiaIndeed] Blocked by anti-bot.');
        return [];
      }

      // Handle potential popups/overlays
      try {
        await page.click('button.icl-CloseButton', { timeout: 5000 }).catch(() => {});
      } catch (e) {}

      // Try to extract JSON-LD if available (sometimes present on indeed for featured jobs)
      const jobs: RawJob[] = [];
      const ldJsons = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        return scripts.map(s => {
          try {
            return JSON.parse(s.innerHTML);
          } catch (e) {
            return null;
          }
        }).filter(j => j && (j['@type'] === 'JobPosting' || j['@type'] === 'ItemList'));
      });

      if (ldJsons.length > 0) {
        console.log(`[IndiaIndeed] Found ${ldJsons.length} JSON-LD blocks.`);
        // Process ItemList if present
        for (const ld of ldJsons) {
          if (ld['@type'] === 'ItemList' && ld.itemListElement) {
            for (const item of ld.itemListElement) {
              const job = item.item;
              if (job && job['@type'] === 'JobPosting') {
                jobs.push({
                  title: job.title,
                  company: job.hiringOrganization?.name || 'Unknown',
                  city: job.jobLocation?.address?.addressLocality || 'India',
                  source: 'Indeed India',
                  url: job.url || '',
                  posted_at: job.datePosted || new Date().toISOString(),
                  skills: [],
                  original_json: job
                });
              }
            }
          } else if (ld['@type'] === 'JobPosting') {
            jobs.push({
              title: ld.title,
              company: ld.hiringOrganization?.name || 'Unknown',
              city: ld.jobLocation?.address?.addressLocality || 'India',
              source: 'Indeed India',
              url: ld.url || '',
              posted_at: ld.datePosted || new Date().toISOString(),
              skills: [],
              original_json: ld
            });
          }
        }
      }

      // Fallback to DOM if JSON-LD is insufficient
      if (jobs.length < limit) {
        console.log(`[IndiaIndeed] JSON-LD yielded ${jobs.length} jobs. Falling back to DOM for more...`);
        const jobSelector = '.job_seen_beacon';
        await page.waitForSelector(jobSelector, { timeout: 15000 }).catch(() => {});
        const jobElements = await page.$$(jobSelector);
        
        for (const el of jobElements.slice(0, Math.max(0, limit - jobs.length))) {
          try {
            const title = await el.$eval('h3.jobTitle span', node => node.textContent?.trim() || '').catch(() => '');
            const company = await el.$eval('[data-testid="company-name"]', node => node.textContent?.trim() || '').catch(() => '');
            const url = await el.$eval('h3.jobTitle a', node => (node as HTMLAnchorElement).href).catch(() => '');
            const location = await el.$eval('[data-testid="text-location"]', node => node.textContent?.trim() || 'India').catch(() => 'India');
            const salaryText = await el.$eval('.salary-snippet-container, .estimated-salary', node => node.textContent?.trim() || '').catch(() => '');
            const descriptionSnippet = await el.$eval('.css-146c3p1, .jobMetaDataGroup, .job-snippet', node => node.textContent?.trim() || '').catch(() => '');
            
            if (title && company && url && !jobs.some(j => j.url === url)) {
              jobs.push({
                title,
                company,
                city: location,
                description: descriptionSnippet,
                source: 'Indeed India',
                url,
                salary_text: salaryText,
                posted_at: new Date().toISOString(),
                skills: [],
                original_json: {
                  scraped_at: new Date().toISOString(),
                  source_site: 'Indeed India',
                  salary_raw: salaryText,
                  snippet: descriptionSnippet
                }
              });
            }
          } catch (jobError) {}
        }
      }

      console.log(`[IndiaIndeed] Successfully scraped ${jobs.length} jobs.`);
      return jobs;

    } catch (error) {
      console.error(`[IndiaIndeed] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
