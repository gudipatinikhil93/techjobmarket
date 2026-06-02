-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    normalized_title TEXT,
    company TEXT NOT NULL,
    city TEXT NOT NULL,
    salary_min NUMERIC,
    salary_max NUMERIC,
    currency TEXT DEFAULT 'INR',
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

-- Seed some normalization patterns
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
('DevOps Engineer', 'DevOps Engineer');

-- Analytics View: Trending Roles (simplified)
CREATE OR REPLACE VIEW trending_roles AS
SELECT 
    normalized_title as role,
    COUNT(*) as job_count,
    COUNT(*) FILTER (WHERE posted_at > NOW() - INTERVAL '7 days') as recent_count
FROM jobs
WHERE normalized_title IS NOT NULL
GROUP BY normalized_title
ORDER BY job_count DESC;

-- Analytics View: Top Cities
CREATE OR REPLACE VIEW top_cities AS
SELECT 
    city,
    COUNT(*) as job_count,
    AVG((salary_min + salary_max) / 2) as avg_salary
FROM jobs
GROUP BY city
ORDER BY job_count DESC;
