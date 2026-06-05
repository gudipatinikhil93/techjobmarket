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

## Project Structure

*   `src/` - Application source code (Astro, components, styles)
*   `public/` - Static assets
*   `scripts/` - Data pipeline, scraping, and maintenance scripts
*   `docs/` - Project documentation and internal audits
*   `.github/` - GitHub Actions for automated data updates

## Documentation

Comprehensive documentation is available in the `docs/` directory:

*   [DESIGN.md](./DESIGN.md) - Visual identity and design system
*   [SETUP.md](./SETUP.md) - Detailed local development setup
*   [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current feature roadmap and status
*   `docs/internal/` - Internal architecture audits and development logs

## Getting Started

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-repo/techjobmarket.git
    cd techjobmarket
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file based on `.env.example` and fill in your Supabase and API credentials.

4.  **Launch Development Server:**
    ```bash
    npm run dev
    ```

5.  **Initialize Data (Optional):**
    ```bash
    npx tsx scripts/seed-us-data.ts
    npm run pipeline:update
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
