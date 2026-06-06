import { supabase } from '../lib/supabase';
import { normalizeTitle, cleanSalary, normalizeCity, extractSkills, categorizeCompany } from './normalization';
import type { RawJob } from '../scraper/adapter';

export async function processAndStoreJobs(rawJobs: RawJob[], region: string = 'us') {
  if (!rawJobs.length) return [];

  // 1. Pre-process and Deduplicate in memory
  const uniqueJobsMap = new Map<string, any>();

  for (const job of rawJobs) {
    const normalizedTitle = normalizeTitle(job.title);
    const company = job.company;
    const city = normalizeCity(job.city, region);
    const companyCategory = categorizeCompany(company, region);

    // Skip if it's a cross-region leak (e.g., SF job in India pipeline)
    if (city === 'CROSS_REGION_LEAK') {
      console.warn(`[JobService] Skipping job from ${job.city} for region ${region} (leaked from other region)`);
      continue;
    }
    
    // Extract skills from title AND description AND any provided skills/tags
    const textToAnalyze = `${job.title} ${job.description || job.original_json?.snippet || ""} ${(job.skills || []).join(" ")}`;
    const finalSkills = extractSkills(textToAnalyze);

    // Deduplicate by URL primarily, but also fallback to a composite key of Title + Company
    const compositeKey = `${normalizedTitle}-${company}-${region}`.toLowerCase();
    
    // If URL already exists in this batch, or composite key already exists, skip it to prevent duplicates
    if (!uniqueJobsMap.has(job.url) && !uniqueJobsMap.has(compositeKey)) {
      uniqueJobsMap.set(job.url, {
        title: job.title,
        normalized_title: normalizedTitle,
        company: company,
        company_category: companyCategory,
        city: city,
        region: region,
        salary_min: cleanSalary(job.salary_min, region),
        salary_max: cleanSalary(job.salary_max, region),
        currency: region === 'india' ? 'INR' : 'USD',
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
  console.log(`[JobService] Deduped from ${rawJobs.length} raw jobs down to ${processedJobs.length} unique jobs in region ${region}.`);

  // Chunking for large datasets
  const chunkSize = 100;
  const results = [];

  for (let i = 0; i < processedJobs.length; i += chunkSize) {
    const chunk = processedJobs.slice(i, i + chunkSize);
    
    // Strict insert with all columns
    const { data, error } = await supabase
      .from('jobs')
      .upsert(chunk, { 
        onConflict: 'url',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error(`Error storing chunk starting at ${i} for region ${region}:`, error);
      continue;
    }
    if (data) results.push(...data);
  }

  return results;
}

/**
 * Captures historical snapshots for roles, cities, skills, companies, and overall market.
 * Should be run weekly after scraping.
 */
export async function captureSnapshots(region: string = 'us') {
  console.log(`[JobService] Capturing historical snapshots for region ${region}...`);
  
  const results = await Promise.allSettled([
    supabase.rpc('capture_role_snapshots', { p_region: region }),
    supabase.rpc('capture_city_snapshots', { p_region: region }),
    supabase.rpc('capture_skill_snapshots', { p_region: region }),
    supabase.rpc('capture_company_snapshots', { p_region: region }),
    supabase.rpc('capture_market_snapshots', { p_region: region })
  ]);

  const failures = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && (r.value as any).error));
  if (failures.length > 0) {
    console.error(`[JobService] Some snapshots failed for ${region}:`, failures);
  }

  // After capturing snapshots, trigger trend calculations
  await updateMarketTrends(region);

  return { success: failures.length === 0 };
}

/**
 * Calculates and caches market trends (WoW, MoM, QoQ) in the market_trends table.
 */
export async function updateMarketTrends(region: string = 'us') {
  console.log(`[JobService] Updating market trends for region ${region}...`);

  // 1. Role Trends
  await calculateAndStoreTrends('role', 'role_snapshots', 'role', region);
  
  // 2. City Trends
  await calculateAndStoreTrends('city', 'city_snapshots', 'city', region);
  
  // 3. Skill Trends
  await calculateAndStoreTrends('skill', 'skill_snapshots', 'skill', region);

  console.log(`[JobService] Market trends update complete for ${region}.`);
}

async function calculateAndStoreTrends(entityType: string, snapshotTable: string, nameColumn: string, region: string) {
  // Fetch latest snapshot date
  const { data: latestDate } = await supabase
    .from(snapshotTable)
    .select('captured_at')
    .eq('region', region)
    .order('captured_at', { ascending: false })
    .limit(1)
    .single();

  if (!latestDate) return;

  const now = new Date(latestDate.captured_at);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Fetch current, WoW, MoM, and QoQ data
  const [current, wow, mom, qoq] = await Promise.all([
    fetchSnapshotsAt(snapshotTable, latestDate.captured_at, region),
    fetchSnapshotsAt(snapshotTable, oneWeekAgo.toISOString(), region),
    fetchSnapshotsAt(snapshotTable, oneMonthAgo.toISOString(), region),
    fetchSnapshotsAt(snapshotTable, ninetyDaysAgo.toISOString(), region)
  ]);

  const trends = [];
  for (const [name, currData] of Object.entries(current)) {
    const wowVal = wow[name] ? ((currData.count - wow[name].count) / wow[name].count) * 100 : 0;
    const momVal = mom[name] ? ((currData.count - mom[name].count) / mom[name].count) * 100 : 0;
    const qoqVal = qoq[name] ? ((currData.count - qoq[name].count) / qoq[name].count) * 100 : 0;

    // Calculate Demand Score in TypeScript to save RPC roundtrips
    const salaryBaseline = region === 'india' ? 2000000 : 150000;
    const salaryWeight = Math.min(1.0, (currData.avg_salary || 0) / salaryBaseline);
    const volumeScore = Math.min(1.0, currData.count / 500) * 40;
    const growthScore = Math.min(1.0, Math.max(0, wowVal + 50) / 100) * 40;
    const demandScore = Number((volumeScore + growthScore + (salaryWeight * 20)).toFixed(2));

    trends.push({
      entity_type: entityType,
      entity_name: name,
      region,
      wow_growth: Number(wowVal.toFixed(2)),
      mom_growth: Number(momVal.toFixed(2)),
      qoq_growth: Number(qoqVal.toFixed(2)),
      demand_score: demandScore,
      velocity_score: Number(Math.max(0, Math.min(100, (wowVal + 50))).toFixed(2)), // Simple velocity
      updated_at: new Date().toISOString()
    });
  }

  // Upsert in chunks
  const chunkSize = 50;
  for (let i = 0; i < trends.length; i += chunkSize) {
    await supabase.from('market_trends').upsert(trends.slice(i, i + chunkSize), {
      onConflict: 'entity_type,entity_name,region'
    });
  }
}

async function fetchSnapshotsAt(table: string, date: string, region: string): Promise<Record<string, { count: number, avg_salary?: number }>> {
  // Find nearest snapshot to this date
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('region', region)
    .lte('captured_at', date)
    .order('captured_at', { ascending: false })
    .limit(1000); // Reasonable limit for unique entities

  if (error || !data) return {};

  const result: Record<string, { count: number, avg_salary?: number }> = {};
  
  // Table schema varies slightly
  const nameCol = table.startsWith('role') ? 'role' : table.startsWith('city') ? 'city' : 'skill';
  
  data.forEach(item => {
    result[item[nameCol]] = {
      count: item.job_count,
      avg_salary: item.avg_salary || ((item.avg_salary_min + item.avg_salary_max) / 2) || 0
    };
  });

  return result;
}

export async function getTrendingRoles(region: string = 'us') {
  const { data, error } = await supabase
    .from('trending_roles')
    .select('*')
    .eq('region', region)
    .order('growth_percentage', { ascending: false })
    .limit(8);

  if (error) {
    console.error(`Error fetching trending roles for ${region}:`, error);
    return [];
  }

  return data;
}

export async function getDecliningRoles(region: string = 'us') {
  const { data, error } = await supabase
    .from('trending_roles')
    .select('*')
    .eq('region', region)
    .order('growth_percentage', { ascending: true })
    .limit(8);

  if (error) {
    console.error(`Error fetching declining roles for ${region}:`, error);
    return [];
  }

  return data;
}

export async function getRemoteTrend(region: string = 'us') {
  const { count: totalCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('region', region);

  const { count: remoteCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('region', region)
    .eq('city', 'Remote');

  if (!totalCount) return { percentage: 0, total: 0, remote: 0 };
  
  return {
    total: totalCount,
    remote: remoteCount || 0,
    percentage: Number(((remoteCount || 0) / totalCount * 100).toFixed(1))
  };
}

export async function getAIHiringMomentum(region: string = 'us') {
  const { data, error } = await supabase
    .from('jobs')
    .select('normalized_title, skills')
    .eq('region', region);

  if (error || !data) return { percentage: 0 };

  const aiJobs = data.filter(job => 
    job.normalized_title?.toLowerCase().includes('ai') || 
    job.normalized_title?.toLowerCase().includes('machine learning') ||
    job.skills?.some((s: string) => s.toLowerCase().includes('ai') || s.toLowerCase().includes('llm') || s.toLowerCase().includes('gpt'))
  );

  return {
    percentage: Number((aiJobs.length / data.length * 100).toFixed(1)),
    count: aiJobs.length
  };
}

export async function getJuniorHiringDifficulty(region: string = 'us') {
  const { data, error } = await supabase
    .from('jobs')
    .select('title')
    .eq('region', region);

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

export async function getTopCities(region: string = 'us') {
  const { data, error } = await supabase
    .from('top_cities')
    .select('*')
    .eq('region', region)
    .limit(5);

  if (error) {
    console.error(`Error fetching top cities for ${region}:`, error);
    return [];
  }

  return data;
}

export async function getMarketPulse(region: string = 'us') {
  const { count: totalCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('region', region);

  const { count: recentCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('region', region)
    .gt('posted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Look at last 30 days for better pulse

  // Calculate real average salary from live jobs instead of static benchmarks
  const { data: salaryData } = await supabase
    .from('jobs')
    .select('salary_min, salary_max')
    .eq('region', region)
    .not('salary_min', 'is', null)
    .not('salary_max', 'is', null);

  let avgSalary = region === 'us' ? 160000 : 2500000; // Fallback (160k USD or 25L INR)
  if (salaryData && salaryData.length > 0) {
    const sum = salaryData.reduce((acc, curr) => acc + (Number(curr.salary_min) + Number(curr.salary_max)) / 2, 0);
    avgSalary = sum / salaryData.length;
  }

  // Fetch Market Trend for WoW calculation
  const { data: marketTrend } = await supabase
    .from('market_snapshots')
    .select('total_jobs')
    .eq('region', region)
    .lt('captured_at', new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString())
    .order('captured_at', { ascending: false })
    .limit(1)
    .single();

  const wowTrend = marketTrend && totalCount 
    ? Number((((totalCount - marketTrend.total_jobs) / marketTrend.total_jobs) * 100).toFixed(1))
    : 0;

  // Hiring Index: Based on market volume (scale adjusted)
  const baseline = region === 'us' ? 100 : 50; 
  const hiringIndex = totalCount ? Math.min(10, (totalCount / baseline) + 5.0) : 8.2;

  return {
    totalJobs: totalCount || 0,
    recentJobs: recentCount || 0,
    avgSalary: Math.round(avgSalary),
    hiringIndex: Number(hiringIndex.toFixed(1)),
    wowTrend
  };
}

export async function getMarketTrends(region: string = 'us', entityType: 'role' | 'city' | 'skill' | 'company' = 'role') {
  const { data, error } = await supabase
    .from('market_trends')
    .select('*')
    .eq('region', region)
    .eq('entity_type', entityType)
    .order('demand_score', { ascending: false })
    .limit(20);

  if (error) {
    console.error(`Error fetching ${entityType} trends for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getCityRankings(region: string = 'us') {
  return getMarketTrends(region, 'city');
}

export async function getAllCities(region: string = 'us') {
  const { data, error } = await supabase
    .from('top_cities')
    .select('*')
    .eq('region', region)
    .order('job_count', { ascending: false });

  if (error) {
    console.error(`Error fetching all cities for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getAllRoles(region: string = 'us') {
  const { data, error } = await supabase
    .from('trending_roles')
    .select('*')
    .eq('region', region)
    .order('job_count', { ascending: false });

  if (error) {
    console.error(`Error fetching all roles for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getWeeklyMovers(region: string = 'us', entityType: 'role' | 'skill' | 'city' = 'role') {
  const { data, error } = await supabase
    .from('market_trends')
    .select('*')
    .eq('region', region)
    .eq('entity_type', entityType)
    .order('wow_growth', { ascending: false })
    .limit(5);

  if (error) {
    console.error(`Error fetching weekly movers for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getBreakoutSkills(region: string = 'us') {
  const { data, error } = await supabase
    .from('market_trends')
    .select('*')
    .eq('region', region)
    .eq('entity_type', 'skill')
    .gt('wow_growth', 10)
    .order('wow_growth', { ascending: false })
    .limit(5);

  if (error) {
    console.error(`Error fetching breakout skills for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getMonthlyMomentum(region: string = 'us', entityType: 'role' | 'skill' | 'city' = 'role') {
  const { data, error } = await supabase
    .from('market_trends')
    .select('*')
    .eq('region', region)
    .eq('entity_type', entityType)
    .order('mom_growth', { ascending: false })
    .limit(5);

  if (error) {
    console.error(`Error fetching monthly momentum for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getTopSkills(region: string = 'us') {
  const { data, error } = await supabase
    .from('top_skills')
    .select('*')
    .eq('region', region)
    .limit(10);

  if (error) {
    console.error(`Error fetching top skills for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getHiringTrends(region: string = 'us') {
  const { data, error } = await supabase
    .from('role_snapshots')
    .select('captured_at, job_count')
    .eq('region', region)
    .order('captured_at', { ascending: true });

  if (error) {
    console.error(`Error fetching hiring trends for ${region}:`, error);
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

export async function getSkillGrowth(region: string = 'us') {
  const { data, error } = await supabase.rpc('get_skill_growth', { p_region: region });
  if (error) {
    console.error(`Error fetching skill growth for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getSalaryBenchmarks(region: string = 'us') {
  // Try to compute real benchmarks from ingested jobs
  const { data: realJobs, error } = await supabase
    .from('jobs')
    .select('normalized_title, salary_min, salary_max')
    .eq('region', region)
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
    .eq('region', region)
    .limit(10);

  if (staticError) {
    console.error(`Error fetching salary benchmarks for ${region}:`, staticError);
    return [];
  }
  return staticData;
}

export async function getHistoricalTrends(region: string = 'us', period: string) {
  // period format: YYYY-MM
  const startDate = new Date(`${period}-01T00:00:00Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const { data, error } = await supabase
    .from('role_snapshots')
    .select('*')
    .eq('region', region)
    .gte('captured_at', startDate.toISOString())
    .lt('captured_at', endDate.toISOString());

  if (error || !data || data.length === 0) return null;

  // Aggregate by role
  const roles: Record<string, { count: number, minSum: number, maxSum: number, samples: number }> = {};
  data.forEach(s => {
    if (!roles[s.role]) roles[s.role] = { count: 0, minSum: 0, maxSum: 0, samples: 0 };
    roles[s.role].count = Math.max(roles[s.role].count, s.job_count); // Take peak job count for the month
    roles[s.role].minSum += Number(s.avg_salary_min || 0);
    roles[s.role].maxSum += Number(s.avg_salary_max || 0);
    roles[s.role].samples++;
  });

  return Object.entries(roles).map(([role, stats]) => ({
    role,
    jobCount: stats.count,
    avgSalaryMin: stats.samples > 0 ? stats.minSum / stats.samples : 0,
    avgSalaryMax: stats.samples > 0 ? stats.maxSum / stats.samples : 0
  })).sort((a, b) => b.jobCount - a.jobCount);
}


