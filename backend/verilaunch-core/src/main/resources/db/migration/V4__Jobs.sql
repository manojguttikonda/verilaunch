ALTER TABLE jobs
ADD COLUMN requirements TEXT,
ADD COLUMN employment_type VARCHAR(50),
ADD COLUMN salary_min NUMERIC(12,2),
ADD COLUMN salary_max NUMERIC(12,2);

CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_title ON jobs USING gin(to_tsvector('english', title));
