import { JobScraper, type RawJob } from './adapter';

export class IndiaRemoteOKScraper extends JobScraper {
  async scrape(limit = 20): Promise<RawJob[]> {
    console.log(`[IndiaRemoteOK] Starting scrape for India remote jobs...`);
    const allJobs: RawJob[] = [];

    try {
      const response = await fetch('https://remoteok.com/api');
      if (!response.ok) {
        console.warn(`[IndiaRemoteOK] Failed to fetch: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const jobs = Array.isArray(data) ? data.filter(j => j.id) : [];

      for (const job of jobs) {
        if (allJobs.length >= limit) break;

        const location = job.location || '';
        const company = job.company || '';
        const description = job.description || '';
        
        const isIndia = location.toLowerCase().includes('india') || 
                        company.toLowerCase().includes('india') || 
                        description.toLowerCase().includes('india');

        if (isIndia) {
          allJobs.push({
            title: job.position,
            company: job.company,
            city: location.includes(',') ? location.split(',')[0].trim() : 'Remote (India)',
            source: 'RemoteOK India',
            url: job.url,
            posted_at: job.date || new Date().toISOString(),
            salary_min: job.salary_min || undefined,
            salary_max: job.salary_max || undefined,
            skills: job.tags || [],
            original_json: {
              scraped_at: new Date().toISOString(),
              source_site: 'RemoteOK',
              job_id: job.id
            }
          });
        }
      }
    } catch (error) {
      console.error(`[IndiaRemoteOK] Error fetching jobs:`, error);
    }

    console.log(`[IndiaRemoteOK] Successfully scraped ${allJobs.length} jobs.`);
    return allJobs;
  }
}
