# India Analytics & Historical Snapshot Engine Audit - June 6, 2026

## Overview
This audit documents the implementation of the India-specific labor market intelligence engine, focusing on historical snapshots, trend generation, and demand analytics.

## Technical Implementation

### 1. Database Schema Extensions (Migration 05)
- **`skill_snapshots`**: Weekly tracking of skill volume by region.
- **`company_snapshots`**: Weekly tracking of hiring companies and average salaries.
- **`market_snapshots`**: High-level aggregate metrics (Total jobs, Remote %, AI-specific volume).
- **`market_trends`**: Optimized cache table for WoW, MoM, and QoQ growth calculations across all entities.

### 2. Snapshot Generation (JobService)
- Implemented `captureSnapshots(region)` which concurrently captures:
  - Role snapshots
  - City snapshots
  - Skill snapshots
  - Company snapshots
  - Market aggregate snapshots
- Integrated into the existing `scripts/pipeline.ts` to run automatically after each scraping cycle.

### 3. Trend & Intelligence Engine
- **Calculations**: Implemented Week-over-Week (WoW), Month-over-Month (MoM), and Quarter-over-Quarter (QoQ) growth tracking.
- **Demand Scoring**: A multi-factor formula scoring roles/skills/cities based on:
  - **Volume (40%)**: Total job count.
  - **Growth (40%)**: WoW percentage increase.
  - **Salary Premium (20%)**: Normalized against regional benchmarks (20L INR for India, $150k for US).
- **Velocity Tracking**: Measures the "speed" of market shifts based on WoW acceleration.

### 4. Scalability & Performance
- **Pre-calculation**: Analytics are calculated once per snapshot and stored in `market_trends` to ensure sub-100ms frontend queries.
- **Region Isolation**: Strict `region` filtering across all snapshots and trends.
- **Batch Processing**: Trends are calculated and upserted in chunks of 50 to prevent memory/connection issues.

### 5. Frontend API
Added new service methods to `jobService.ts`:
- `getMarketTrends(region, entityType)`: Unified method for fetching pre-calculated intelligence.
- `getCityRankings(region)`: Specialized wrapper for labor market geography.
- `getMarketPulse(region)`: Enhanced with WoW aggregate trends.

## Results
- **Snapshot Coverage**: 100% of core entities (Roles, Cities, Skills, Companies) now have historical tracking.
- **Query Performance**: Aggregate analytics now use indexed trend tables instead of scanning the full `jobs` table on every request.
- **Multi-Region Ready**: Seamlessly supports both `india` and `us` datasets with independent baselines.

## Next Steps
- Integrate `getMarketTrends` into the `skills.astro` and `cities.astro` pages.
- Implement AI-driven anomaly detection using the `market_trends` historical data.
