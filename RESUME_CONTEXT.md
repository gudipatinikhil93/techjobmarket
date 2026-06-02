# Resume Context - Job Market India

## Current Product State
The application is in a "Feature Complete Beta" state. The visual identity and core data structures are finalized. Data is flowing from Supabase to the UI on the most critical pages.

## Latest Implemented Features
- **Snapshot Analytics:** Implemented a system to track job counts over time, enabling "Growth %" metrics on the frontend.
- **Dynamic Role Routing:** Created `src/pages/role/[role].astro` which generates dedicated landing pages for any normalized job title.
- **Market Pulse Metrics:** Added real-time aggregation for "Active Jobs", "Companies Hiring", and "Hiring Velocity".

## Unresolved Bugs
- **Empty State Fallbacks:** If the DB is empty, some components might look "broken" before the fallbacks kick in (need better loading/error UI).
- **Slug Normalization:** Some role titles with special characters might cause issues in dynamic routes (need consistent slugify utility).

## Next Recommended Tasks
1. **Update `src/pages/cities.astro`**: Mirror the logic used in `index.astro` to fetch real city data from `jobService.getTopCities()`.
2. **Update `src/pages/salaries.astro`**: Implement `jobService.getSalaryBenchmarks()` and consume it on the page.
3. **Environment Setup**: Add `RESUME_CONTEXT.md` to the user's focus and ensure `.env` is populated with Supabase credentials.
4. **Run `scripts/pipeline.ts`**: Verify the full ingestion flow with at least one real data source.

## Important Architecture Decisions
- **Manual Normalization:** We opted for a `title_mappings` table + `normalization.ts` instead of pure AI normalization to maintain deterministic control over the core 30+ roles.
- **Weekly Snapshots:** Data is snapshotted every Monday at 00:00 UTC via GitHub Actions to keep the "Growth" metrics meaningful.
- **Astro SSR:** Using SSR allows us to keep Supabase keys on the server and ensures SEO for dynamically generated role pages.
