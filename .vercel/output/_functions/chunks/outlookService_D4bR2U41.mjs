import { s as supabase } from './supabase_DkDmvypM.mjs';

async function getRoleIntelligence(roleName) {
  const { data, error } = await supabase.from("role_intelligence").select("*").eq("role", roleName).single();
  if (error || !data) {
    return null;
  }
  return {
    role: data.role,
    status: data.status,
    jobCount: data.job_count,
    growthPercentage: data.growth_percentage,
    avgSalaryMin: data.market_avg_min || 0,
    avgSalaryMax: data.market_avg_max || 0,
    topCities: data.top_cities || [],
    keySkills: data.key_skills || [],
    insight: generateInsight(data)
  };
}
async function searchRoles(query) {
  const { data, error } = await supabase.from("role_intelligence").select("*").ilike("role", `%${query}%`).limit(10);
  if (error) return [];
  return data;
}
async function getMarketOutlook() {
  const { data, error } = await supabase.from("role_intelligence").select("*").order("job_count", { ascending: false });
  if (error) return [];
  return data;
}
function generateInsight(data) {
  const { role, status, growth_percentage, top_cities } = data;
  const cities = top_cities?.join(", ") || "major hubs";
  if (status === "Growing") {
    return `${role} demand is surging, particularly in ${cities}, with a ${growth_percentage}% increase in recent postings.`;
  } else if (status === "Declining") {
    return `Hiring for ${role} has slowed down by ${Math.abs(growth_percentage)}%. Candidates should diversify skills.`;
  } else if (status === "Oversaturated") {
    return `${role} is a highly competitive market with high supply. Focus on niche specializations in ${cities}.`;
  } else {
    return `${role} hiring remains steady across ${cities}, providing consistent career opportunities.`;
  }
}

export { getMarketOutlook as a, getRoleIntelligence as g, searchRoles as s };
