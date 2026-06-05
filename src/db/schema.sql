-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    normalized_title TEXT,
    company TEXT NOT NULL,
    city TEXT NOT NULL,
    salary_min NUMERIC,
    salary_max NUMERIC,
    currency TEXT DEFAULT 'USD',
    skills TEXT[] DEFAULT '{}',
    source TEXT NOT NULL,
    posted_at TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    url TEXT UNIQUE,
    description TEXT,
    original_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_jobs_city ON jobs(city);
CREATE INDEX idx_jobs_normalized_title ON jobs(normalized_title);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX idx_jobs_company ON jobs(company);

-- Title Normalization Table
CREATE TABLE title_mappings (
    original_pattern TEXT PRIMARY KEY,
    normalized_title TEXT NOT NULL
);

-- Salary Benchmarks Table (US Market)
CREATE TABLE salary_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT UNIQUE NOT NULL,
    avg_min NUMERIC NOT NULL,
    avg_max NUMERIC NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Snapshot Tables for Historical Tracking
CREATE TABLE role_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    job_count INTEGER NOT NULL,
    avg_salary_min NUMERIC,
    avg_salary_max NUMERIC,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE city_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT NOT NULL,
    job_count INTEGER NOT NULL,
    avg_salary NUMERIC,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Insights Table
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type TEXT NOT NULL, -- 'weekly_summary', 'role_deep_dive', etc.
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed normalization patterns for US Tech Roles
INSERT INTO title_mappings (original_pattern, normalized_title) VALUES
('SDE', 'Software Engineer'),
('Software Engineer', 'Software Engineer'),
('Backend Developer', 'Backend Developer'),
('Frontend Developer', 'Frontend Developer'),
('Full Stack Developer', 'Full Stack Developer'),
('AI Engineer', 'AI Engineer'),
('Data Scientist', 'Data Scientist'),
('Product Manager', 'Product Manager'),
('Cloud Security', 'Cloud Security'),
('DevOps Engineer', 'DevOps Engineer'),
('Platform Engineer', 'Platform Engineer'),
('SRE', 'Site Reliability Engineer');

-- Seed Salary Benchmarks (Initial US Estimates)
INSERT INTO salary_benchmarks (role, avg_min, avg_max) VALUES
('Software Engineer', 110000, 165000),
('Backend Developer', 120000, 180000),
('Frontend Developer', 115000, 170000),
('Full Stack Developer', 120000, 185000),
('AI Engineer', 150000, 250000),
('Data Scientist', 130000, 190000),
('Product Manager', 125000, 180000),
('Cloud Security', 140000, 210000),
('DevOps Engineer', 135000, 200000),
('Site Reliability Engineer', 140000, 210000);

-- Analytics View: Trending Roles with Real Growth
-- This view compares the last 7 days vs the 7 days before that
CREATE OR REPLACE VIEW trending_roles AS
WITH current_period AS (
    SELECT 
        normalized_title as role,
        COUNT(*) as current_count
    FROM jobs
    WHERE normalized_title IS NOT NULL 
      AND posted_at > NOW() - INTERVAL '7 days'
    GROUP BY normalized_title
),
previous_period AS (
    SELECT 
        normalized_title as role,
        COUNT(*) as previous_count
    FROM jobs
    WHERE normalized_title IS NOT NULL 
      AND posted_at <= NOW() - INTERVAL '7 days' 
      AND posted_at > NOW() - INTERVAL '14 days'
    GROUP BY normalized_title
)
SELECT 
    COALESCE(c.role, p.role) as role,
    COALESCE(c.current_count, 0) as job_count,
    CASE 
        WHEN COALESCE(p.previous_count, 0) = 0 THEN 100 -- Default to 100% if no previous data
        ELSE ROUND(((c.current_count::numeric - p.previous_count::numeric) / p.previous_count::numeric) * 100, 2)
    END as growth_percentage
FROM current_period c
FULL OUTER JOIN previous_period p ON c.role = p.role
ORDER BY job_count DESC;

-- Analytics View: Top Cities
CREATE OR REPLACE VIEW top_cities AS
SELECT 
    city,
    COUNT(*) as job_count,
    ROUND(AVG((salary_min + salary_max) / 2), 0) as avg_salary
FROM jobs
GROUP BY city
ORDER BY job_count DESC;

-- Snapshot Capture Functions
CREATE OR REPLACE FUNCTION capture_role_snapshots() 
RETURNS void AS $$
BEGIN
    INSERT INTO role_snapshots (role, job_count, avg_salary_min, avg_salary_max)
    SELECT 
        normalized_title,
        COUNT(*),
        AVG(salary_min),
        AVG(salary_max)
    FROM jobs
    WHERE normalized_title IS NOT NULL
    GROUP BY normalized_title;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION capture_city_snapshots() 
RETURNS void AS $$
BEGIN
    INSERT INTO city_snapshots (city, job_count, avg_salary)
    SELECT 
        city,
        COUNT(*),
        AVG((salary_min + salary_max) / 2)
    FROM jobs
    GROUP BY city;
END;
$$ LANGUAGE plpgsql;

-- Analytics View: Skills
CREATE OR REPLACE VIEW top_skills AS
SELECT 
    unnest(skills) as skill,
    COUNT(*) as job_count
FROM jobs
GROUP BY skill
ORDER BY job_count DESC;

-- Analytics View: Role Classification
-- Classifies roles as Growing, Stable, Declining, or Oversaturated
CREATE OR REPLACE VIEW role_intelligence AS
WITH role_stats AS (
    SELECT 
        role,
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
    (SELECT ARRAY_AGG(DISTINCT city) FROM (SELECT city FROM jobs WHERE normalized_title = rs.role GROUP BY city ORDER BY COUNT(*) DESC LIMIT 3) t) as top_cities,
    (SELECT ARRAY_AGG(DISTINCT s) FROM (SELECT unnest(skills) as s FROM jobs WHERE normalized_title = rs.role GROUP BY s ORDER BY COUNT(*) DESC LIMIT 5) t) as key_skills
FROM role_stats rs
LEFT JOIN salary_benchmarks sb ON rs.role = sb.role;

CREATE OR REPLACE FUNCTION get_skill_growth()
RETURNS TABLE (skill TEXT, growth_percentage NUMERIC) AS $$
BEGIN
    RETURN QUERY
    WITH current_period AS (
        SELECT unnest(skills) as s, COUNT(*) as c
        FROM jobs
        WHERE posted_at > NOW() - INTERVAL '7 days'
        GROUP BY s
    ),
    previous_period AS (
        SELECT unnest(skills) as s, COUNT(*) as c
        FROM jobs
        WHERE posted_at <= NOW() - INTERVAL '7 days' AND posted_at > NOW() - INTERVAL '14 days'
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

-- Layoffs Table
CREATE TABLE layoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    layoffs_count INTEGER,
    percentage_affected NUMERIC,
    date DATE NOT NULL,
    sector TEXT,
    reason TEXT,
    source_url TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for layoffs table
CREATE INDEX idx_layoffs_company ON layoffs(company);
CREATE INDEX idx_layoffs_date ON layoffs(date);
CREATE INDEX idx_layoffs_sector ON layoffs(sector);
