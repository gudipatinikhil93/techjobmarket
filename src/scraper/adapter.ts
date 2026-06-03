export interface RawJob {
  title: string;
  company: string;
  city: string;
  description?: string;
  salary_text?: string;
  salary_min?: number;
  salary_max?: number;
  skills: string[];
  source: string;
  url: string;
  posted_at?: string;
  original_json?: any;
}

export abstract class JobScraper {
  abstract scrape(): Promise<RawJob[]>;
}

/**
 * Apify Provider Scraper
 * Interacts with Apify Actors to fetch job data.
 */
export class ApifyScraper extends JobScraper {
  private actorId: string;
  private apiToken: string;

  constructor(actorId: string, apiToken: string) {
    super();
    this.actorId = actorId;
    this.apiToken = apiToken;
  }

  async scrape(): Promise<RawJob[]> {
    if (!this.apiToken) {
      console.warn('APIFY_API_TOKEN is not set. Returning empty array.');
      return [];
    }

    try {
      console.log(`Triggering Apify Actor: ${this.actorId}`);
      // Note: In a real implementation, we would use the 'apify-client' or a simple fetch.
      // We'll use fetch to keep dependencies minimal for now.
      const response = await fetch(`https://api.apify.com/v2/acts/${this.actorId}/runs?token=${this.apiToken}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger Apify actor: ${response.statusText}`);
      }

      const run = await response.json();
      const runId = run.data.id;

      // Poll for completion (simplified for this plan)
      console.log(`Run started: ${runId}. Waiting for results...`);
      
      // For the sake of this implementation, we assume we fetch the latest dataset 
      // from a previously successful run or wait for this one.
      // Real implementation would poll /v2/actor-runs/{runId}
      
      return []; // Placeholder for actual result fetching logic
    } catch (error) {
      console.error('Apify scraping error:', error);
      return [];
    }
  }
}

/**
 * Wellfound (AngelList) Scraper Adapter
 */
export class WellfoundAdapter extends ApifyScraper {
  constructor(apiToken: string) {
    super('bebity~wellfound-jobs-scraper', apiToken);
  }
}

/**
 * LinkedIn Jobs Scraper Adapter
 */
export class LinkedInAdapter extends ApifyScraper {
  constructor(apiToken: string) {
    super('anchor~linkedin-jobs-scraper', apiToken);
  }
}

export class MockScraper extends JobScraper {
  async scrape(): Promise<RawJob[]> {
    console.log('Running mock scraper...');
    return [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp US',
        city: 'San Francisco',
        salary_min: 165000,
        salary_max: 230000,
        skills: ['React', 'Node.js', 'AWS'],
        source: 'LinkedIn',
        url: 'https://linkedin.com/jobs/1',
        posted_at: new Date().toISOString(),
      },
      {
        title: 'AI Researcher',
        company: 'Intelligence AI',
        city: 'Seattle',
        salary_min: 180000,
        salary_max: 280000,
        skills: ['Python', 'PyTorch', 'CUDA'],
        source: 'Indeed',
        url: 'https://indeed.com/jobs/2',
        posted_at: new Date().toISOString(),
      },
      {
        title: 'DevOps Architect',
        company: 'CloudFlow',
        city: 'Austin',
        salary_min: 155000,
        salary_max: 210000,
        skills: ['Kubernetes', 'Terraform', 'Go'],
        source: 'Direct',
        url: 'https://cloudflow.io/careers/3',
        posted_at: new Date().toISOString(),
      },
      {
        title: 'Staff Frontend Engineer',
        company: 'BrightUI',
        city: 'New York',
        salary_min: 170000,
        salary_max: 240000,
        skills: ['React', 'TypeScript', 'WebAssembly'],
        source: 'LinkedIn',
        url: 'https://linkedin.com/jobs/4',
        posted_at: new Date().toISOString(),
      }
    ];
  }
}
