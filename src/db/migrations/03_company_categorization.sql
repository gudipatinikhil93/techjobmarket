-- Add company_category to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_category TEXT DEFAULT 'Product';
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_company_category') THEN CREATE INDEX idx_jobs_company_category ON jobs(company_category); END IF; END $$;
