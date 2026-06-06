-- Add region column to jobs
ALTER TABLE jobs ADD COLUMN region TEXT DEFAULT 'us';
CREATE INDEX idx_jobs_region ON jobs(region);

-- Add region column to salary_benchmarks
ALTER TABLE salary_benchmarks ADD COLUMN region TEXT DEFAULT 'us';
ALTER TABLE salary_benchmarks DROP CONSTRAINT IF EXISTS salary_benchmarks_role_key;
ALTER TABLE salary_benchmarks ADD CONSTRAINT salary_benchmarks_role_region_key UNIQUE (role, region);

-- Add region column to role_snapshots
ALTER TABLE role_snapshots ADD COLUMN region TEXT DEFAULT 'us';
CREATE INDEX idx_role_snapshots_region ON role_snapshots(region);

-- Add region column to city_snapshots
ALTER TABLE city_snapshots ADD COLUMN region TEXT DEFAULT 'us';
CREATE INDEX idx_city_snapshots_region ON city_snapshots(region);

-- Add region column to ai_insights
ALTER TABLE ai_insights ADD COLUMN region TEXT DEFAULT 'us';
CREATE INDEX idx_ai_insights_region ON ai_insights(region);

-- Add region column to layoffs
ALTER TABLE layoffs ADD COLUMN region TEXT DEFAULT 'us';
CREATE INDEX idx_layoffs_region ON layoffs(region);

-- Update trending_roles view to be region-aware
DROP VIEW IF EXISTS trending_roles;
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

-- Update top_cities view
DROP VIEW IF EXISTS top_cities;
CREATE OR REPLACE VIEW top_cities AS
SELECT 
    city,
    region,
    COUNT(*) as job_count,
    ROUND(AVG((salary_min + salary_max) / 2), 0) as avg_salary
FROM jobs
GROUP BY city, region;

-- Update top_skills view
DROP VIEW IF EXISTS top_skills;
CREATE OR REPLACE VIEW top_skills AS
SELECT 
    skill,
    region,
    COUNT(*) as job_count
FROM (
    SELECT unnest(skills) as skill, region FROM jobs
) t
GROUP BY skill, region;

-- Update role_intelligence view
DROP VIEW IF EXISTS role_intelligence;
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

-- Update snapshot functions
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

-- Update skill growth function
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
