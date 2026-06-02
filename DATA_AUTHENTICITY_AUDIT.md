# JobMarketIndia Data Authenticity Audit

This document provides a brutally honest assessment of the data powering each section of the JobMarketIndia application as of June 2026.

## Overall Status: **HYBRID**
The application has a functional data ingestion pipeline and database, but several high-level analytics and specialized pages are still using hardcoded mock data or placeholder logic.

---

## 1. Homepage
*   **Trending Job Roles:** `PARTIALLY REAL`
    *   Fetched from `trending_roles` view in Supabase.
    *   **Fallback:** Uses hardcoded mock data if the database returns an empty set.
    *   **Growth %:** Derived from a 7-day vs. previous 7-day comparison in the DB.
*   **Top Hiring Hubs:** `PARTIALLY REAL`
    *   Fetched from `top_cities` view in Supabase.
    *   **Fallback:** Uses hardcoded mock data if empty.
    *   **Index Calculation:** Uses a basic formula `(job_count / 100) + 5` capped at 10.
*   **Stats Grid (DataCards):** `HARDCODED`
    *   Hiring Index (8.4), Avg. Tech Salary (₹18.5 LPA), Open Roles (425k+), and Layoff Index (Low) are all static strings in `index.astro`.
*   **Weekly Market Intelligence (AI Insights):** `MOCK/FALLBACK`
    *   The `aiService.ts` returns a set of 3 hardcoded "insights" regardless of actual market data.

## 2. Roles Page
*   **Role List:** `REAL`
    *   Consumes the `trending_roles` view. Shows actual job counts from the `jobs` table.

## 3. Skills Page
*   **Skills List:** `REAL`
    *   Consumes the `top_skills` view (unnested from the `jobs.skills` array).
*   **Growth Metrics:** `BROKEN / HARDCODED`
    *   Currently shows "+N/A" for all skills because historical snapshot comparison is not implemented in the frontend.
*   **Skill Saturation vs. Demand:** `HARDCODED`
    *   The progress bars for "GenAI Engineering", etc., are static values.

## 4. Salaries Page
*   **Salary Table:** `PARTIALLY REAL`
    *   Uses `salary_benchmarks` view which averages `salary_min` and `salary_max` from the `jobs` table.
    *   **Issue:** The experience-based columns (0-2y, 2-5y, etc.) are currently populated with placeholders or just the average min/max because the database does not yet categorize jobs by experience level.
*   **Premium Insights:** `HARDCODED`
    *   Text about "Stock Options" and "GenAI Premium" is static.

## 5. Trends Page
*   **Hiring Velocity Index (Bar Graph):** `HARDCODED / BROKEN`
    *   Uses a static `monthlyTrends` array.
    *   The "+24%" growth figure is a static string.
*   **Sector Growth:** `HARDCODED`
    *   Uses a static `sectorComparison` array.
*   **Insights Grid:** `HARDCODED`
    *   All "Market Insights" (e.g., "The Agentic Shift") are static text.

## 6. Cities Page
*   **City List:** `REAL`
    *   Consumes the `top_cities` view.

## 7. Layoffs Page
*   **Layoff Tracker:** `MOCK / FAKE`
    *   All companies (CloudScale India, FinFlow, etc.) and their impact metrics are entirely fabricated mock data. There is no `layoffs` table in the database.

## 8. Reports Section
*   **Status:** `REMOVED` (as of this audit).

---

## Technical Debt / Critical Inconsistencies
1.  **Hiring Index:** No actual logic exists to calculate this index from historical data.
2.  **Layoff Data:** No source for real layoff data is integrated.
3.  **Salary Categorization:** Scraper does not consistently extract years of experience, making experience-based salary ranges difficult to calculate.
4.  **AI Service:** The "Weekly Insights" are not dynamic and do not reflect the current database state.
