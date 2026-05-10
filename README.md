# VeriLaunch — Enterprise AI Job Marketplace

> An enterprise-grade AI job marketplace for laid-off and transitioning professionals.
> Built with Java 21, Spring Boot 3, React, PostgreSQL, Terraform on AWS.

---

## Repository Structure

```
VeriLaunch/                          ← Monorepo root
│
├── frontend/                        ← 🖥️  Frontend service (React 18 + Vite + TypeScript)
│   ├── src/
│   │   ├── pages/                   #  auth/ | jobs/ | resume/ | verification/ | applications/ | employer/ | onboarding/
│   │   ├── components/ui/           #  Button, Input, Card
│   │   ├── layouts/DashboardLayout  #  Authenticated shell with sidebar navigation
│   │   └── App.tsx                  #  React Router configuration
│   ├── index.html
│   └── package.json
│
├── backend/verilaunch-core/         ← ☕  Backend service (Java 21, Spring Boot 3, Maven)
│   ├── src/main/java/com/verilaunch/
│   │   ├── controller/              #  AuthController | ResumeController | JobController | ApplicationController | VerificationController
│   │   ├── service/                 #  ResumeService | JobService | ApplicationService | VerificationService | PolicyService | AuditLogService | IntegrationService
│   │   ├── model/                   #  User | Candidate | Employer | Job | Application | ResumeVersion | VerificationRecord
│   │   ├── repository/              #  Spring Data JPA repositories
│   │   └── security/                #  SecurityConfig | JwtUtils | JwtAuthFilter
│   ├── src/main/resources/
│   │   ├── application.yml          #  App config (env-var driven)
│   │   └── db/migration/            #  Flyway migrations V1–V6
│   ├── src/test/                    #  Unit tests (Mockito + JUnit 5)
│   └── Dockerfile                   #  Multi-stage Docker build (non-root)
│
├── db/                              ← 🗄️  Database service layer
│   ├── schema/full_schema_reference.sql   #  Full annotated schema reference
│   ├── seeds/dev_seed.sql                 #  Development seed data
│   └── docs/README.md                     #  DB service documentation
│
├── infrastructure/                  ← 🏗️  Infrastructure as Code (Terraform, AWS)
│   ├── main.tf                      #  AWS provider, required versions, backend config
│   ├── vpc.tf                       #  VPC, subnets, NAT gateway
│   ├── rds.tf                       #  Amazon RDS PostgreSQL
│   ├── s3.tf                        #  S3 buckets (documents + resumes)
│   └── iam.tf                       #  IAM roles and policies
│
├── .github/
│   └── workflows/ci.yml             ← ⚙️  GitHub Actions CI/CD pipeline
│
├── VeriLaunch.code-workspace        ← 💡  Open this file in VS Code for full IDE setup
├── docker-compose.yml               ← 🐳  Full local stack (Postgres + Backend)
├── Makefile                         ← 🛠️  Automation: setup | test | build | run | deploy | terraform-*
└── .gitignore
```

---

## Quick Start

### Prerequisites
- Java 21 (e.g. `brew install --cask temurin@21`)
- Maven 3.9+ (`brew install maven`)
- Docker + Docker Compose (`brew install --cask docker`)
- Node.js 20+ (`brew install node`)

### 1. Start the database
```bash
docker-compose up -d postgres
```

### 2. Run the backend
```bash
make run
# OR
cd backend/verilaunch-core && mvn spring-boot:run
```

### 3. Run the frontend
```bash
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

### 4. Full stack (Docker)
```bash
make docker-run
# Backend: http://localhost:8080
# Health:  http://localhost:8080/actuator/health
```

---

## Open in IDE

### VS Code (recommended)
```bash
code VeriLaunch.code-workspace
```
This opens all four services as separate roots in one workspace with pre-configured launch configs, tasks, and extension recommendations.

### IntelliJ IDEA
Open the `backend/verilaunch-core/` folder directly as a Maven project.
Open `frontend/` separately in WebStorm or as an additional content root.

---

## Key Makefile Targets

| Command | Description |
|---------|-------------|
| `make setup` | Verify all prerequisites |
| `make deps` | Resolve Maven dependencies |
| `make test` | Run all backend unit tests |
| `make build` | Build backend JAR |
| `make run` | Run backend locally |
| `make docker-run` | Start full stack via Docker Compose |
| `make docker-stop` | Stop all containers |
| `make terraform-plan` | Preview AWS infrastructure changes |
| `make terraform-apply` | Apply infrastructure to AWS |
| `make deploy-dev` | Deploy to AWS DEV environment (ECS) |
| `make deploy-prod` | Deploy to AWS PROD (with confirmation prompt) |

---

## Services at a Glance

| Service | Tech | Port |
|---------|------|------|
| Frontend | React 18 + Vite + TypeScript | 5173 |
| Backend API | Java 21 + Spring Boot 3 | 8080 |
| Database | PostgreSQL 15 (Docker / AWS RDS) | 5432 |
| Infrastructure | Terraform → AWS (VPC, RDS, S3, IAM, ECS) | — |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT |
| `GET`  | `/api/v1/jobs/search?keyword=` | Search open jobs |
| `GET`  | `/api/v1/jobs/{id}/match?skills=` | AI match score |
| `POST` | `/api/v1/resumes/build` | Build AI resume |
| `POST` | `/api/v1/resumes/tailor` | Tailor resume to job |
| `POST` | `/api/v1/verifications/initiate` | Start verification |
| `POST` | `/api/v1/applications/draft` | Create draft application |
| `PUT`  | `/api/v1/applications/{id}/queue` | Queue for approval |
| `PUT`  | `/api/v1/applications/{id}/submit` | Submit (post-approval) |
| `GET`  | `/actuator/health` | Service health check |

---

## AI Policy Enforcement

> Every AI agent in VeriLaunch is bound by hard policy rules enforced at the `PolicyService` layer:
> - ❌ Never invent employment history, education, or credentials
> - ❌ Never contact employers or references without explicit consent
> - ✅ Require human approval before application submission
> - ✅ Log all sensitive actions and policy decisions to audit trail
> - ✅ All resume content grounded in user-provided verified data only

---

## CI/CD Pipeline (GitHub Actions)

On every push to `main`:
1. **Backend**: Maven unit tests → JAR build → Trivy security scan
2. **Frontend**: `npm ci` → TypeScript check → Vite build
3. **Docker**: Build & push image to GitHub Container Registry
4. **Deploy**: ECS rolling deployment to DEV (staging/prod via manual approval gate)
