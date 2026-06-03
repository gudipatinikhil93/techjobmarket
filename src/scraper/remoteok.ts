import { JobScraper, type RawJob } from './adapter';

export class RemoteOKAdapter extends JobScraper {
  async scrape(): Promise<RawJob[]> {
    console.log(`[RemoteOK] Starting scrape for remote jobs...`);
    const allJobs: RawJob[] = [];

    try {
      // RemoteOK API allows fetching recent jobs
      const response = await fetch('https://remoteok.com/api');
      
      if (!response.ok) {
        console.warn(`[RemoteOK] Failed to fetch: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      // RemoteOK API first element is a "legal" object, skip it if it doesn't have an ID
      const jobs = Array.isArray(data) ? data.filter(j => j.id) : [];

      for (const job of jobs) {
        const location = job.location || 'Remote';
        
        // Filter for US or Worldwide jobs
        if (!this.isUSOrWorldwide(location)) {
          continue;
        }

        allJobs.push({
          title: job.position,
          company: job.company,
          city: location,
          source: 'RemoteOK',
          url: job.url,
          posted_at: job.date || new Date().toISOString(),
          salary_min: job.salary_min || undefined,
          salary_max: job.salary_max || undefined,
          skills: job.tags || [],
          original_json: {
            scraped_at: new Date().toISOString(),
            source_site: 'RemoteOK',
            job_id: job.id,
            slug: job.slug
          }
        });
      }
    } catch (error) {
      console.error(`[RemoteOK] Error fetching jobs:`, error);
    }

    console.log(`[RemoteOK] Successfully scraped ${allJobs.length} jobs.`);
    return allJobs;
  }

  private isUSOrWorldwide(location: string): boolean {
    const loc = location.toLowerCase();
    if (loc.includes('worldwide') || loc.includes('anywhere') || loc.includes('global')) return true;
    if (loc.includes('us') || loc.includes('united states') || loc.includes('north america')) return true;
    
    // RemoteOK often says "Remote" which we assume is valid
    if (loc === 'remote') return true;

    return false;
  }
}
