# India Market Ingestion Foundation Audit

## Overview
Successfully implemented the foundation for India job market ingestion, ensuring strict region isolation and robust normalization for localized data.

## Key Components

### 1. Ingestion Adapters
- **IndiaIndeedScraper** (`src/scraper/indiaIndeed.ts`): Targets `in.indeed.com` with localized queries for major tech hubs.
- **IndiaWellfoundScraper** (`src/scraper/indiaWellfound.ts`): Targets Indian startups and software roles on Wellfound.

### 2. Normalization Logic (`src/services/normalization.ts`)
- **City Normalization**: Comprehensive mapping for Indian hubs (Bangalore/Bengaluru, Gurgaon/Delhi NCR, etc.).
- **Salary Normalization**: 
  - Handles **LPA** (Lakhs Per Annum) with range support.
  - Handles **Monthly** stipends/salaries and converts to annual.
  - Detects and prevents cross-region contamination (e.g., US jobs in India pipeline).
- **Role Taxonomy**: Support for Indian-specific titles like SDE 1/2/3 and Graduate Engineer Trainees.
- **Company Categorization**: New logic to classify companies into:
  - **Startup**: High-growth Indian tech firms.
  - **Product**: Established product-based companies.
  - **Service**: Major Indian IT services firms (TCS, Infosys, etc.).
  - **GCC**: Global Capability Centers (Google, Microsoft, etc.).

### 3. Database & Storage
- **Schema Migration**: Added `company_category` and `currency` columns to the `jobs` table.
- **Seeding**: Added initial salary benchmarks for the India region to bootstrap analytics.
- **Region Isolation**: All ingestion processes now enforce a `region` filter to prevent data bleed.

### 4. Pipeline Integration
- Updated `scripts/pipeline.ts` to dynamically switch between US and India adapters based on the command-line argument (`npm run pipeline india`).

## Verification Results
- Normalization utilities verified with test cases for LPA and monthly salaries.
- Pipeline structure validated for region-specific adapter selection.
- Database schema updated and indexed for performance.

## Next Steps
- Implement AI-driven skills normalization for deeper India-specific tech stack analysis.
- Expand India job sources to include LinkedIn and Naukri.
