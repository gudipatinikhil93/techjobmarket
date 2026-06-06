# India Ingestion Foundation Audit & Evaluation

## Summary
The India Tech Job Intelligence pipeline has been upgraded to a production-grade "Structured Extraction" model. This approach minimizes maintenance costs and maximizes data quality by prioritizing JSON-LD and internal framework state (Next.js __NEXT_DATA__) over fragile DOM scraping.

## Evaluated Sources (Post-Implementation)

### 1. Indeed India (Core - Volume)
- **Strategy:** JSON-LD + DOM Fallback.
- **Status:** Hardened with Playwright stealth.
- **Reliability:** High volume, moderate stability.
- **Maintenance:** Medium (DOM selectors might change, but JSON-LD is stable for Google Jobs).

### 2. Wellfound India (Core - AI/Startup Signals)
- **Strategy:** Structured Extraction (__NEXT_DATA__).
- **Status:** Refactored to extract Apollo GraphQL state directly.
- **Reliability:** Highest signal for AI/ML and Startup trends.
- **Maintenance:** Low (Data structure in JSON is more stable than UI components).

### 3. Instahyre (Core - Premium Tech)
- **Strategy:** DOM Extraction (New Scraper).
- **Status:** Implemented to target high-intent software engineering roles.
- **Reliability:** Very clean data, low noise.
- **Maintenance:** Low to Medium.

## Technical Architecture

### 1. Structured Data First
The scrapers now actively seek out `<script type="application/ld+json">` or `<script id="__NEXT_DATA__">`. This provides:
- Exact salary figures (where available).
- Precise company names and city tags.
- Consistent date formats.

### 2. Stealth & Anti-Bot
Implemented `navigator.webdriver` overrides and custom `User-Agent` rotation to bypass standard bot detection filters.

### 3. Normalization
The `normalization.ts` engine has been verified to handle India-specific roles (e.g., "MTS", "SDE 1/2/3", "GET") and cities (Bengaluru, Hyderabad, NCR hubs).

## Recommendations for Next Phase
1. **Proxy Integration:** To fully realize this pipeline in production, a rotating residential proxy service (focused on India exit nodes) should be integrated into the Playwright browser context.
2. **Sitemap Discovery:** Implement a "Discovery Service" that crawls `in.indeed.com/sitemap.xml` to populate the ingestion queue with fresh URLs.
3. **Database Migration:** Apply `src/db/migrations/01_multi_region.sql` to the production Supabase instance to enable full multi-region analytics.

## Conclusion
The India Ingestion Foundation is now architecturally sound and ready for high-scale tech labor market intelligence gathering.
