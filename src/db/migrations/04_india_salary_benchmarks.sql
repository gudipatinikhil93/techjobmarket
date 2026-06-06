-- Seed Salary Benchmarks for India Market (in INR)
-- Values are representative averages for mid-level roles (3-5 years)
INSERT INTO salary_benchmarks (role, region, avg_min, avg_max)
SELECT role, region, avg_min, avg_max
FROM (VALUES 
    ('Software Engineer', 'india', 1200000, 2200000),
    ('Backend Developer', 'india', 1400000, 2500000),
    ('Frontend Developer', 'india', 1100000, 2000000),
    ('Full Stack Developer', 'india', 1500000, 2800000),
    ('AI/ML Engineer', 'india', 1800000, 3500000),
    ('Data Scientist', 'india', 1500000, 2800000),
    ('Product Manager', 'india', 1800000, 3200000),
    ('DevOps Engineer', 'india', 1400000, 2400000),
    ('QA Engineer', 'india', 800000, 1500000),
    ('Engineering Manager', 'india', 3500000, 6000000)
) AS v(role, region, avg_min, avg_max)
WHERE NOT EXISTS (SELECT 1 FROM salary_benchmarks WHERE region = 'india');
