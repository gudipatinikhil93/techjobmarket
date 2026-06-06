-- 01_multi_region.sql: Idempotent migration for multi-region support

-- 1. Jobs Table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'us';
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_region') THEN
        CREATE INDEX idx_jobs_region ON jobs(region);
    END IF;
END $$;

-- 2. Salary Benchmarks (Handling transition from VIEW to TABLE)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'salary_benchmarks') THEN
        DROP VIEW IF EXISTS salary_benchmarks CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS salary_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    avg_min NUMERIC NOT NULL,
    avg_max NUMERIC NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    region TEXT DEFAULT 'us'
);

-- Ensure UNIQUE constraint on role and region
ALTER TABLE salary_benchmarks DROP CONSTRAINT IF EXISTS salary_benchmarks_role_key;
ALTER TABLE salary_benchmarks DROP CONSTRAINT IF EXISTS salary_benchmarks_role_region_key;
ALTER TABLE salary_benchmarks ADD CONSTRAINT salary_benchmarks_role_region_key UNIQUE (role, region);

-- Seed initial US data if empty
INSERT INTO salary_benchmarks (role, avg_min, avg_max, region)
SELECT role, avg_min, avg_max, 'us'
FROM (VALUES 
    ('Software Engineer', 110000, 165000),
    ('Backend Developer', 120000, 180000),
    ('Frontend Developer', 115000, 170000),
    ('Full Stack Developer', 120000, 185000),
    ('AI Engineer', 150000, 250000),
    ('Data Scientist', 130000, 190000),
    ('Product Manager', 125000, 180000),
    ('Cloud Security', 140000, 210000),
    ('DevOps Engineer', 135000, 200000),
    ('Site Reliability Engineer', 140000, 210000)
) AS v(role, avg_min, avg_max)
WHERE NOT EXISTS (SELECT 1 FROM salary_benchmarks WHERE region = 'us');

-- 3. Snapshots & Insights
ALTER TABLE role_snapshots ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'us';
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_role_snapshots_region') THEN CREATE INDEX idx_role_snapshots_region ON role_snapshots(region); END IF; END $$;

ALTER TABLE city_snapshots ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'us';
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_city_snapshots_region') THEN CREATE INDEX idx_city_snapshots_region ON city_snapshots(region); END IF; END $$;

ALTER TABLE ai_insights ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'us';
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ai_insights_region') THEN CREATE INDEX idx_ai_insights_region ON ai_insights(region); END IF; END $$;

ALTER TABLE layoffs ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'us';
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_layoffs_region') THEN CREATE INDEX idx_layoffs_region ON layoffs(region); END IF; END $$;

-- 4. Views (Always use CREATE OR REPLACE)
DROP VIEW IF EXISTS trending_roles CASCADE;
CREATE OR REPLACE VIEW trending_roles AS
WITH current_period AS (
    SELECT 
        normalized_title as role,
        region,
        COUNT(*) as current_count
    FROM jobs
    WHERE normalized_title IS NOT NULL 
      AND posted_at > NOW() - INTERVAL '7 days'
    GROUP BY normalized_title, region
),
previous_period AS (
    SELECT 
        normalized_title as role,
        region,
        COUNT(*) as previous_count
    FROM jobs
    WHERE normalized_title IS NOT NULL 
      AND posted_at <= NOW() - INTERVAL '7 days' 
      AND posted_at > NOW() - INTERVAL '14 days'
    GROUP BY normalized_title, region
)
SELECT 
    COALESCE(c.role, p.role) as role,
    COALESCE(c.region, p.region) as region,
    COALESCE(c.current_count, 0) as job_count,
    CASE 
        WHEN COALESCE(p.previous_count, 0) = 0 THEN 100 
        ELSE ROUND(((c.current_count::numeric - p.previous_count::numeric) / p.previous_count::numeric) * 100, 2)
    END as growth_percentage
FROM current_period c
FULL OUTER JOIN previous_period p ON c.role = p.role AND c.region = p.region;

DROP VIEW IF EXISTS top_cities CASCADE;
CREATE OR REPLACE VIEW top_cities AS
SELECT 
    city,
    region,
    COUNT(*) as job_count,
    ROUND(AVG((salary_min + salary_max) / 2), 0) as avg_salary
FROM jobs
GROUP BY city, region;

DROP VIEW IF EXISTS top_skills CASCADE;
CREATE OR REPLACE VIEW top_skills AS
SELECT 
    skill,
    region,
    COUNT(*) as job_count
FROM (
    SELECT unnest(skills) as skill, region FROM jobs
) t
GROUP BY skill, region;

DROP VIEW IF EXISTS role_intelligence CASCADE;
CREATE OR REPLACE VIEW role_intelligence AS
WITH role_stats AS (
    SELECT 
        role,
        region,
        job_count,
        growth_percentage,
        CASE 
            WHEN growth_percentage > 20 THEN 'Growing'
            WHEN growth_percentage < -20 THEN 'Declining'
            WHEN job_count > 500 AND growth_percentage BETWEEN -10 AND 10 THEN 'Oversaturated'
            ELSE 'Stable'
        END as status
    FROM trending_roles
)
SELECT 
    rs.*,
    sb.avg_min as market_avg_min,
    sb.avg_max as market_avg_max,
    (SELECT ARRAY_AGG(DISTINCT city) FROM (SELECT city FROM jobs WHERE normalized_title = rs.role AND region = rs.region GROUP BY city ORDER BY COUNT(*) DESC LIMIT 3) t) as top_cities,
    (SELECT ARRAY_AGG(DISTINCT s) FROM (SELECT unnest(skills) as s FROM jobs WHERE normalized_title = rs.role AND region = rs.region GROUP BY s ORDER BY COUNT(*) DESC LIMIT 5) t) as key_skills
FROM role_stats rs
LEFT JOIN salary_benchmarks sb ON rs.role = sb.role AND rs.region = sb.region;

-- 5. Functions
CREATE OR REPLACE FUNCTION capture_role_snapshots(p_region TEXT DEFAULT 'us') 
RETURNS void AS $$
BEGIN
    INSERT INTO role_snapshots (role, region, job_count, avg_salary_min, avg_salary_max)
    SELECT 
        normalized_title,
        region,
        COUNT(*),
        AVG(salary_min),
        AVG(salary_max)
    FROM jobs
    WHERE normalized_title IS NOT NULL AND region = p_region
    GROUP BY normalized_title, region;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION capture_city_snapshots(p_region TEXT DEFAULT 'us') 
RETURNS void AS $$
BEGIN
    INSERT INTO city_snapshots (city, region, job_count, avg_salary)
    SELECT 
        city,
        region,
        COUNT(*),
        AVG((salary_min + salary_max) / 2)
    FROM jobs
    WHERE region = p_region
    GROUP BY city, region;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS get_skill_growth();
CREATE OR REPLACE FUNCTION get_skill_growth(p_region TEXT DEFAULT 'us')
RETURNS TABLE (skill TEXT, growth_percentage NUMERIC) AS $$
BEGIN
    RETURN QUERY
    WITH current_period AS (
        SELECT unnest(skills) as s, COUNT(*) as c
        FROM jobs
        WHERE posted_at > NOW() - INTERVAL '7 days' AND region = p_region
        GROUP BY s
    ),
    previous_period AS (
        SELECT unnest(skills) as s, COUNT(*) as c
        FROM jobs
        WHERE posted_at <= NOW() - INTERVAL '7 days' AND posted_at > NOW() - INTERVAL '14 days' AND region = p_region
        GROUP BY s
    )
    SELECT 
        COALESCE(curr.s, prev.s) as skill,
        CASE 
            WHEN COALESCE(prev.c, 0) = 0 THEN 100::numeric
            ELSE ROUND(((curr.c::numeric - prev.c::numeric) / prev.c::numeric) * 100, 2)
        END as growth_percentage
    FROM current_period curr
    FULL OUTER JOIN previous_period prev ON curr.s = prev.s;
END;
$$ LANGUAGE plpgsql;
