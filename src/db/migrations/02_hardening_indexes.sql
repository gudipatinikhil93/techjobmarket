-- Compound indexes for region-scoped queries
CREATE INDEX IF NOT EXISTS idx_jobs_region_created_at ON jobs(region, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_region_normalized_title ON jobs(region, normalized_title);
CREATE INDEX IF NOT EXISTS idx_jobs_region_city ON jobs(region, city);
CREATE INDEX IF NOT EXISTS idx_salary_benchmarks_region_role ON salary_benchmarks(region, role);
CREATE INDEX IF NOT EXISTS idx_role_snapshots_region_role ON role_snapshots(region, role);
CREATE INDEX IF NOT EXISTS idx_city_snapshots_region_city ON city_snapshots(region, city);
CREATE INDEX IF NOT EXISTS idx_ai_insights_region_type ON ai_insights(region, insight_type);
CREATE INDEX IF NOT EXISTS idx_layoffs_region_date ON layoffs(region, date);
