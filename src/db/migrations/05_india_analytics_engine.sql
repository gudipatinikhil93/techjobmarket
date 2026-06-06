-- India Analytics & Historical Snapshot Engine

-- 1. Skill Snapshots
CREATE TABLE IF NOT EXISTS skill_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill TEXT NOT NULL,
    region TEXT NOT NULL,
    job_count INTEGER NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
DO $$ BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_skill_snapshots_skill') THEN CREATE INDEX idx_skill_snapshots_skill ON skill_snapshots(skill); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_skill_snapshots_region') THEN CREATE INDEX idx_skill_snapshots_region ON skill_snapshots(region); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_skill_snapshots_captured_at') THEN CREATE INDEX idx_skill_snapshots_captured_at ON skill_snapshots(captured_at); END IF;
END $$;

-- 2. Company Snapshots
CREATE TABLE IF NOT EXISTS company_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    region TEXT NOT NULL,
    job_count INTEGER NOT NULL,
    avg_salary NUMERIC,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
DO $$ BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_company_snapshots_company') THEN CREATE INDEX idx_company_snapshots_company ON company_snapshots(company); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_company_snapshots_region') THEN CREATE INDEX idx_company_snapshots_region ON company_snapshots(region); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_company_snapshots_captured_at') THEN CREATE INDEX idx_company_snapshots_captured_at ON company_snapshots(captured_at); END IF;
END $$;

-- 3. Market Snapshots
CREATE TABLE IF NOT EXISTS market_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region TEXT NOT NULL,
    total_jobs INTEGER NOT NULL,
    avg_salary NUMERIC,
    remote_jobs INTEGER,
    ai_jobs INTEGER,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
DO $$ BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_market_snapshots_region') THEN CREATE INDEX idx_market_snapshots_region ON market_snapshots(region); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_market_snapshots_captured_at') THEN CREATE INDEX idx_market_snapshots_captured_at ON market_snapshots(captured_at); END IF;
END $$;

-- 4. Trend Tables
CREATE TABLE IF NOT EXISTS market_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'role', 'city', 'skill', 'company', 'market'
    entity_name TEXT,          -- name of the role, city, etc. (NULL for 'market')
    region TEXT NOT NULL,
    wow_growth NUMERIC,        -- Week over Week
    mom_growth NUMERIC,        -- Month over Month
    qoq_growth NUMERIC,        -- Quarter over Quarter
    demand_score NUMERIC,      -- Calculated score (0-100)
    velocity_score NUMERIC,    -- Growth speed (0-100)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_type, entity_name, region)
);

-- 5. Updated Snapshot Capture Functions
CREATE OR REPLACE FUNCTION capture_skill_snapshots(p_region TEXT DEFAULT 'india') 
RETURNS void AS $$
BEGIN
    INSERT INTO skill_snapshots (skill, region, job_count)
    SELECT 
        unnest(skills) as skill,
        region,
        COUNT(*)
    FROM jobs
    WHERE region = p_region
    GROUP BY skill, region;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION capture_company_snapshots(p_region TEXT DEFAULT 'india') 
RETURNS void AS $$
BEGIN
    INSERT INTO company_snapshots (company, region, job_count, avg_salary)
    SELECT 
        company,
        region,
        COUNT(*),
        AVG((salary_min + salary_max) / 2)
    FROM jobs
    WHERE region = p_region
    GROUP BY company, region;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION capture_market_snapshots(p_region TEXT DEFAULT 'india') 
RETURNS void AS $$
DECLARE
    v_total_jobs INTEGER;
    v_avg_salary NUMERIC;
    v_remote_jobs INTEGER;
    v_ai_jobs INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_total_jobs FROM jobs WHERE region = p_region;
    
    SELECT AVG((salary_min + salary_max) / 2) INTO v_avg_salary 
    FROM jobs WHERE region = p_region AND salary_min IS NOT NULL;
    
    SELECT COUNT(*) INTO v_remote_jobs 
    FROM jobs WHERE region = p_region AND (city ILIKE '%Remote%' OR description ILIKE '%Remote%');
    
    SELECT COUNT(*) INTO v_ai_jobs 
    FROM jobs WHERE region = p_region AND (normalized_title ILIKE '%AI%' OR normalized_title ILIKE '%Machine Learning%' OR skills @> ARRAY['AI', 'Machine Learning', 'LLM', 'GPT']);

    INSERT INTO market_snapshots (region, total_jobs, avg_salary, remote_jobs, ai_jobs)
    VALUES (p_region, v_total_jobs, v_avg_salary, v_remote_jobs, v_ai_jobs);
END;
$$ LANGUAGE plpgsql;

-- 6. Demand Scoring Utility
CREATE OR REPLACE FUNCTION calculate_demand_score(
    p_job_count INTEGER,
    p_growth_pct NUMERIC,
    p_avg_salary NUMERIC,
    p_region TEXT
) RETURNS NUMERIC AS $$
DECLARE
    v_score NUMERIC;
    v_salary_weight NUMERIC;
BEGIN
    IF p_region = 'india' THEN
        v_salary_weight := LEAST(1.0, p_avg_salary / 2000000);
    ELSE
        v_salary_weight := LEAST(1.0, p_avg_salary / 150000);
    END IF;

    v_score := (LEAST(1.0, p_job_count::numeric / 500) * 40) + 
               (LEAST(1.0, GREATEST(0, p_growth_pct + 50) / 100) * 40) + 
               (v_salary_weight * 20);
    
    RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;
