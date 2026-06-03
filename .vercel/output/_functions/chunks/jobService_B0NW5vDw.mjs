import { s as supabase } from './supabase_DkDmvypM.mjs';

const TITLE_MAP = {
  "SDE": "Software Engineer",
  "SOFTWARE ENGINEER": "Software Engineer",
  "SOFTWARE DEVELOPER": "Software Engineer",
  "BACKEND": "Backend Developer",
  "FRONTEND": "Frontend Developer",
  "FULLSTACK": "Full Stack Developer",
  "FULL-STACK": "Full Stack Developer",
  "FULL STACK": "Full Stack Developer",
  "DATA SCIENTIST": "Data Scientist",
  "DATA ANALYST": "Data Analyst",
  "DATA ENGINEER": "Data Engineer",
  "MACHINE LEARNING": "AI/ML Engineer",
  "AI ENGINEER": "AI/ML Engineer",
  "PRODUCT MANAGER": "Product Manager",
  "PRODUCT OWNER": "Product Manager",
  "DEVOPS": "DevOps Engineer",
  "SITE RELIABILITY": "DevOps Engineer",
  "SRE": "DevOps Engineer",
  "CLOUD": "Cloud Engineer",
  "CYBERSECURITY": "Security Engineer",
  "SECURITY": "Security Engineer",
  "MOBILE": "Mobile Developer",
  "IOS": "Mobile Developer",
  "ANDROID": "Mobile Developer",
  "REACT NATIVE": "Mobile Developer",
  "FLUTTER": "Mobile Developer",
  "QA": "QA Engineer",
  "TEST": "QA Engineer",
  "UI/UX": "Designer",
  "DESIGNER": "Designer",
  "GRAPHIC": "Designer",
  "PRODUCT DESIGN": "Designer",
  "INFRASTRUCTURE": "Cloud Engineer",
  "SYSTEMS ENGINEER": "Software Engineer",
  "EMBEDDED": "Embedded Engineer",
  "FIRMWARE": "Embedded Engineer",
  "BLOCKCHAIN": "Web3 Developer",
  "ETHEREUM": "Web3 Developer",
  "SMART CONTRACT": "Web3 Developer",
  "SALESFORCE": "Salesforce Developer",
  "SAP": "ERP Consultant",
  "ORACLE": "Database Administrator",
  "DBA": "Database Administrator"
};
function normalizeTitle(title) {
  if (!title) return "Other";
  const upperTitle = title.toUpperCase();
  for (const [key, value] of Object.entries(TITLE_MAP)) {
    if (upperTitle.includes(key)) {
      return value;
    }
  }
  return title.replace(/\s*\(.*\)\s*/g, "").replace(/\s*-\s*.*$/g, "").trim();
}
function normalizeCity(city) {
  if (!city) return "Remote";
  const hubMap = {
    "SAN FRANCISCO": "San Francisco",
    "SF": "San Francisco",
    "BAY AREA": "San Francisco",
    "NEW YORK": "New York",
    "NYC": "New York",
    "AUSTIN": "Austin",
    "SEATTLE": "Seattle",
    "BOSTON": "Boston",
    "CHICAGO": "Chicago",
    "LOS ANGELES": "Los Angeles",
    "LA": "Los Angeles",
    "DENVER": "Denver",
    "BOULDER": "Denver",
    "MIAMI": "Miami",
    "ATLANTA": "Atlanta",
    "REMOTE": "Remote"
  };
  const upperCity = city.toUpperCase();
  for (const [key, value] of Object.entries(hubMap)) {
    if (upperCity.includes(key)) return value;
  }
  return city.trim();
}
function cleanSalary(salary) {
  if (salary === void 0 || salary === null || salary === "") return null;
  if (typeof salary === "number") {
    if (isNaN(salary) || salary === 0) return null;
    return salary;
  }
  const cleanStr = salary.replace(/[$,kK]/g, (match) => {
    if (match.toLowerCase() === "k") return "000";
    return "";
  }).replace(/,/g, "");
  const num = parseFloat(cleanStr);
  return isNaN(num) || num === 0 ? null : num;
}

async function processAndStoreJobs(rawJobs) {
  if (!rawJobs.length) return [];
  const processedJobs = rawJobs.map((job) => ({
    title: job.title,
    normalized_title: normalizeTitle(job.title),
    company: job.company,
    city: normalizeCity(job.city),
    salary_min: cleanSalary(job.salary_min),
    salary_max: cleanSalary(job.salary_max),
    skills: job.skills || [],
    source: job.source,
    url: job.url,
    posted_at: job.posted_at || (/* @__PURE__ */ new Date()).toISOString(),
    original_json: job.original_json || {}
  }));
  const chunkSize = 100;
  const results = [];
  for (let i = 0; i < processedJobs.length; i += chunkSize) {
    const chunk = processedJobs.slice(i, i + chunkSize);
    const { data, error } = await supabase.from("jobs").upsert(chunk, {
      onConflict: "url",
      ignoreDuplicates: false
    }).select();
    if (error) {
      console.error(`Error storing chunk starting at ${i}:`, error);
      continue;
    }
    if (data) results.push(...data);
  }
  return results;
}
async function captureSnapshots() {
  console.log("Capturing historical snapshots...");
  const { data: roleData, error: roleError } = await supabase.rpc("capture_role_snapshots");
  if (roleError) console.error("Error capturing role snapshots:", roleError);
  const { data: cityData, error: cityError } = await supabase.rpc("capture_city_snapshots");
  if (cityError) console.error("Error capturing city snapshots:", cityError);
  return { success: !roleError && !cityError };
}
async function getTrendingRoles() {
  const { data, error } = await supabase.from("trending_roles").select("*").limit(8);
  if (error) {
    console.error("Error fetching trending roles:", error);
    return [];
  }
  return data;
}
async function getTopCities() {
  const { data, error } = await supabase.from("top_cities").select("*").limit(5);
  if (error) {
    console.error("Error fetching top cities:", error);
    return [];
  }
  return data;
}
async function getMarketPulse() {
  const { count: totalCount } = await supabase.from("jobs").select("*", { count: "exact", head: true });
  const { count: recentCount } = await supabase.from("jobs").select("*", { count: "exact", head: true }).gt("posted_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString());
  const { data: salaryData } = await supabase.from("salary_benchmarks").select("avg_min, avg_max");
  let avgSalary = 0;
  if (salaryData && salaryData.length > 0) {
    const sum = salaryData.reduce((acc, curr) => acc + (Number(curr.avg_min) + Number(curr.avg_max)) / 2, 0);
    avgSalary = sum / salaryData.length;
  }
  const hiringIndex = totalCount ? Math.min(10, totalCount / 500 + 7.5) : 8.2;
  return {
    totalJobs: totalCount || 0,
    recentJobs: recentCount || 0,
    avgSalary: avgSalary || 16e4,
    // Default to US Tech average if no data
    hiringIndex
  };
}
async function getAllCities() {
  const { data, error } = await supabase.from("top_cities").select("*").order("job_count", { ascending: false });
  if (error) {
    console.error("Error fetching all cities:", error);
    return [];
  }
  return data;
}
async function getAllRoles() {
  const { data, error } = await supabase.from("trending_roles").select("*").order("job_count", { ascending: false });
  if (error) {
    console.error("Error fetching all roles:", error);
    return [];
  }
  return data;
}
async function getTopSkills() {
  const { data, error } = await supabase.from("top_skills").select("*").limit(10);
  if (error) {
    console.error("Error fetching top skills:", error);
    return [];
  }
  return data;
}
async function getHiringTrends() {
  const { data, error } = await supabase.from("role_snapshots").select("captured_at, job_count").order("captured_at", { ascending: true });
  if (error) {
    console.error("Error fetching hiring trends:", error);
    return [];
  }
  const monthlyData = {};
  data.forEach((snapshot) => {
    const date = new Date(snapshot.captured_at);
    const month = date.toLocaleString("default", { month: "short", year: "2-digit" });
    if (!monthlyData[month]) {
      monthlyData[month] = { total: 0, count: 0 };
    }
    monthlyData[month].total += snapshot.job_count;
    monthlyData[month].count += 1;
  });
  return Object.entries(monthlyData).map(([month, stats]) => ({
    month,
    value: Math.round(stats.total / stats.count)
    // Average job count per capture in that month
  }));
}
async function getSkillGrowth() {
  const { data, error } = await supabase.rpc("get_skill_growth");
  if (error) {
    console.error("Error fetching skill growth:", error);
    return [];
  }
  return data;
}
async function getSalaryBenchmarks() {
  const { data, error } = await supabase.from("salary_benchmarks").select("*").limit(10);
  if (error) {
    console.error("Error fetching salary benchmarks:", error);
    return [];
  }
  return data;
}

export { getTrendingRoles as a, getAllCities as b, captureSnapshots as c, getAllRoles as d, getSalaryBenchmarks as e, getTopSkills as f, getTopCities as g, getSkillGrowth as h, getHiringTrends as i, getMarketPulse as j, processAndStoreJobs as p };
