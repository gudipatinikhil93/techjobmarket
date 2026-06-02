export interface RawJob {
  title: string;
  company: string;
  city: string;
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

export class MockScraper extends JobScraper {
  async scrape(): Promise<RawJob[]> {
    console.log('Running mock scraper...');
    return [
      {
        title: 'Senior SDE',
        company: 'TechCorp India',
        city: 'Bengaluru',
        salary_min: 2500000,
        salary_max: 4500000,
        skills: ['React', 'Node.js', 'AWS'],
        source: 'LinkedIn',
        url: 'https://linkedin.com/jobs/1',
        posted_at: new Date().toISOString(),
      },
      {
        title: 'Backend Developer',
        company: 'Fintech Solutions',
        city: 'Hyderabad',
        salary_min: 1800000,
        salary_max: 3000000,
        skills: ['Go', 'PostgreSQL', 'Docker'],
        source: 'Naukri',
        url: 'https://naukri.com/jobs/2',
        posted_at: new Date().toISOString(),
      },
      {
        title: 'AI Engineer',
        company: 'DataGenie',
        city: 'Pune',
        salary_min: 3500000,
        salary_max: 6000000,
        skills: ['Python', 'PyTorch', 'LLMs'],
        source: 'Direct',
        url: 'https://datagenie.ai/careers/3',
        posted_at: new Date().toISOString(),
      },
      {
        title: 'Frontend Engineer (React)',
        company: 'CloudNative',
        city: 'Gurugram',
        salary_min: 1500000,
        salary_max: 2500000,
        skills: ['React', 'TypeScript', 'Tailwind'],
        source: 'LinkedIn',
        url: 'https://linkedin.com/jobs/4',
        posted_at: new Date().toISOString(),
      }
    ];
  }
}
