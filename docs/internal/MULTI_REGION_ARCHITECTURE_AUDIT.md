# TechJobMarket — Multi-Region Architecture Audit

**Status:** Completed
**Date:** June 6, 2026
**Type:** Foundational Refactor

## Executive Summary
The TechJobMarket platform has successfully transitioned from a US-only platform to a scalable **Multi-Region Architecture**. This refactor allows the platform to serve independent tech labor market intelligence for `/us` and `/india` using a shared infrastructure, component library, and data processing system.

## 1. Regional Configuration System
A centralized configuration system was implemented to manage regional differences without code duplication.

*   **Location:** `src/regions/`
*   **Key Files:**
    *   `types.ts`: Strongly typed `RegionConfig` interface.
    *   `us/config.ts`: US-specific metadata (Currency: USD, Hubs: SF, NYC, etc.).
    *   `india/config.ts`: India-specific metadata (Currency: INR/LPA, Hubs: Bangalore, Hyderabad, etc.).
    *   `index.ts`: Central registry and resolution logic (`getRegion`, `getRegionConfig`).

## 2. Dynamic Routing & Directory Refactor
The Astro routing structure was overhauled to support scalable regional subdirectories.

*   **Structure:** Migrated from `src/pages/*.astro` to `src/pages/[region]/*.astro`.
*   **Root Strategy:** `src/pages/index.astro` now acts as a redirect handler, sending users to their preferred region or `/us` by default.
*   **Link Preservation:** All internal links in components (Navbar, Footer, Cards) were updated to use the `/${region}` prefix, ensuring users stay within their selected regional context.

## 3. Database & Data Layer Evolution
The database schema and services were refactored to support multi-tenant regional data.

*   **Migration:** `src/db/migrations/01_multi_region.sql` added a `region` column to `jobs`, `salaries`, `layoffs`, `snapshots`, and `insights`.
*   **Views & RPCs:** Updated `trending_roles`, `top_cities`, and `top_skills` views to filter by region. Refactored snapshot functions to accept `p_region`.
*   **Services:**
    *   `jobService.ts`: All data fetching and storage functions now accept a `region` parameter.
    *   `normalization.ts`: `normalizeCity` now supports India-specific hubs and regional fallbacks.
    *   `aiService.ts`: Gemini intelligence generation is now region-scoped.
    *   `layoffService.ts`: Supports regional filtering for corporate restructuring tracking.

## 4. Component Refactoring
Shared UI components were made "Region-Aware."

*   **Layout.astro**: Dynamically handles SEO metadata, canonical URLs, and JSON-LD schema based on the active region.
*   **Navbar.astro**: Prefixes all navigation links and displays a regional identifier (US/INDIA).
*   **Footer.astro**: Localizes platform descriptions and regional links.
*   **Formatters**: Implemented dynamic currency formatting (e.g., `$150k` for US vs `₹25.0L` for India).

## 5. SEO & Site Architecture
*   **Sitemap Generation**: `sitemap.xml.ts` now programmatically iterates through all registered regions to generate a comprehensive index of static and dynamic (role) pages.
*   **Metadata**: Titles and descriptions are dynamically generated using `regionConfig`, e.g., "India Tech Salary Trends 2026."
*   **Persistence**: `middleware.ts` implements a `preferred_region` cookie to remember user choices and handle root redirects efficiently at the edge.

## 6. Pipeline & Ingestion
*   **scripts/pipeline.ts**: Refactored to accept a region argument (`npm run pipeline -- india`). This allows the intelligence pipeline to run targeted updates for specific markets while using the same scraping and analysis logic.

## 7. Performance Maintenance
*   **Zero-Hydration Priority**: Maintained Astro's server-first approach. Regional logic is resolved at build/request time, ensuring no JS overhead for region switching.
*   **CSS Stability**: Preserved the cinematic atmospheric theme across all regions with no regressions in CLS or TBT.

---
**Verdict:** The platform is now fully prepared for global expansion. Adding a new region (e.g., `uk` or `germany`) now requires only a single configuration file and a pipeline run.
