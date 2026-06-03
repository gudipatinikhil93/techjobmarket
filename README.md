# TechJobMarket (US Tech Career Intelligence)

TechJobMarket is a real-time intelligence platform providing deep analysis of the US tech job market. It empowers software engineers, product managers, and data professionals with data-driven insights into hiring trends, salary benchmarks, and skill demand across major US tech hubs.

## Key Features

*   **Real-time Hiring Pulse:** Live indices of hiring velocity across US cities (San Francisco, NY, Austin, Seattle, etc.).
*   **Salary Intelligence:** Accurate base salary benchmarks for US tech roles (USD).
*   **Skill Demand Matrix:** Tracking the hottest skills in the US ecosystem (GenAI, Cloud, Cybersecurity).
*   **Role Trajectories:** Predictive analysis of growing vs. declining tech careers.
*   **AI-Powered Insights:** Weekly market intelligence reports generated from millions of data points.

## Tech Stack

*   **Frontend:** Astro (SSG/SSR), Tailwind CSS
*   **Backend:** Supabase (PostgreSQL), Edge Functions
*   **Scrapers:** Playwright, Apify
*   **Data Science:** Custom normalization & analytics pipeline

## Getting Started

1.  Clone the repo
2.  Install dependencies: `npm install`
3.  Set up Supabase environment variables in `.env`
4.  Run development server: `npm run dev`
5.  Seed US market data: `npx tsx scripts/seed-us-data.ts`
6.  Trigger US scraping pipeline: `npm run pipeline:update`
