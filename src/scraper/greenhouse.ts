import { JobScraper, type RawJob } from './adapter';

export class GreenhouseAdapter extends JobScraper {
  private companies = [
    'stripe',
    'notion',
    'ramp',
    'figma',
    'openai',
    'anthropic',
    'discord',
    'vercel',
    'scaleai',
    'plaid',
    'dropbox',
    'airbnb',
    'twitch'
  ];

  async scrape(): Promise<RawJob[]> {
    console.log(`[Greenhouse] Starting scrape for ${this.companies.length} companies...`);
    const allJobs: RawJob[] = [];

    for (const company of this.companies) {
      try {
        console.log(`[Greenhouse] Fetching jobs for ${company}...`);
        const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`);
        
        if (!response.ok) {
          console.warn(`[Greenhouse] Failed to fetch for ${company}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        const jobs = data.jobs || [];

        for (const job of jobs) {
          // Filter for US / Remote jobs (or assume software/tech if it's from these tech companies)
          const location = job.location?.name || 'Remote';
          
          if (!this.isUSOrRemote(location)) {
            continue;
          }

          // Extract basic salary if available in metadata (Greenhouse doesn't always expose this cleanly, sometimes it's in the content)
          // We will attempt to parse salary from content later, or just store what we have.
          
          allJobs.push({
            title: job.title,
            company: data.name || company,
            city: location,
            source: 'Greenhouse',
            url: job.absolute_url,
            posted_at: job.updated_at || new Date().toISOString(),
            skills: [],
            original_json: {
              scraped_at: new Date().toISOString(),
              source_site: 'Greenhouse',
              job_id: job.id,
              internal_company: company
            }
          });
        }
      } catch (error) {
        console.error(`[Greenhouse] Error fetching ${company}:`, error);
      }
    }

    console.log(`[Greenhouse] Successfully scraped ${allJobs.length} jobs.`);
    return allJobs;
  }

  private isUSOrRemote(location: string): boolean {
    const loc = location.toLowerCase();
    if (loc.includes('remote') || loc.includes('anywhere')) return true;
    
    const usIndicators = ['usa', 'us', 'united states', 'ca', 'ny', 'tx', 'wa', 'ma', 'il', 'san francisco', 'new york', 'seattle', 'austin', 'boston'];
    return usIndicators.some(indicator => loc.includes(indicator));
  }
}
