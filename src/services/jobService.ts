import { supabase } from '../lib/supabase';
import { normalizeTitle, cleanSalary } from './normalization';
import type { RawJob } from '../scraper/adapter';

export async function processAndStoreJobs(rawJobs: RawJob[]) {
  const processedJobs = rawJobs.map(job => ({
    title: job.title,
    normalized_title: normalizeTitle(job.title),
    company: job.company,
    city: job.city,
    salary_min: cleanSalary(job.salary_min),
    salary_max: cleanSalary(job.salary_max),
    skills: job.skills,
    source: job.source,
    url: job.url,
    posted_at: job.posted_at || new Date().toISOString(),
    original_json: job.original_json || {},
  }));

  const { data, error } = await supabase
    .from('jobs')
    .upsert(processedJobs, { onConflict: 'url' });

  if (error) {
    console.error('Error storing jobs:', error);
    throw error;
  }

  return data;
}

export async function getTrendingRoles() {
  const { data, error } = await supabase
    .from('trending_roles')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error fetching trending roles:', error);
    return [];
  }

  return data;
}

export async function getTopCities() {
  const { data, error } = await supabase
    .from('top_cities')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error fetching top cities:', error);
    return [];
  }

  return data;
}
