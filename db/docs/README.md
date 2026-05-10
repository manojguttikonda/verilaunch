# VeriLaunch Database Service

This directory is the centralized **database service layer** for the VeriLaunch platform.
It provides schema references, seed data, and migration documentation for all database consumers.

## Structure

```
db/
├── schema/
│   └── full_schema_reference.sql  # Complete annotated schema for documentation + tooling
├── seeds/
│   └── dev_seed.sql               # Development seed data (DO NOT use in production)
└── docs/
    └── README.md                  # This file
```

## How Migrations Work

VeriLaunch uses **Flyway** for database migrations, managed by the backend service.

| File | Location |
|------|----------|
| Flyway migration source | `backend/verilaunch-core/src/main/resources/db/migration/` |
| Schema reference (docs) | `db/schema/full_schema_reference.sql` |
| Seed data | `db/seeds/dev_seed.sql` |

### Migration Files (Flyway)

| Version | Description |
|---------|-------------|
| V1 | Core identity schema (users, candidates, employers, audit_logs) |
| V2 | AI Resume service tables (resume_versions, resume_tailoring) |
| V3 | Verification & OCR tables (verification_records, consent_records) |
| V4 | Job marketplace tables (jobs) |
| V5 | Application tracking tables (applications) |
| V6 | Compliance & policy tables (compliance_policies, policy_evaluations) |

## Local Setup

```bash
# Start PostgreSQL via Docker Compose (from repo root)
docker-compose up -d postgres

# Apply seeds (dev only)
psql -h localhost -U vladmin -d verilaunch -f db/seeds/dev_seed.sql
```

## Backup & Retention

- Automated backups: 7-day retention on AWS RDS (configured in `infrastructure/rds.tf`)
- Point-in-time recovery: Enabled on staging and production
- Retention-aware deletion: Soft-delete pattern recommended for compliance-sensitive tables

## Credentials

Never commit real credentials. Use environment variables or AWS Secrets Manager.

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL hostname |
| `DB_PORT` | PostgreSQL port (default: 5432) |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password (from Secrets Manager in AWS) |
