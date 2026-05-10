# Testing VeriLaunch

This document provides comprehensive instructions for testing the VeriLaunch application locally and in the CI/CD environment.

## 1. Local Testing with Docker (Recommended)

The easiest way to test the full stack is using Docker Compose. This starts the PostgreSQL database, the Java backend, and the React frontend.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Steps
1. **Start all services:**
   ```bash
   docker compose up --build -d
   ```
2. **Seed the database:**
   *Note: Flyway migrations run automatically on backend startup. The seed data must be applied AFTER the tables are created.*
   ```bash
   docker exec -i verilaunch-postgres psql -U vladmin -d verilaunch < ./db/seeds/dev_seed.sql
   ```
3. **Access the application:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **Health Check:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

### Test Credentials
| User Role | Email | Password |
|-----------|-------|----------|
| Admin | `admin@verilaunch.com` | `Admin@1234!` |
| Employer | `employer@techcorp.com` | `Employer@1234!` |
| Candidate | `jane.doe@example.com` | `Candidate@1234!` |

---

## 2. Backend Testing (Maven)

The backend service includes unit and integration tests.

### Run Tests Locally
Navigate to the backend directory and run Maven:
```bash
cd backend/verilaunch-core
mvn test
```

### Key Test Classes
- `com.verilaunch.service.ApplicationServiceTest`
- `com.verilaunch.service.JobServiceTest`
- `com.verilaunch.service.PolicyServiceTest`

---

## 3. Frontend Testing & Linting

### Build & Type Check
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run build
```
This runs `tsc` (TypeScript compiler) and `vite build`.

---

## 4. CI/CD Pipeline (GitHub Actions)

The project uses GitHub Actions for automated testing on every push and pull request.

- **Workflow File:** `.github/workflows/ci.yml`
- **Jobs:**
  - **Backend:** Runs `mvn test` and builds the JAR.
  - **Frontend:** Runs `npm run build` (including type-checking).
  - **Security:** Runs a Trivy vulnerability scan.
  - **Docker:** Builds and pushes images to GHCR (on `main` branch).

---

## 5. Troubleshooting Common Issues

### "Invalid CORS request"
If you receive a CORS error in the browser console:
- Ensure the frontend origin (e.g., `http://localhost:3000`) is listed in `SecurityConfig.java` under `corsConfigurationSource()`.

### "Relation 'jobs' already exists" (Flyway)
If Flyway migrations fail with a "relation already exists" error:
- This usually happens if a migration script (like `V4__Jobs.sql`) tries to `CREATE TABLE` for a table that was already created in `V1__Initial_Schema.sql`. 
- Use `ALTER TABLE` in subsequent migrations to add columns.

### Resetting the Local Environment
To start fresh and clear all database data:
```bash
docker compose down -v
docker compose up --build -d
# Re-run seed script after backend is healthy
```
