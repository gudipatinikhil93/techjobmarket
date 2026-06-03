import { chromium } from 'playwright';
import { p as processAndStoreJobs, c as captureSnapshots } from './jobService_B0NW5vDw.mjs';

class JobScraper {
}
class ApifyScraper extends JobScraper {
  actorId;
  apiToken;
  constructor(actorId, apiToken) {
    super();
    this.actorId = actorId;
    this.apiToken = apiToken;
  }
  async scrape() {
    if (!this.apiToken) {
      console.warn("APIFY_API_TOKEN is not set. Returning empty array.");
      return [];
    }
    try {
      console.log(`Triggering Apify Actor: ${this.actorId}`);
      const response = await fetch(`https://api.apify.com/v2/acts/${this.actorId}/runs?token=${this.apiToken}`, {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error(`Failed to trigger Apify actor: ${response.statusText}`);
      }
      const run = await response.json();
      const runId = run.data.id;
      console.log(`Run started: ${runId}. Waiting for results...`);
      return [];
    } catch (error) {
      console.error("Apify scraping error:", error);
      return [];
    }
  }
}
class WellfoundAdapter extends ApifyScraper {
  constructor(apiToken) {
    super("bebity~wellfound-jobs-scraper", apiToken);
  }
}
class LinkedInAdapter extends ApifyScraper {
  constructor(apiToken) {
    super("anchor~linkedin-jobs-scraper", apiToken);
  }
}

class CompanyScraper extends JobScraper {
  constructor(companyName, careersUrl, selector) {
    super();
    this.companyName = companyName;
    this.careersUrl = careersUrl;
    this.selector = selector;
  }
  companyName;
  careersUrl;
  selector;
  async scrape(limit = 5) {
    console.log(`[${this.companyName}] Starting scrape for career page...`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    });
    const page = await context.newPage();
    try {
      console.log(`[${this.companyName}] Navigating to ${this.careersUrl}...`);
      await page.goto(this.careersUrl, { waitUntil: "networkidle", timeout: 6e4 });
      await page.waitForSelector(this.selector, { timeout: 3e4 });
      const jobElements = await page.$$(this.selector);
      console.log(`[${this.companyName}] Found ${jobElements.length} job elements.`);
      const jobs = [];
      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.textContent().then((t) => t?.trim() || "");
          const url = await el.$eval("a", (node) => node.href).catch(() => this.careersUrl);
          if (title) {
            jobs.push({
              title,
              company: this.companyName,
              city: "United States",
              source: "Direct",
              url,
              posted_at: (/* @__PURE__ */ new Date()).toISOString(),
              skills: [],
              original_json: {
                scraped_at: (/* @__PURE__ */ new Date()).toISOString(),
                source_site: this.companyName
              }
            });
          }
        } catch (jobError) {
        }
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
const getGoogleScraper = () => new CompanyScraper("Google", "https://careers.google.com/jobs/results/", ".gc-card");
const getMicrosoftScraper = () => new CompanyScraper("Microsoft", "https://jobs.careers.microsoft.com/global/en/search", ".job-item");
const getMetaScraper = () => new CompanyScraper("Meta", "https://www.metacareers.com/jobs", ".job-listing");

class IndeedPlaywrightScraper {
  baseUrl = "https://www.indeed.com/jobs?q=software+engineer+AI+ML+cloud+devops&l=United+States&sort=date";
  async scrape(limit = 10) {
    console.log(`[Indeed] Starting scrape for US software & AI jobs...`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    try {
      console.log(`[Indeed] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: "networkidle", timeout: 6e4 });
      try {
        await page.click("button.icl-CloseButton", { timeout: 5e3 }).catch(() => {
        });
      } catch (e) {
      }
      const jobSelector = ".job_seen_beacon";
      await page.waitForSelector(jobSelector, { timeout: 3e4 });
      const jobElements = await page.$$(jobSelector);
      console.log(`[Indeed] Found ${jobElements.length} job elements.`);
      const jobs = [];
      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval("h3.jobTitle span", (node) => node.textContent?.trim() || "").catch(() => "");
          const company = await el.$eval('[data-testid="company-name"]', (node) => node.textContent?.trim() || "").catch(() => "");
          const url = await el.$eval("h3.jobTitle a", (node) => node.href).catch(() => "");
          const location = await el.$eval('[data-testid="text-location"]', (node) => node.textContent?.trim() || "United States").catch(() => "United States");
          const salaryText = await el.$eval(".salary-snippet-container, .estimated-salary", (node) => node.textContent?.trim() || "").catch(() => "");
          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: "Indeed",
              url,
              salary_text: salaryText,
              posted_at: (/* @__PURE__ */ new Date()).toISOString(),
              skills: [],
              original_json: {
                scraped_at: (/* @__PURE__ */ new Date()).toISOString(),
                source_site: "Indeed",
                salary_raw: salaryText
              }
            });
          }
        } catch (jobError) {
          console.error("[Indeed] Error parsing card:", jobError.message);
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

const POST = async () => {
  const apiToken = "your_apify_api_token";
  try {
    const scrapers = [];
    if (apiToken) {
      scrapers.push(new LinkedInAdapter(apiToken).scrape());
      scrapers.push(new WellfoundAdapter(apiToken).scrape());
    }
    scrapers.push(new IndeedPlaywrightScraper().scrape(15));
    scrapers.push(getGoogleScraper().scrape(5));
    scrapers.push(getMicrosoftScraper().scrape(5));
    scrapers.push(getMetaScraper().scrape(5));
    const jobResults = await Promise.allSettled(scrapers);
    const allJobs = jobResults.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
    if (allJobs.length > 0) {
      await processAndStoreJobs(allJobs);
    }
    await captureSnapshots();
    return new Response(JSON.stringify({
      success: true,
      count: allJobs.length,
      message: "US Market scraping and intelligence update completed."
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Scrape API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
