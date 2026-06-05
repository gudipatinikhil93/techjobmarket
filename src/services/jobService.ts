import { supabase } from '../lib/supabase';
import { normalizeTitle, cleanSalary, normalizeCity, extractSkills } from './normalization';
import type { RawJob } from '../scraper/adapter';

export async function processAndStoreJobs(rawJobs: RawJob[]) {
  if (!rawJobs.length) return [];

  // 1. Pre-process and Deduplicate in memory
  const uniqueJobsMap = new Map<string, any>();

  for (const job of rawJobs) {
    const normalizedTitle = normalizeTitle(job.title);
    const company = job.company;
    const city = normalizeCity(job.city);
    
    // Extract skills from title AND description AND any provided skills/tags
    const textToAnalyze = `${job.title} ${job.description || job.original_json?.snippet || ""} ${(job.skills || []).join(" ")}`;
    const finalSkills = extractSkills(textToAnalyze);

    // Deduplicate by URL primarily, but also fallback to a composite key of Title + Company
    const compositeKey = `${normalizedTitle}-${company}`.toLowerCase();
    
    // If URL already exists in this batch, or composite key already exists, skip it to prevent duplicates
    if (!uniqueJobsMap.has(job.url) && !uniqueJobsMap.has(compositeKey)) {
      uniqueJobsMap.set(job.url, {
        title: job.title,
        normalized_title: normalizedTitle,
        company: company,
        city: city,
        salary_min: cleanSalary(job.salary_min),
        salary_max: cleanSalary(job.salary_max),
        skills: finalSkills,
        source: job.source,
        url: job.url,
        posted_at: job.posted_at || new Date().toISOString(),
        original_json: job.original_json || {},
      });
      uniqueJobsMap.set(compositeKey, true); // mark composite key as seen
    }
  }

  const processedJobs = Array.from(uniqueJobsMap.values()).filter(j => typeof j === 'object');
  console.log(`[JobService] Deduped from ${rawJobs.length} raw jobs down to ${processedJobs.length} unique jobs.`);

  // Chunking for large datasets
  const chunkSize = 100;
  const results = [];

  for (let i = 0; i < processedJobs.length; i += chunkSize) {
    const chunk = processedJobs.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('jobs')
      .upsert(chunk, { 
        onConflict: 'url',
        ignoreDuplicates: false // Set to false to update existing jobs with new skills extraction
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
    .order('growth_percentage', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching trending roles:', error);
    return [];
  }

  return data;
}

export async function getDecliningRoles() {
  const { data, error } = await supabase
    .from('trending_roles')
    .select('*')
    .order('growth_percentage', { ascending: true })
    .limit(8);

  if (error) {
    console.error('Error fetching declining roles:', error);
    return [];
  }

  return data;
}

export async function getRemoteTrend() {
  const { count: totalCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true });

  const { count: remoteCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('city', 'Remote');

  if (!totalCount) return { percentage: 0, total: 0, remote: 0 };
  
  return {
    total: totalCount,
    remote: remoteCount || 0,
    percentage: Number(((remoteCount || 0) / totalCount * 100).toFixed(1))
  };
}

export async function getAIHiringMomentum() {
  const { data, error } = await supabase
    .from('jobs')
    .select('normalized_title, skills');

  if (error || !data) return { percentage: 0 };

  const aiJobs = data.filter(job => 
    job.normalized_title?.toLowerCase().includes('ai') || 
    job.normalized_title?.toLowerCase().includes('machine learning') ||
    job.skills?.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('llm') || s.toLowerCase().includes('gpt'))
  );

  return {
    percentage: Number((aiJobs.length / data.length * 100).toFixed(1)),
    count: aiJobs.length
  };
}

export async function getJuniorHiringDifficulty() {
  const { data, error } = await supabase
    .from('jobs')
    .select('title');

  if (error || !data) return { percentage: 0 };

  const juniorJobs = data.filter(job => 
    job.title.toLowerCase().includes('junior') || 
    job.title.toLowerCase().includes('entry') ||
    job.title.toLowerCase().includes('intern') ||
    job.title.toLowerCase().includes('associate')
  );

  // In this context, "difficulty" is inverse of volume. Lower volume = Higher difficulty.
  return {
    percentage: Number((juniorJobs.length / data.length * 100).toFixed(1)),
    count: juniorJobs.length
  };
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
    .gt('posted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Look at last 30 days for better pulse

  // Calculate real average salary from live jobs instead of static benchmarks
  const { data: salaryData } = await supabase
    .from('jobs')
    .select('salary_min, salary_max')
    .not('salary_min', 'is', null)
    .not('salary_max', 'is', null);

  let avgSalary = 160000; // Fallback
  if (salaryData && salaryData.length > 0) {
    const sum = salaryData.reduce((acc, curr) => acc + (Number(curr.salary_min) + Number(curr.salary_max)) / 2, 0);
    avgSalary = sum / salaryData.length;
  }

  // Hiring Index: Based on US market volume (scale adjusted for higher volume)
  // Assuming a baseline of ~500 jobs means healthy, 1000+ means booming
  const hiringIndex = totalCount ? Math.min(10, (totalCount / 100) + 5.0) : 8.2;

  return {
    totalJobs: totalCount || 0,
    recentJobs: recentCount || 0,
    avgSalary: Math.round(avgSalary),
    hiringIndex: Number(hiringIndex.toFixed(1))
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
  const monthlyData: Record<string, { total: number, count: number }> = {};
  data.forEach(snapshot => {
    const date = new Date(snapshot.captured_at);
    const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!monthlyData[month]) {
      monthlyData[month] = { total: 0, count: 0 };
    }
    monthlyData[month].total += snapshot.job_count;
    monthlyData[month].count += 1;
  });

  return Object.entries(monthlyData).map(([month, stats]) => ({
    month,
    value: Math.round(stats.total / stats.count) // Average job count per capture in that month
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
  // Try to compute real benchmarks from ingested jobs
  const { data: realJobs, error } = await supabase
    .from('jobs')
    .select('normalized_title, salary_min, salary_max')
    .not('salary_min', 'is', null)
    .not('salary_max', 'is', null);

  if (!error && realJobs && realJobs.length > 0) {
    const roleStats: Record<string, { minSum: number, maxSum: number, count: number }> = {};
    for (const job of realJobs) {
      if (!job.normalized_title) continue;
      if (!roleStats[job.normalized_title]) {
        roleStats[job.normalized_title] = { minSum: 0, maxSum: 0, count: 0 };
      }
      roleStats[job.normalized_title].minSum += Number(job.salary_min);
      roleStats[job.normalized_title].maxSum += Number(job.salary_max);
      roleStats[job.normalized_title].count += 1;
    }

    const calculatedBenchmarks = Object.entries(roleStats)
      .filter(([_, stats]) => stats.count >= 2) // At least 2 data points for confidence
      .map(([role, stats]) => ({
        role,
        avg_min: Math.round(stats.minSum / stats.count),
        avg_max: Math.round(stats.maxSum / stats.count)
      }))
      .sort((a, b) => b.avg_max - a.avg_max)
      .slice(0, 10);
      
    if (calculatedBenchmarks.length > 0) {
      return calculatedBenchmarks;
    }
  }

  // Fallback to the static table if not enough real data
  const { data: staticData, error: staticError } = await supabase
    .from('salary_benchmarks')
    .select('*')
    .limit(10);

  if (staticError) {
    console.error('Error fetching salary benchmarks:', staticError);
    return [];
  }
  return staticData;
}

