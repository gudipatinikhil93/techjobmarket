import { supabase } from '../lib/supabase';
import { 
  getTrendingRoles, 
  getTopCities, 
  getMarketPulse, 
  getDecliningRoles, 
  getRemoteTrend, 
  getAIHiringMomentum, 
  getJuniorHiringDifficulty,
  getTopSkills,
  getSalaryBenchmarks
} from './jobService';
import { GeminiService } from './geminiService';

/**
 * Service to generate AI-driven market insights based on real data using Google Gemini.
 */
export async function generateWeeklyInsights(region: string = 'us') {
  console.log(`[AI-Service] Starting Market Intelligence Generation for region ${region}...`);

  const apiKey = import.meta.env?.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
  
  if (!apiKey) {
    console.error('[AI-Service] GEMINI_API_KEY is not configured. Skipping.');
    return { success: false, error: 'GEMINI_API_KEY missing' };
  }

  // 1. Gather comprehensive real data context from our database
  console.log(`[AI-Service] Fetching real-time analytics for ${region}...`);
  const [
    trendingRoles,
    decliningRoles,
    topCities,
    marketPulse,
    remoteTrend,
    aiMomentum,
    juniorDifficulty,
    topSkills,
    salaryBenchmarks
  ] = await Promise.all([
    getTrendingRoles(region),
    getDecliningRoles(region),
    getTopCities(region),
    getMarketPulse(region),
    getRemoteTrend(region),
    getAIHiringMomentum(region),
    getJuniorHiringDifficulty(region),
    getTopSkills(region),
    getSalaryBenchmarks(region)
  ]);

  const dataContext = {
    region,
    growing_roles: trendingRoles,
    declining_roles: decliningRoles,
    hiring_cities: topCities,
    market_pulse: marketPulse,
    remote_trend: remoteTrend,
    ai_hiring_momentum: aiMomentum,
    junior_hiring_difficulty: juniorDifficulty,
    top_skills: topSkills,
    salary_benchmarks: salaryBenchmarks,
    timestamp: new Date().toISOString()
  };

  try {
    // 2. Initialize Gemini Service
    const gemini = new GeminiService(apiKey);

    // 3. Generate Intelligence
    console.log(`[AI-Service] Sending ${region} analytics to Gemini...`);
    const intelligence = await gemini.generateMarketIntelligence(dataContext);

    if (!intelligence || !intelligence.pulse_summary) {
      throw new Error('Invalid intelligence generated from Gemini');
    }

    // 4. Store in DB
    console.log(`[AI-Service] Storing insights in Supabase for ${region}...`);
    const { error } = await supabase.from('ai_insights').insert({
      insight_type: 'weekly_summary',
      region: region,
      content: JSON.stringify(intelligence),
      metadata: dataContext
    });

    if (error) throw error;
    
    console.log(`[AI-Service] Successfully generated and stored professional market intelligence for ${region}.`);
    return { success: true, intelligence };
  } catch (error) {
    console.error(`[AI-Service] Error generating insights for ${region}:`, error);
    return { success: false, error };
  }
}

/**
 * Retrieves the latest AI insights from the database for a specific region.
 */
export async function getLatestInsights(region: string = 'us') {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('insight_type', 'weekly_summary')
    .eq('region', region)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const fallback = {
    pulse_summary: `Analyzing ${region.toUpperCase()} market data... fresh AI insights will be available once the weekly intelligence pipeline completes.`,
    intelligence_briefing: [
      `Hiring patterns in key tech hubs are showing stable growth.`,
      "Salary benchmarks for senior engineering roles are currently being updated.",
      "Remote work remains a significant factor in software engineering roles."
    ],
    professional_analysis: `The ${region.toUpperCase()} tech market is currently undergoing a period of stabilization. We are monitoring hiring velocity across major hubs to provide high-confidence trend analysis.`,
    confidence_score: 0.5,
    data_limitations: "Limited historical data available during initialization."
  };

  if (error || !data) {
    return fallback;
  }

  try {
    return JSON.parse(data.content);
  } catch (e) {
    console.error(`Error parsing stored insights for ${region}:`, e);
    return fallback;
  }
}

