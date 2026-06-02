# RUNTIME_TEST_REPORT - JobMarketIndia
Date: June 2, 2026
Status: ✅ MVP VERIFIED (with Mock Data)

## 1. LOCAL RUNTIME TEST
| Test | Status | Notes |
| :--- | :--- | :--- |
| `npm install` | PASS | All dependencies installed correctly. |
| `npm run build` | PASS | Build completed in ~13s. Warnings for missing doc assets (safe). |
| `npm run dev` | PASS | Server starts on port 3000. HMR working. |
| TypeScript | PASS | No fatal TS errors during build. |

## 2. FRONTEND RENDER TEST
| Page | Status | Notes |
| :--- | :--- | :--- |
| Homepage (/) | PASS | Renders all sections. Displays real DB data. |
| Cities (/cities) | PASS | Renders list of cities from DB. |
| Roles (/roles) | PASS | Renders trending roles. |
| Salaries (/salaries) | PASS | Renders salary benchmarks. |
| Trends (/trends) | PASS | Renders growth metrics. |
| AI Insights | PASS | Renders "Weekly Market Intelligence" from DB. |
| Loading States | PASS | Handled gracefully. |

## 3. API ROUTE TESTING
| Endpoint | Status | Notes |
| :--- | :--- | :--- |
| `/api/trending-roles` | PASS | Returns valid JSON from DB. |
| `/api/top-cities` | PASS | Returns valid JSON from DB. |
| `/api/scrape` | PASS | Verified POST handler logic. |
| Caching | PASS | `Cache-Control` headers present on GET routes. |

## 4. DATABASE TESTING (Supabase)
| Component | Status | Notes |
| :--- | :--- | :--- |
| Connectivity | PASS | Successfully connects via `supabase-js`. |
| Tables/Views | PASS | `jobs`, `ai_insights`, `trending_roles` all functioning. |
| RLS Policies | FIXED | Fixed backend access using `SERVICE_ROLE_KEY`. |
| Data Storage | PASS | `upsert` on `url` prevents duplicates. |

## 5. PIPELINE TESTING
| Step | Status | Notes |
| :--- | :--- | :--- |
| Scraper Execution | PASS | Verified via `MockScraper`. |
| Normalization | PASS | Titles and Cities correctly normalized. |
| Snapshots | PASS | `capture_role_snapshots` RPC working. |
| AI Generation | PARTIAL | Insights are currently static strings stored in DB. |

## 6. RESOLVED ISSUES
- **Supabase Credentials**: Fixed environment variable detection in Astro/Vite vs Node.
- **RLS Violations**: Switched to `SERVICE_ROLE_KEY` for server-side operations (pipeline/API).
- **API 404s**: Corrected test methods (POST for scrape, GET for data).
- **Empty State**: Created `scripts/test-data.ts` to ensure system works with data.

## 7. UNRESOLVED RISKS & BLOCKERS
- **Real Scraping**: `ApifyScraper` needs polling logic to wait for real results (currently returns `[]` immediately).
- **AI Hallucination**: AI insights are currently hardcoded mocks. Needs real LLM integration.
- **Assets**: UI references some images (`/img/...`) that are missing from `public/`.
- **Environment**: Requires `SUPABASE_SERVICE_ROLE_KEY` to be set in production for the pipeline to work.

## 8. MVP READINESS
The application is **READY FOR PROTOTYPE DEMO**. 
It handles the full data lifecycle: **Scrape (Mock) -> Normalize -> Store -> Aggregate (Views) -> Serve (API) -> Render (Astro)**.

**Brutally Honest Assessment:** 
This is a high-fidelity prototype. It is NOT "enterprise ready" until real scrapers are fully polished and the AI service is connected to a live model. However, the architecture is solid and the data flow is verified end-to-end.
