# Skills Intelligence Final Audit

## 1. Extraction Logic
The system now implements a robust, deterministic skill extraction engine (`src/services/normalization.ts`) that operates during the ingestion pipeline. Instead of relying on generic tags that are often missing from scraped job boards, the engine analyzes both the `title` and the `description/snippet` text. It uses a predefined list of canonical tech keywords combined with regex-based word boundary matching to ensure high accuracy and reduce false positives (e.g., ensuring "Go" is matched as a standalone word, not as part of "Google").

## 2. Normalization Rules
A comprehensive dictionary (`SKILL_ALIASES`) maps common variations, abbreviations, and misspellings to their canonical forms.
Examples include:
- `JS`, `JAVASCRIPT` -> `JavaScript`
- `K8S`, `KUBERNETES` -> `Kubernetes`
- `AWS`, `AMAZON WEB SERVICES` -> `AWS`
- `ML`, `MACHINE LEARNING` -> `Machine Learning`

This ensures that the database groups identical technologies correctly, regardless of how the employer formatted their job description.

## 3. Most Common Detected Skills
Initial test scrapes successfully identified skills directly from job titles and snippets, including:
- Kubernetes
- Python
- Go
- AI
- Machine Learning
- TypeScript

These are stored natively in the `skills TEXT[]` array within the `jobs` table in Supabase.

## 4. Weak Datasets
The current primary limitation is the brevity of job snippets provided by certain scrapers (like the Indeed job card snippet). Snippets often contain generic HR information (e.g., "401(k), Paid time off") rather than the actual tech stack.
**Mitigation implemented:** The extraction engine also scans the job `title`, which frequently contains primary technologies (e.g., "Python/Go Developer").

## 5. Automation Flow
Skill extraction is fully automated within `processAndStoreJobs` (`src/services/jobService.ts`). Whenever a scraper (e.g., `IndeedPlaywrightScraper`) fetches a new batch of `RawJob` data, the service automatically extracts the skills and deduplicates them before upserting into the Supabase database. The database then uses materialized views (`top_skills`, `trending_roles`) to automatically update the analytics.

## 6. Homepage & Dashboard Integrations
- **Homepage (`index.astro`):** Integrated a new "Most Requested Technologies" section that displays a real-time grid of the top skills by active mention count.
- **Skills Dashboard (`skills.astro`):** Completely redesigned from a generic card layout into a data-dense intelligence dashboard. It now ranks skills by actual database count, categorizes demand levels (Moderate, High, Critical), and provides grounded market reality checks based on the live data, eliminating all hardcoded "fake" trends.

## 7. Remaining Limitations
- **Deep Text Scraping:** To achieve maximum fidelity, the scraping pipeline needs to navigate to the individual job detail pages to extract the full job description rather than relying on search page snippets.
- **Semantic Context:** Currently, the system uses keyword matching. It does not differentiate between "We use Python" and "Python is a plus but not required". Future iterations could leverage the Gemini API to perform semantic extraction on full job descriptions to determine the *weight* of a required skill.
