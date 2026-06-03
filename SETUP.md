# Local Development Setup Guide

Welcome to the setup guide for the **US Tech Job Market Intelligence** platform. This document covers the steps required to get the application running locally, including setting up the database, external APIs, and the backend pipeline.

## 1. Prerequisites
- Node.js >= 22.12.0
- npm (or yarn/pnpm)
- Supabase account (for PostgreSQL)
- Apify account (for scraping data)
- OpenAI account (for AI insights)

## 2. Environment Variables
1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required credentials in your new `.env` file.

## 3. Database Setup (Supabase)
1. Create a new Supabase project.
2. Go to the SQL Editor in your Supabase dashboard.
3. Copy the contents of `src/db/schema.sql` and run it to create all tables, views, and snapshot functions.
4. Add the `SUPABASE_URL` and `SUPABASE_ANON_KEY` to your `.env` file.

## 4. Scraper Setup (Apify)
The data pipeline relies on Apify actors.
1. Sign up for Apify and retrieve your API token from Settings -> Integrations.
2. Add `APIFY_API_TOKEN` to your `.env`.
3. Note: The application currently uses `bebity~wellfound-jobs-scraper` and `anchor~linkedin-jobs-scraper`. If these actors are not available, you may need to substitute them with equivalent ones in `src/scraper/adapter.ts`.

## 5. AI Insights (OpenAI)
To generate the weekly insights:
1. Obtain an API key from the OpenAI platform.
2. Add `OPENAI_API_KEY` to your `.env`.

## 6. Running the Project Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:4321` in your browser.

## 7. Running the Data Pipeline
To populate the database with fresh data, run the weekly pipeline script:
```bash
npm run pipeline:update
```
If you do not have API keys for Apify/OpenAI, the pipeline will fail gracefully. You can temporarily insert mock data into your Supabase SQL editor if needed for UI testing.
