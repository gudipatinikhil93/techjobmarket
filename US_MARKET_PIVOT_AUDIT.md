# US MARKET PIVOT AUDIT

**Date:** June 3, 2026
**Target Platform:** TechJobMarket (formerly JobMarketIndia)
**Status:** ✅ COMPLETE

This document provides a brutally honest audit of the transition from an India-focused job market dashboard to a comprehensive US Tech Career Intelligence Platform.

## 1. What is Fully Real & Updated

*   **Platform Branding & Focus:** All hardcoded references to "India", "JobMarketIndia", "LPA", and Indian cities have been eradicated from the frontend. The platform now operates under the `TechJobMarket` brand and targets the US audience.
*   **Data Scraper Architecture:** The Playwright scraping adapters (`indeedPlaywright.ts`, `wellfoundPlaywright.ts`) have been completely refactored to fetch US tech jobs (`United States` location filters, `www.indeed.com`).
*   **Company Scrapers:** Legacy Indian company scrapers (TCS, Infosys) and Indian job boards (Foundit, Internshala) have been deleted or replaced. The pipeline now directly tracks jobs from Google, Meta, and Microsoft.
*   **Frontend Routing & Fallbacks:** Dynamic routes (`/role/[role]`), the unified search (`/search`), and fallback lists have been rewritten. Hardcoded "₹15L" salaries have been replaced with realistic US baseline ranges (e.g., "$130k - $180k").
*   **SEO Overhaul:** Metadata, canonical URLs, and structured data globally point to the new US context. The homepage and category pages feature entirely new long-form SEO copy specifically optimized for keywords like "current US tech job market", "US tech hiring trends", and "software engineer salary".
*   **Fabricated Content Removal:** The `/layoffs` page, which contained entirely mocked data and fake company names, has been completely deleted from the project and removed from all navigation components.

## 2. What is Partially Real / Requires Accumulation

*   **Role Detail & Intelligence Analytics:** The intelligence views, demand categorization ("Critical", "Oversaturated"), and percentage growth metrics rely on actual queries against the Supabase `jobs` table via `jobService.ts` and `outlookService.ts`. However, these metrics are only as strong as the historical data in the database. When the database is newly provisioned or lacks deep history, the frontend renders safe, realistic fallbacks (or states "Insufficient historical data") rather than faking percentages.
*   **Salary Calculations:** The database logic calculates minimums, maximums, and medians based on scraped job data. Because the scrapers now target US job descriptions, the ingested salaries will naturally reflect USD. The frontend currently renders these aggregations divided by 1,000 (appended with 'k') for proper US formatting.

## 3. Remaining Weak Datasets & Scaling Risks

*   **Scraper Fragility:** The `wellfoundPlaywright.ts` scraper frequently encounters DataDome CAPTCHAs. While a stealth configuration was added, high-volume scraping without residential proxy rotation will inevitably fail in a production environment.
*   **Data Normalization:** The current normalization logic is simplistic. It extracts explicit `title`, `company`, and `city` strings from varied job boards. In a high-volume US market, titles like "Senior Member of Technical Staff" and "SDE III" need to be mapped to a unified "Software Engineer" taxonomy using an NLP or LLM layer for accurate aggregations.
*   **Initial DB Seeding:** Until the `pipeline.ts` cron job runs consistently for several weeks, the trend charts on the `/trends` page will display "Insufficient historical data" instead of fabricating lines.

## 4. Homepage UX Improvements

*   **Visual Reorganization:** The dashboard has been transformed into a "Tech Market Pulse." Unrelated widgets have been replaced with a cohesive narrative that guides the user from macro-level insights (Hiring Index) to micro-level exploration (Roles and Skills).
*   **Content Hierarchy:** High-value SEO content explaining the realities of the US tech job market was integrated directly into the homepage scroll, making the site feel significantly more authoritative and ready for AdSense indexing.

## 5. Broken Features Fixed

*   **Trends Bar Chart:** The logic mapping monthly snapshots to percentage heights in `trends.astro` was fixed, ensuring the graph scales correctly when real data is available.
*   **Role Detail SSR:** The dynamic `/role/[role]` route now correctly decodes URLs, calculates specific median ranges, and applies proper US-centric structured data for Google SERP ingestion.

## 6. Final Verdict

The platform has been successfully pivoted. It is honest about its data constraints, visually polished, and technically positioned for the US market. The foundation is now **Enterprise MVP Ready**.

**Data Confidence Level:** High (once the new pipeline seeds the DB)
**SEO Readiness:** High
**AdSense Readiness:** High (pending standard legal/privacy pages)