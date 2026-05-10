-- VeriLaunch Database Seed Data
-- Use for local development and testing ONLY.
-- Run AFTER all Flyway migrations have been applied.

-- Seed admin user (password: Admin@1234!)
INSERT INTO users (id, email, password_hash, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@verilaunch.com',
   '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', 'ROLE_ADMIN')
ON CONFLICT DO NOTHING;

-- Seed employer user (password: Employer@1234!)
INSERT INTO users (id, email, password_hash, role) VALUES
  ('00000000-0000-0000-0000-000000000002', 'employer@techcorp.com',
   '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', 'ROLE_EMPLOYER')
ON CONFLICT DO NOTHING;

INSERT INTO employers (id, user_id, company_name, industry, website) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000002',
   'TechCorp Inc.', 'Technology', 'https://techcorp.com')
ON CONFLICT DO NOTHING;

-- Seed sample candidate user (password: Candidate@1234!)
INSERT INTO users (id, email, password_hash, role) VALUES
  ('00000000-0000-0000-0000-000000000003', 'jane.doe@example.com',
   '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', 'ROLE_CANDIDATE')
ON CONFLICT DO NOTHING;

INSERT INTO candidates (id, user_id, first_name, last_name, phone, linkedin_url) VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000003',
   'Jane', 'Doe', '+15551234567', 'https://linkedin.com/in/janedoe')
ON CONFLICT DO NOTHING;

-- Seed sample job postings
INSERT INTO jobs (id, employer_id, title, description, requirements, location, employment_type, salary_min, salary_max) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0001-000000000001',
   'Senior Software Engineer',
   'Build scalable distributed systems using Java 21 and Spring Boot.',
   'Java, Spring Boot, PostgreSQL, AWS, Docker',
   'New York, NY', 'Full-Time', 160000, 200000),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0001-000000000001',
   'Staff Platform Engineer',
   'Lead platform infrastructure improvements across AWS cloud environments.',
   'AWS, Terraform, Kubernetes, Go, Java',
   'Remote', 'Full-Time', 180000, 240000)
ON CONFLICT DO NOTHING;
