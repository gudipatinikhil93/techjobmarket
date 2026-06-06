# Project Status - US Tech Job Market Intelligence

## Current Architecture
- **Framework:** AstroJS 6.x (SSR Mode)
- **Styling:** Tailwind CSS 4.x
- **Database:** Supabase (PostgreSQL) with specialized schema for market analysis.
- **Data Pipeline:** Custom TypeScript scrapers with Apify and Playwright adapters.
- **Deployment:** Cloudflare Workers.
- **Automation:** GitHub Actions for weekly data ingestion and AI insight generation.

## Completed Systems
- **Public India Beta Rollout:** Transitioned India region to public status (`public: true`). Enabled full search indexing for `/india/*` paths. (June 2026)
- **Programmatic SEO Expansion:** Implemented scalable intelligence pages for cities (`/city/[city]`) and skills (`/skill/[skill]`) across all regions. Added head-to-head comparison engine (`/comparisons/[e1]-vs-[e2]`). (June 2026)
- **Historical Intelligence Archives:** Built a monthly trend snapshot system (`/trends/[YYYY-MM]`) to capture and expose compounding historical market value for SEO authority. (June 2026)
- **Lightweight Retention Layer:** Integrated an interaction-based email capture system (`EmailCapture.astro`) to drive weekly intelligence briefing growth without full authentication bloat. (June 2026)
- **Trust & Transparency Section:** Added a comprehensive methodology and data source transparency section to the About page, including coverage counts and confidence indicators. (June 2026)
- **Mobile Performance Pass:** Fixed Geist font 404s, implemented manual .woff2 hosting, deferred analytics, optimized glass/blur effects for mobile GPUs, and consolidated IntersectionObservers to reduce main-thread work. (June 2026)
- **Visible US Market Atmosphere:** Transformed the site into a premium US financial intelligence terminal. Implemented 10-15% perceptible atmospheric layering, cinematic lighting depth, and desaturated regional accents across all primary and secondary pages. (June 2026)
- **Premium Motion Design:** Implemented subtle atmospheric US theming, scroll-reveal system, metric count-up animations, and micro-interactions. (June 2026)
- **Production Performance Optimization:** Performed a COMPLETE production-grade cleanup. Reduced CSS bloat, optimized atmospheric rendering (GPU-efficient), slashed favicon size by 95% (264KB → 12KB), implemented security headers middleware, and fixed accessibility contrast issues. (June 2026)
- **Core UI & Layout:** Fully responsive "Dark Premium" aesthetic implemented across all key components (Navbar, Footer, DataCard, Layout).
- **Database Schema:** 
  - `jobs`: Raw job listings with source tracking.
  - `role_snapshots` & `city_snapshots`: Historical data for trend analysis.
  - `title_mappings`: Fuzzy matching and normalization system.
  - `ai_insights`: Storage for LLM-generated market summaries.
- **Normalization Engine:** `normalization.ts` handles role and city deduplication with support for 30+ major tech roles.
- **Market Intelligence Services:** 
  - `jobService.ts`: Real-time SQL aggregation for trending roles, top cities, and market pulse.
  - `aiService.ts`: Skeleton for LLM processing.
  - `outlookService.ts`: Sector-based outlook and growth trajectory calculations.
- **Pages (Connected to DB):**
  - Home Page (`index.astro`)
  - Trends Page (`trends.astro`)
  - Dynamic Role Pages (`[role].astro`)

## Remaining Issues
- **Scraper Reliability:** Scrapers currently rely on mock adapters or partial implementations. Need to finalize Apify dataset polling logic.
- **AI Integration:** LLM responses are currently mocked in the service layer.
- **Testing:** Playwright E2E tests for the scraper pipeline are in a "test-only" state and not fully integrated into the main CI/CD flow.

## Next Priorities
1. **Full DB Integration:** Transition remaining pages (`cities`, `salaries`, `skills`) to use `jobService.ts`.
2. **Scraper Hardening:** Replace mock data in `adapter.ts` with real Apify/Playwright triggers.
3. **LLM Implementation:** Connect `aiService.ts` to OpenAI/Anthropic for real market analysis.
4. **SEO & Discovery:** Generate `sitemap.xml` and optimize meta tags for all dynamic role pages.
