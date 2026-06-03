# Live Analytics & Automation Audit

## 1. Pages Fully Connected to Live Data
- **Homepage (`index.astro`)**: Demand Trajectory, Hiring Velocity, Total Open Roles, Median Base Salary, and dynamic outlook are now powered by live database snapshots and active job aggregations instead of static fallbacks.
- **Roles Page (`roles.astro`)**: Rebuilt from the ground up as a high-density intelligence terminal. All rows are populated strictly from the `outlookService` using real market data, replacing the previous static card layout.
- **Trends Page (`trends.astro`)**: Sector growth trajectories and hiring velocities are now derived dynamically from snapshot data and `trending_roles` DB metrics. Hardcoded "Generative AI" / "Cloud Infra" static arrays have been removed.
- **Cities Page (`cities.astro`)**: Fully integrated with the `top_cities` DB view. The "Peak" vs "Growing" status and hiring indices are dynamically scaled based on active job volume rather than hardcoded scores.
- **Skills Page (`skills.astro`)**: Fake trend charts have been removed to ensure 100% data authenticity. YoY growth metrics rely on the `get_skill_growth` database RPC.
- **Salaries Page (`salaries.astro`)**: Dynamically processes the actual `salary_benchmarks` from the database.
- **Search & Role Detail Pages**: Updated to use the correct `RoleOutlook` data structures (`jobCount`, `avgSalaryMin`, etc.) sourced from live queries.

## 2. Automation Improvements
- The automation workflow (`scripts/pipeline.ts` and `.github/workflows/weekly-pipeline.yml`) successfully covers the entire lifecycle: Scrape -> Normalize -> Deduplicate -> Store -> Generate Snapshots -> Insight Generation.
- Because the Astro platform is configured with `output: 'server'` (SSR), the UI automatically reflects the newly scraped data immediately after the database is updated. No manual deployment step is required.

## 3. Analytics Rebuilt
- The missing `role_intelligence` view in the database was bypassed by rewriting the logic directly in `src/services/outlookService.ts`. This service now actively cross-references the `trending_roles` view with `salary_benchmarks` to accurately calculate:
  - "Growing" (> 20% growth)
  - "Declining" (< -20% growth)
  - "Oversaturated" (high volume, stagnant growth)
  - "Stable"
- The Homepage pulse now aggregates total jobs, average salaries, and calculates a realistic market outlook dynamically based on overall momentum rather than a hardcoded "Cautious" string.

## 4. Remaining Weak Datasets
- **Remote Work Tracking**: We currently lack a dedicated "Remote" vs "On-Site" classification in the `jobs` table schema. The top city logic can occasionally return "Remote" if normalized as such, but a formal boolean flag is missing.
- **Skills Extraction**: `industries` and `keySkills` arrays still rely on some fallback mapping in `outlookService.ts` to prevent massive N+1 queries. We need a robust `role_skills` materialized view to serve exact skill frequencies per role efficiently.

## 5. Trend Confidence Levels & Historical Limitations
- **Momentum Accuracy**: The "Hiring Velocity" index on the Trends page requires at least 2 snapshot captures (over several weeks) to display a meaningful trajectory. If the database only has one snapshot, the UI now gracefully displays an honest "Initializing" message.
- **Growth Percentage**: `trending_roles` compares the last 7 days to the previous 7 days. In cases where historical data for a specific role is sparse, growth percentage may artificially spike to 100% or drop to 0%.

## 6. UX Improvements
- **Roles Page Transformation**: Shifted from a blog-style card grid to a professional data table featuring client-side search, multi-column sorting (Role, Outlook, Salary, Openings, Momentum), and status filtering. This significantly improves scannability.
- **Honest Fallbacks**: Across all pages, if data is insufficient (e.g., zero job counts or lack of historical snapshots), the platform explicitly tells the user that the data is aggregating rather than showing fake charts.

## 7. Remaining Technical Debt
- **Materialized Views**: The heavy lifting done in `outlookService.ts` should eventually be moved back into the database as a proper `role_intelligence` materialized view to improve query performance under heavy load.
- **Top Cities per Role**: Querying the top 3 cities for every single role in real-time is too expensive. This needs to be pre-calculated during the automated snapshot pipeline.
- **OpenAI Key Dependency**: The `aiService` insights generation will fail quietly if the `OPENAI_API_KEY` is not present, falling back to static strings.
