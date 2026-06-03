import { JobScraper, type RawJob } from './adapter';

export class AshbyAdapter extends JobScraper {
  private companies = [
    'linear',
    'drata',
    'lattice',
    'dbtlabs',
    'perplexity',
    'gemini',
    'vercel',
    'fivetran',
    'benchling',
    'gong',
    'apollo'
  ];

  async scrape(): Promise<RawJob[]> {
    console.log(`[Ashby] Starting scrape for ${this.companies.length} companies...`);
    const allJobs: RawJob[] = [];

    for (const company of this.companies) {
      try {
        console.log(`[Ashby] Fetching jobs for ${company}...`);
        const response = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company}`);
        
        if (!response.ok) {
          console.warn(`[Ashby] Failed to fetch for ${company}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        const jobs = data.jobs || [];

        for (const job of jobs) {
          const location = job.location || job.address?.postalAddress?.addressCountry || 'Remote';
          
          if (!this.isUSOrRemote(location)) {
            continue;
          }

          allJobs.push({
            title: job.title,
            company: company.charAt(0).toUpperCase() + company.slice(1),
            city: location,
            source: 'Ashby',
            url: job.jobUrl,
            posted_at: job.publishedAt || new Date().toISOString(),
            skills: [],
            original_json: {
              scraped_at: new Date().toISOString(),
              source_site: 'Ashby',
              job_id: job.id,
              internal_company: company,
              department: job.department,
              team: job.team
            }
          });
        }
      } catch (error) {
        console.error(`[Ashby] Error fetching ${company}:`, error);
      }
    }

    console.log(`[Ashby] Successfully scraped ${allJobs.length} jobs.`);
    return allJobs;
  }

  private isUSOrRemote(location: string): boolean {
    const loc = location.toLowerCase();
    if (loc.includes('remote') || loc.includes('anywhere') || loc.includes('north america')) return true;
    
    const usIndicators = ['usa', 'us', 'united states', 'ca', 'ny', 'tx', 'wa', 'ma', 'il', 'san francisco', 'new york', 'seattle', 'austin', 'boston'];
    return usIndicators.some(indicator => loc.includes(indicator));
  }
}
