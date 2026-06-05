# GitHub Automation Audit - TechJobMarket

## Overview
The TechJobMarket market intelligence pipeline is now fully automated via GitHub Actions. This automation ensures that job data, layoffs, and AI-driven market insights are updated weekly without manual intervention.

## Workflow Configuration
- **File Location**: `.github/workflows/weekly-pipeline.yml`
- **Schedule**: Weekly (Every Monday at 00:00 UTC)
- **Manual Trigger**: Supported via `workflow_dispatch`.
- **Environment**: Node.js 22 on `ubuntu-latest`.

## Execution Flow
1. **Environment Setup**: Installs Node.js 22 and project dependencies.
2. **Browser Installation**: Installs Playwright (Chromium) and its system dependencies to support scraping.
3. **Pipeline Execution**: Runs `npm run pipeline:update` which performs:
    - **Scraping**: Fetches jobs from Indeed, Greenhouse, Lever, Ashby, and RemoteOK.
    - **Layoffs**: Scrapes data from Layoffs.fyi.
    - **Normalization**: Deduplicates jobs and normalizes titles/cities.
    - **Skills Extraction**: Identifies technologies from job descriptions.
    - **Analytics Snapshots**: Captures historical data for trend analysis via Supabase RPCs.
    - **AI Intelligence**: Generates a professional market briefing using Google Gemini.
    - **Persistence**: Updates the Supabase database with the latest findings.

## Required Secrets
The following secrets must be configured in the GitHub repository settings:
- `SUPABASE_URL`: The URL of your Supabase project.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database write access.
- `GEMINI_API_KEY`: Google Gemini API key for intelligence generation.

## Failure Handling
- **Timeout Protection**: The workflow is capped at 60 minutes to prevent stuck processes.
- **Graceful Failures**: Individual scrapers use `Promise.allSettled`, allowing the pipeline to continue even if one source is down.
- **Detailed Logging**: Every step of the pipeline provides granular logs in the GitHub Actions console for easy debugging.

## Future Scaling Considerations
- **Parallel Scrapers**: As more sources are added, scrapers can be further parallelized or moved to separate jobs if they hit the 60-minute limit.
- **Data Retention**: Weekly snapshots will grow the database over time; consider a cleanup policy for raw jobs older than 90 days.
- **Error Alerts**: Integrate Slack or Email notifications on workflow failure for immediate awareness.
