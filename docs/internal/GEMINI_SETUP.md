# Gemini AI Setup & Pipeline Documentation

## 1. API Key Security
- **Storage**: The `GEMINI_API_KEY` is stored in the root `.env` file.
- **Server-Side Only**: The key is accessed via `process.env` or `import.meta.env` in server-side contexts only (`src/services/aiService.ts`). 
- **Frontend Protection**: The key is **never** prefixed with `PUBLIC_` (Astro's convention) to ensure it is never bundled into the client-side JavaScript.

## 2. AI Intelligence Pipeline
The AI layer is designed to summarize real, scraped data rather than generating speculative metrics.

### Workflow:
1. **Weekly Scrape**: Scrapers fetch US tech job data from multiple sources (Indeed, Greenhouse, Lever, etc.).
2. **Analytics Generation**: `jobService.ts` processes the raw jobs and updates the `trending_roles`, `top_cities`, and `market_pulse` tables in Supabase.
3. **Gemini Summary**: `aiService.ts` pulls the latest data from these tables and sends it to Gemini (using the `gemini-1.5-flash` model) with a strict "no-hallucination" prompt.
4. **Storage**: Gemini's 3-point summary is stored in the `ai_insights` table in Supabase.
5. **Display**: The homepage retrieves the latest record from `ai_insights` to show the "Market Intelligence Briefing."

## 3. Automation
The entire pipeline is automated via `scripts/pipeline.ts`.

- **Local/CI Execution**: Running `npm run pipeline:update` triggers the full sequence (Scrape -> Snapshot -> AI Summary).
- **Weekly Schedule**: This script is intended to be run weekly via a GitHub Action or a cron job to keep the homepage insights fresh and data-driven.

## 4. Usage in Code
To generate fresh insights manually:
```typescript
import { generateWeeklyInsights } from './src/services/aiService';
await generateWeeklyInsights();
```

To display insights in an Astro component:
```astro
---
import { getLatestInsights } from '../services/aiService';
const insights = await getLatestInsights();
---
<ul>
  {insights.map(point => <li>{point}</li>)}
</ul>
```
