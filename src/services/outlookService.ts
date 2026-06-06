import { supabase } from '../lib/supabase';

export interface RoleOutlook {
  role: string;
  status: 'Growing' | 'Stable' | 'Declining' | 'Oversaturated';
  jobCount: number;
  growthPercentage: number;
  avgSalaryMin: number;
  avgSalaryMax: number;
  topCities: string[];
  keySkills: string[];
  insight: string;
}

export async function getRoleIntelligence(roleName: string, region: string = 'us'): Promise<RoleOutlook | null> {
  const allOutlooks = await getMarketOutlook(region);
  return allOutlooks.find(r => r.role.toLowerCase() === roleName.toLowerCase()) || null;
}

export async function searchRoles(query: string, region: string = 'us'): Promise<RoleOutlook[]> {
  const allOutlooks = await getMarketOutlook(region);
  return allOutlooks.filter(r => r.role.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
}

export async function getMarketOutlook(region: string = 'us'): Promise<RoleOutlook[]> {
  const { data: trendingRoles, error: trendingError } = await supabase
    .from('trending_roles')
    .select('*')
    .eq('region', region)
    .order('job_count', { ascending: false });

  if (trendingError || !trendingRoles) return [];

  const { data: salaryData } = await supabase
    .from('salary_benchmarks')
    .select('*')
    .eq('region', region);
  const salaries = Object.fromEntries((salaryData || []).map(s => [s.role, s]));

  // In a real implementation we would fetch top cities and skills per role here, 
  // but to avoid massive N+1 queries, we'll assign defaults if not pre-aggregated.
  return trendingRoles.map(role => {
    const growth = Number(role.growth_percentage || 0);
    const count = Number(role.job_count || 0);
    
    let status: 'Growing' | 'Stable' | 'Declining' | 'Oversaturated' = 'Stable';
    if (growth > 20) status = 'Growing';
    else if (growth < -20) status = 'Declining';
    else if (count > 50 && growth >= -10 && growth <= 10) status = 'Oversaturated';
    
    const salary = salaries[role.role] || { avg_min: region === 'us' ? 110000 : 1500000, avg_max: region === 'us' ? 160000 : 2500000 };

    return {
      role: role.role,
      status,
      jobCount: count,
      growthPercentage: growth,
      avgSalaryMin: salary.avg_min,
      avgSalaryMax: salary.avg_max,
      topCities: region === 'us' ? ['San Francisco', 'New York', 'Austin'] : ['Bangalore', 'Hyderabad', 'Pune'], // Default fallbacks
      keySkills: ['Cloud Infrastructure', 'Automation', 'Python'], // Default fallback
      insight: generateInsight({ role: role.role, status, growth_percentage: growth, top_cities: region === 'us' ? ['San Francisco', 'New York', 'Austin'] : ['Bangalore', 'Hyderabad', 'Pune'] })
    };
  });
}

function generateInsight(data: any): string {
  const { role, status, growth_percentage, top_cities } = data;
  const cities = top_cities?.join(', ') || 'major hubs';
  
  if (status === 'Growing') {
    return `${role} demand is surging, particularly in ${cities}, with a ${growth_percentage}% increase in recent postings.`;
  } else if (status === 'Declining') {
    return `Hiring for ${role} has slowed down by ${Math.abs(growth_percentage)}%. Candidates should diversify skills.`;
  } else if (status === 'Oversaturated') {
    return `${role} is a highly competitive market with high supply. Focus on niche specializations in ${cities}.`;
  } else {
    return `${role} hiring remains steady across ${cities}, providing consistent career opportunities.`;
  }
}
