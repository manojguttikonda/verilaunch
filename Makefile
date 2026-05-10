# VeriLaunch Global Makefile
.PHONY: setup deps lint test test-integration test-e2e build run \
        deploy-dev deploy-staging deploy-prod \
        terraform-plan terraform-apply terraform-destroy \
        docker-build docker-run docker-stop

# ─────────────────────────────────────────────────
# Developer Setup
# ─────────────────────────────────────────────────
setup:
	@echo "🚀 Setting up VeriLaunch local environment..."
	@which java   > /dev/null 2>&1 || (echo "❌ Java 21 is required" && exit 1)
	@which mvn    > /dev/null 2>&1 || (echo "❌ Maven is required" && exit 1)
	@which docker > /dev/null 2>&1 || (echo "❌ Docker is required" && exit 1)
	@echo "✅ All dependencies satisfied."

deps:
	@echo "📦 Resolving Maven dependencies..."
	@cd backend/verilaunch-core && mvn dependency:resolve --no-transfer-progress -q

# ─────────────────────────────────────────────────
# Code Quality
# ─────────────────────────────────────────────────
lint:
	@echo "🔍 Linting Terraform..."
	@cd infrastructure && terraform fmt -check -recursive || echo "⚠️  Terraform fmt issues found"

# ─────────────────────────────────────────────────
# Testing
# ─────────────────────────────────────────────────
test:
	@echo "🧪 Running backend unit tests..."
	@cd backend/verilaunch-core && mvn test --no-transfer-progress

test-integration:
	@echo "🔗 Running integration tests..."
	@cd backend/verilaunch-core && mvn verify -P integration-test --no-transfer-progress

test-e2e:
	@echo "🌐 Running E2E tests..."
	@echo "E2E suite not yet configured. Coming in Phase 9."

# ─────────────────────────────────────────────────
# Build
# ─────────────────────────────────────────────────
build:
	@echo "🔨 Building backend JAR..."
	@cd backend/verilaunch-core && mvn clean package -DskipTests --no-transfer-progress
	@echo "✅ Backend JAR built at backend/verilaunch-core/target/"

# ─────────────────────────────────────────────────
# Local Run (without Docker)
# ─────────────────────────────────────────────────
run:
	@echo "▶️  Starting VeriLaunch backend locally..."
	@cd backend/verilaunch-core && mvn spring-boot:run

# ─────────────────────────────────────────────────
# Docker
# ─────────────────────────────────────────────────
docker-build:
	@echo "🐳 Building Docker images..."
	@docker-compose build

docker-run:
	@echo "🐳 Starting full stack (Postgres + Backend)..."
	@docker-compose up -d
	@echo "✅ Backend running at http://localhost:8080"
	@echo "   Health: http://localhost:8080/actuator/health"

docker-stop:
	@echo "🛑 Stopping all containers..."
	@docker-compose down

# ─────────────────────────────────────────────────
# Terraform Infrastructure
# ─────────────────────────────────────────────────
terraform-plan:
	@echo "🗺️  Planning Terraform infrastructure..."
	@cd infrastructure && terraform init -input=false && terraform plan -out=tfplan

terraform-apply:
	@echo "🏗️  Applying Terraform infrastructure..."
	@cd infrastructure && terraform apply -auto-approve tfplan

terraform-destroy:
	@echo "💥 Destroying Terraform infrastructure..."
	@read -p "Are you sure? (yes/no): " confirm && [ "$$confirm" = "yes" ] || exit 1
	@cd infrastructure && terraform destroy -auto-approve

# ─────────────────────────────────────────────────
# Deployment
# ─────────────────────────────────────────────────
deploy-dev:
	@echo "🚀 Deploying to DEV environment..."
	@aws ecs update-service --cluster verilaunch-dev --service verilaunch-core --force-new-deployment

deploy-staging:
	@echo "🚀 Deploying to STAGING environment..."
	@aws ecs update-service --cluster verilaunch-staging --service verilaunch-core --force-new-deployment

deploy-prod:
	@echo "🚀 Deploying to PRODUCTION environment..."
	@read -p "Deploy to PRODUCTION? (yes/no): " confirm && [ "$$confirm" = "yes" ] || exit 1
	@aws ecs update-service --cluster verilaunch-prod --service verilaunch-core --force-new-deployment
