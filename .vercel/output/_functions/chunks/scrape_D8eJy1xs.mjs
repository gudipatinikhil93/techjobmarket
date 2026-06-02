import { chromium } from 'playwright';
import { p as processAndStoreJobs, c as captureSnapshots } from './jobService_BYpfT7r6.mjs';

let JobScraper$1 = class JobScraper {
};
class ApifyScraper extends JobScraper$1 {
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

class InternshalaScraper extends JobScraper {
  baseUrl = "https://internshala.com/jobs/software-development-jobs/";
  async scrape(limit = 10) {
    console.log(`[Internshala] Starting scrape for software jobs...`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    try {
      console.log(`[Internshala] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: "networkidle", timeout: 6e4 });
      const jobSelector = ".container-fluid.individual_internship.visibility_container";
      await page.waitForSelector(jobSelector, { timeout: 3e4 });
      const jobElements = await page.$$(jobSelector);
      console.log(`[Internshala] Found ${jobElements.length} job elements.`);
      const jobs = [];
      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval(".job-internship-name", (node) => node.textContent?.trim() || "").catch(() => "");
          const company = await el.$eval(".company-name", (node) => node.textContent?.trim() || "").catch(() => "");
          const url = await el.$eval(".view_detail_button_desktop", (node) => node.href).catch(() => "");
          const location = await el.$eval(".location_link", (node) => node.textContent?.trim() || "India").catch(() => "India");
          const stipend = await el.$eval(".stipend_container_desktop", (node) => node.textContent?.trim() || "").catch(() => "");
          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: "Internshala",
              url,
              posted_at: (/* @__PURE__ */ new Date()).toISOString(),
              skills: [],
              original_json: {
                scraped_at: (/* @__PURE__ */ new Date()).toISOString(),
                source_site: "Internshala",
                stipend
              }
            });
          }
        } catch (jobError) {
          console.error("[Internshala] Error parsing card:", jobError);
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

class FounditScraper extends JobScraper {
  baseUrl = "https://www.foundit.in/srp/results?query=software+engineer&locations=India";
  async scrape(limit = 10) {
    console.log(`[Foundit] Starting scrape for software jobs...`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    try {
      console.log(`[Foundit] Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: "networkidle", timeout: 6e4 });
      const jobSelector = ".srpCardWrapper";
      await page.waitForSelector(jobSelector, { timeout: 3e4 });
      const jobElements = await page.$$(jobSelector);
      console.log(`[Foundit] Found ${jobElements.length} job elements.`);
      const jobs = [];
      for (const el of jobElements.slice(0, limit)) {
        try {
          const title = await el.$eval(".jobTitle", (node) => node.textContent?.trim() || "").catch(() => "");
          const company = await el.$eval(".companyName", (node) => node.textContent?.trim() || "").catch(() => "");
          const url = await el.$eval(".jobTitle a", (node) => node.href).catch(() => "");
          const location = await el.$eval(".location", (node) => node.textContent?.trim() || "India").catch(() => "India");
          if (title && company && url) {
            jobs.push({
              title,
              company,
              city: location,
              source: "Foundit",
              url,
              posted_at: (/* @__PURE__ */ new Date()).toISOString(),
              skills: [],
              original_json: {
                scraped_at: (/* @__PURE__ */ new Date()).toISOString(),
                source_site: "Foundit"
              }
            });
          }
        } catch (jobError) {
          console.error("[Foundit] Error parsing card:", jobError);
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
              city: "India",
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
const getTCSScraper = () => new CompanyScraper("TCS", "https://www.tcs.com/careers/india", ".card-container");
const getInfosysScraper = () => new CompanyScraper("Infosys", "https://career.infosys.com/joblist", ".job-list-item");

const POST = async () => {
  const apiToken = "your_apify_api_token";
  try {
    const scrapers = [];
    if (apiToken) {
      scrapers.push(new LinkedInAdapter(apiToken).scrape());
      scrapers.push(new WellfoundAdapter(apiToken).scrape());
    }
    scrapers.push(new InternshalaScraper().scrape(5));
    scrapers.push(new FounditScraper().scrape(5));
    scrapers.push(getTCSScraper().scrape(3));
    scrapers.push(getInfosysScraper().scrape(3));
    const jobResults = await Promise.allSettled(scrapers);
    const allJobs = jobResults.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
    if (allJobs.length > 0) {
      await processAndStoreJobs(allJobs);
    }
    await captureSnapshots();
    return new Response(JSON.stringify({
      success: true,
      count: allJobs.length,
      message: "Scraping and storage completed successfully."
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
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
