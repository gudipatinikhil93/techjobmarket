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
  const { data: intelligence, error } = await supabase
    .from('role_intelligence')
    .select('*')
    .eq('region', region)
    .order('job_count', { ascending: false });

  if (error || !intelligence) {
    console.error(`Error fetching role intelligence for ${region}:`, error);
    return [];
  }

  return intelligence.map(role => {
    return {
      role: role.role,
      status: role.status as 'Growing' | 'Stable' | 'Declining' | 'Oversaturated',
      jobCount: Number(role.job_count || 0),
      growthPercentage: Number(role.growth_percentage || 0),
      avgSalaryMin: role.market_avg_min || (region === 'us' ? 110000 : 1500000),
      avgSalaryMax: role.market_avg_max || (region === 'us' ? 160000 : 2500000),
      topCities: role.top_cities || (region === 'us' ? ['San Francisco', 'New York', 'Austin'] : ['Bangalore', 'Hyderabad', 'Pune']),
      keySkills: role.key_skills || ['Cloud Infrastructure', 'Automation', 'Python'],
      insight: generateInsight({ 
        role: role.role, 
        status: role.status, 
        growth_percentage: role.growth_percentage, 
        top_cities: role.top_cities 
      })
    };
  });
}

export interface CityIntelligence {
  city: string;
  region: string;
  jobCount: number;
  avgSalary: number;
  growthPercentage: number;
  topRoles: { role: string; count: number }[];
  topSkills: { skill: string; count: number }[];
  status: 'Booming' | 'Steady' | 'Shifting' | 'Cooling';
  insight: string;
}

export async function getCityIntelligence(cityName: string, region: string = 'us'): Promise<CityIntelligence | null> {
  const { data: cityData, error } = await supabase
    .from('top_cities')
    .select('*')
    .eq('city', cityName)
    .eq('region', region)
    .single();

  if (error || !cityData) return null;

  // Fetch top roles in this city
  const { data: topRoles } = await supabase
    .from('jobs')
    .select('normalized_title')
    .eq('city', cityName)
    .eq('region', region)
    .not('normalized_title', 'is', null);

  const roleCounts: Record<string, number> = {};
  topRoles?.forEach(r => {
    roleCounts[r.normalized_title] = (roleCounts[r.normalized_title] || 0) + 1;
  });
  const roles = Object.entries(roleCounts)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Fetch top skills in this city
  const { data: jobsWithSkills } = await supabase
    .from('jobs')
    .select('skills')
    .eq('city', cityName)
    .eq('region', region);

  const skillCounts: Record<string, number> = {};
  jobsWithSkills?.forEach(j => {
    (j.skills || []).forEach((s: string) => {
      skillCounts[s] = (skillCounts[s] || 0) + 1;
    });
  });
  const skills = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Fetch WoW growth from market_trends
  const { data: trend } = await supabase
    .from('market_trends')
    .select('wow_growth')
    .eq('entity_name', cityName)
    .eq('entity_type', 'city')
    .eq('region', region)
    .single();

  const growth = trend?.wow_growth || 0;
  let status: 'Booming' | 'Steady' | 'Shifting' | 'Cooling' = 'Steady';
  if (growth > 15) status = 'Booming';
  else if (growth < -15) status = 'Cooling';
  else if (growth > 0) status = 'Steady';
  else status = 'Shifting';

  return {
    city: cityName,
    region,
    jobCount: cityData.job_count,
    avgSalary: cityData.avg_salary,
    growthPercentage: growth,
    topRoles: roles,
    topSkills: skills,
    status,
    insight: `${cityName} is currently a ${status.toLowerCase()} tech hub in ${region.toUpperCase()}. ${roles[0]?.role} and ${roles[1]?.role} are the most sought-after positions.`
  };
}

export interface SkillIntelligence {
  skill: string;
  region: string;
  jobCount: number;
  growthPercentage: number;
  topRoles: { role: string; count: number }[];
  topCities: { city: string; count: number }[];
  avgSalary: number;
  status: 'Hot' | 'Rising' | 'Stable' | 'Legacy';
  insight: string;
}

export async function getSkillIntelligence(skillName: string, region: string = 'us'): Promise<SkillIntelligence | null> {
  const { data: skillData, error } = await supabase
    .from('top_skills')
    .select('*')
    .eq('skill', skillName)
    .eq('region', region)
    .single();

  if (error || !skillData) return null;

  // Fetch top roles for this skill
  const { data: rolesWithSkill } = await supabase
    .from('jobs')
    .select('normalized_title, salary_min, salary_max')
    .contains('skills', [skillName])
    .eq('region', region);

  const roleCounts: Record<string, number> = {};
  let salarySum = 0;
  let salaryCount = 0;
  rolesWithSkill?.forEach(r => {
    if (r.normalized_title) {
      roleCounts[r.normalized_title] = (roleCounts[r.normalized_title] || 0) + 1;
    }
    if (r.salary_min && r.salary_max) {
      salarySum += (Number(r.salary_min) + Number(r.salary_max)) / 2;
      salaryCount++;
    }
  });

  const roles = Object.entries(roleCounts)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Fetch top cities for this skill
  const { data: citiesWithSkill } = await supabase
    .from('jobs')
    .select('city')
    .contains('skills', [skillName])
    .eq('region', region);

  const cityCounts: Record<string, number> = {};
  citiesWithSkill?.forEach(c => {
    cityCounts[c.city] = (cityCounts[c.city] || 0) + 1;
  });
  const cities = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Fetch WoW growth from market_trends
  const { data: trend } = await supabase
    .from('market_trends')
    .select('wow_growth')
    .eq('entity_name', skillName)
    .eq('entity_type', 'skill')
    .eq('region', region)
    .single();

  const growth = trend?.wow_growth || 0;
  let status: 'Hot' | 'Rising' | 'Stable' | 'Legacy' = 'Stable';
  if (growth > 25) status = 'Hot';
  else if (growth > 10) status = 'Rising';
  else if (growth < -10) status = 'Legacy';

  return {
    skill: skillName,
    region,
    jobCount: skillData.job_count,
    growthPercentage: growth,
    topRoles: roles,
    topCities: cities,
    avgSalary: salaryCount > 0 ? salarySum / salaryCount : (region === 'us' ? 140000 : 2000000),
    status,
    insight: `${skillName} is a ${status.toLowerCase()} skill in ${region.toUpperCase()}, particularly for ${roles[0]?.role} positions in ${cities[0]?.city}.`
  };
}

export async function getComparisonIntelligence(entity1: string, entity2: string, region: string = 'us') {
  // Detect if it's city vs city, role vs role, or skill vs skill
  // For simplicity, we'll try to fetch both as roles first, then cities, then skills
  
  const [role1, role2] = await Promise.all([
    getRoleIntelligence(entity1, region),
    getRoleIntelligence(entity2, region)
  ]);

  if (role1 && role2) {
    return {
      type: 'role',
      entity1: role1,
      entity2: role2
    };
  }

  const [city1, city2] = await Promise.all([
    getCityIntelligence(entity1, region),
    getCityIntelligence(entity2, region)
  ]);

  if (city1 && city2) {
    return {
      type: 'city',
      entity1: city1,
      entity2: city2
    };
  }

  const [skill1, skill2] = await Promise.all([
    getSkillIntelligence(entity1, region),
    getSkillIntelligence(entity2, region)
  ]);

  if (skill1 && skill2) {
    return {
      type: 'skill',
      entity1: skill1,
      entity2: skill2
    };
  }

  return null;
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
