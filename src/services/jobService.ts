import { supabase } from '../lib/supabase';
import { normalizeTitle, cleanSalary, normalizeCity } from './normalization';
import type { RawJob } from '../scraper/adapter';

export async function processAndStoreJobs(rawJobs: RawJob[]) {
  if (!rawJobs.length) return [];

  const processedJobs = rawJobs.map(job => ({
    title: job.title,
    normalized_title: normalizeTitle(job.title),
    company: job.company,
    city: normalizeCity(job.city),
    salary_min: cleanSalary(job.salary_min),
    salary_max: cleanSalary(job.salary_max),
    skills: job.skills || [],
    source: job.source,
    url: job.url,
    posted_at: job.posted_at || new Date().toISOString(),
    original_json: job.original_json || {},
  }));

  // Chunking for large datasets
  const chunkSize = 100;
  const results = [];

  for (let i = 0; i < processedJobs.length; i += chunkSize) {
    const chunk = processedJobs.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('jobs')
      .upsert(chunk, { 
        onConflict: 'url',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error(`Error storing chunk starting at ${i}:`, error);
      continue;
    }
    if (data) results.push(...data);
  }

  return results;
}

/**
 * Captures historical snapshots for roles and cities.
 * Should be run weekly after scraping.
 */
export async function captureSnapshots() {
  console.log('Capturing historical snapshots...');
  
  // Role Snapshots
  const { data: roleData, error: roleError } = await supabase.rpc('capture_role_snapshots');
  if (roleError) console.error('Error capturing role snapshots:', roleError);

  // City Snapshots
  const { data: cityData, error: cityError } = await supabase.rpc('capture_city_snapshots');
  if (cityError) console.error('Error capturing city snapshots:', cityError);

  return { success: !roleError && !cityError };
}

export async function getTrendingRoles() {
  const { data, error } = await supabase
    .from('trending_roles')
    .select('*')
    .limit(8);

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

export async function getMarketPulse() {
  const { count: totalCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true });

  const { count: recentCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .gt('posted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const { data: salaryData } = await supabase
    .from('salary_benchmarks')
    .select('avg_min, avg_max');

  let avgSalary = 0;
  if (salaryData && salaryData.length > 0) {
    const sum = salaryData.reduce((acc, curr) => acc + (curr.avg_min + curr.avg_max) / 2, 0);
    avgSalary = sum / salaryData.length;
  }

  return {
    totalJobs: totalCount || 0,
    recentJobs: recentCount || 0,
    avgSalary: avgSalary || 0,
    hiringIndex: totalCount ? Math.min(10, (totalCount / 100) + 5) : 8.4
  };
}

export async function getAllCities() {
  const { data, error } = await supabase
    .from('top_cities')
    .select('*')
    .order('job_count', { ascending: false });

  if (error) {
    console.error('Error fetching all cities:', error);
    return [];
  }
  return data;
}

export async function getAllRoles() {
  const { data, error } = await supabase
    .from('trending_roles')
    .select('*')
    .order('job_count', { ascending: false });

  if (error) {
    console.error('Error fetching all roles:', error);
    return [];
  }
  return data;
}

export async function getTopSkills() {
  const { data, error } = await supabase
    .from('top_skills')
    .select('*')
    .limit(10);

  if (error) {
    console.error('Error fetching top skills:', error);
    return [];
  }
  return data;
}

export async function getHiringTrends() {
  const { data, error } = await supabase
    .from('role_snapshots')
    .select('captured_at, job_count')
    .order('captured_at', { ascending: true });

  if (error) {
    console.error('Error fetching hiring trends:', error);
    return [];
  }

  // Group by month
  const monthlyData: Record<string, number> = {};
  data.forEach(snapshot => {
    const date = new Date(snapshot.captured_at);
    const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyData[month] = (monthlyData[month] || 0) + snapshot.job_count;
  });

  return Object.entries(monthlyData).map(([month, value]) => ({
    month,
    value
  }));
}

export async function getSkillGrowth() {
  const { data, error } = await supabase.rpc('get_skill_growth');
  if (error) {
    console.error('Error fetching skill growth:', error);
    return [];
  }
  return data;
}

export async function getSalaryBenchmarks() {
  const { data, error } = await supabase
    .from('salary_benchmarks')
    .select('*')
    .limit(10);

  if (error) {
    console.error('Error fetching salary benchmarks:', error);
    return [];
  }
  return data;
}

