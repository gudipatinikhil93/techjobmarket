import { JobScraper, type RawJob } from './adapter';

export class LeverAdapter extends JobScraper {
  private companies = [
    'netflix',
    'spotify',
    'palantir',
    'canva',
    'retool',
    'auth0',
    'affirm',
    'posthog',
    'atlassian',
    'shopify',
    'roblox',
    'doordash'
  ];

  async scrape(): Promise<RawJob[]> {
    console.log(`[Lever] Starting scrape for ${this.companies.length} companies...`);
    const allJobs: RawJob[] = [];

    for (const company of this.companies) {
      try {
        console.log(`[Lever] Fetching jobs for ${company}...`);
        const response = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
        
        if (!response.ok) {
          console.warn(`[Lever] Failed to fetch for ${company}: ${response.status}`);
          continue;
        }

        const jobs = await response.json();

        for (const job of jobs) {
          const location = job.categories?.location || job.country || 'Remote';
          
          if (!this.isUSOrRemote(location)) {
            continue;
          }

          allJobs.push({
            title: job.text,
            company: company.charAt(0).toUpperCase() + company.slice(1),
            city: location,
            source: 'Lever',
            url: job.hostedUrl,
            posted_at: new Date(job.createdAt).toISOString(),
            skills: [],
            original_json: {
              scraped_at: new Date().toISOString(),
              source_site: 'Lever',
              job_id: job.id,
              internal_company: company,
              categories: job.categories
            }
          });
        }
      } catch (error) {
        console.error(`[Lever] Error fetching ${company}:`, error);
      }
    }

    console.log(`[Lever] Successfully scraped ${allJobs.length} jobs.`);
    return allJobs;
  }

  private isUSOrRemote(location: string): boolean {
    const loc = location.toLowerCase();
    if (loc.includes('remote') || loc.includes('anywhere')) return true;
    
    const usIndicators = ['usa', 'us', 'united states', 'ca', 'ny', 'tx', 'wa', 'ma', 'il', 'san francisco', 'new york', 'seattle', 'austin', 'boston'];
    return usIndicators.some(indicator => loc.includes(indicator));
  }
}
