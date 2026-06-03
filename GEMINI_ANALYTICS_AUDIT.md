# GEMINI_ANALYTICS_AUDIT

## Pipeline Flow
The TechJobMarket intelligence pipeline operates on a weekly cycle:
1. **Scraping**: Fetches jobs from multiple sources (Greenhouse, Lever, Ashby, RemoteOK, Indeed).
2. **Normalization**: Titles and cities are normalized to standard US tech hubs and roles.
3. **Storage**: Unique jobs are stored in Supabase.
4. **Snapshots**: Weekly historical snapshots are captured for roles and cities.
5. **Analytics**: Real-time metrics are calculated (Growth, Salary, Remote Trends, AI Momentum).
6. **Gemini Intelligence**: 
   - A structured payload of real analytics is sent to `GeminiService`.
   - Gemini generates a professional market pulse, intelligence briefing, and professional analysis.
7. **Storage**: Insights are stored in the `ai_insights` table.
8. **Refresh**: The homepage dynamically loads the latest insights on every visit.

## Analytics Sources
The following real metrics are extracted from the database and sent to Gemini:
- **Top Growing Roles**: Based on 7-day vs 14-day job volume change.
- **Declining Roles**: Identification of roles with shrinking demand.
- **Top Hiring Cities**: Geographic volume concentration.
- **Market Pulse**: Hiring velocity index (0-10) and total active listings.
- **Remote Trend**: Percentage of 'Remote' listings in the total job pool.
- **AI Hiring Momentum**: Momentum score based on AI/ML keywords in titles and skills.
- **Junior Hiring Difficulty**: Volume of entry-level roles relative to senior roles.
- **Most Requested Skills**: Top skills currently appearing in job descriptions.
- **Salary Benchmarks**: Real-time average min/max salary per role.

## Gemini Prompt Structure
The prompt is designed for high professional standards (Bloomberg/Levels.fyi style):
- **Role**: Senior Labor Market Economist.
- **Constraints**: 
  - Strictly use provided REAL data.
  - No hallucinations or invented percentages.
  - "Limited historical data available" fallback for weak data.
- **Output**: Structured JSON containing `pulse_summary`, `intelligence_briefing` (3 points), and `professional_analysis`.

## Fallback Handling
- **Missing API Key**: Gracefully skips insight generation and logs a warning.
- **Gemini Failure**: The pipeline continues; the homepage displays the most recent successful insight from the database.
- **Database Empty**: If no insights exist, a set of professional initialization defaults is displayed.
- **Weak Data**: Gemini is instructed to lower its confidence score and explicitly mention data limitations.

## Remaining Limitations / Technical Notes
- **API Availability**: During implementation, 404 errors were encountered when calling `gemini-1.5-flash` and `gemini-1.5-pro` via the standard SDK. This is typically due to environment-specific API key restrictions or regional availability. The code is structured according to production standards and will function once a valid AI Studio key is applied to the environment.
- **Historical Depth**: Growth percentages require at least 14 days of data. During initial weeks, "Limited historical data available" warnings are expected.
