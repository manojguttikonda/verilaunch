resource "aws_ecs_cluster" "verilaunch" {
  name = "verilaunch-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "verilaunch" {
  cluster_name       = aws_ecs_cluster.verilaunch.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution" {
  name = "verilaunch-ecs-exec-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_secrets_access" {
  name = "verilaunch-secrets-access"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue"]
      Resource = aws_secretsmanager_secret.verilaunch_app.arn
    }]
  })
}

# ECS Task Definition
resource "aws_ecs_task_definition" "verilaunch_core" {
  family                   = "verilaunch-core-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.backend_execution_role.arn

  container_definitions = jsonencode([{
    name      = "verilaunch-core"
    image     = "${aws_ecr_repository.verilaunch_core.repository_url}:latest"
    essential = true

    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
      protocol      = "tcp"
    }]

    environment = [
      { name = "DB_PORT", value = "5432" },
      { name = "DB_NAME", value = "verilaunch" },
      { name = "PORT",    value = "8080" }
    ]

    secrets = [
      { name = "DB_HOST",     valueFrom = "${aws_secretsmanager_secret.verilaunch_app.arn}:DB_HOST::" },
      { name = "DB_USER",     valueFrom = "${aws_secretsmanager_secret.verilaunch_app.arn}:DB_USER::" },
      { name = "DB_PASSWORD", valueFrom = "${aws_secretsmanager_secret.verilaunch_app.arn}:DB_PASSWORD::" },
      { name = "JWT_SECRET",  valueFrom = "${aws_secretsmanager_secret.verilaunch_app.arn}:JWT_SECRET::" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/verilaunch-${var.environment}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "wget -q --spider http://localhost:8080/actuator/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])
}

# Security group for ECS tasks
resource "aws_security_group" "ecs_tasks" {
  name        = "verilaunch-ecs-tasks-${var.environment}"
  description = "Allow traffic to ECS tasks"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Service
resource "aws_ecs_service" "verilaunch_core" {
  name            = "verilaunch-core"
  cluster         = aws_ecs_cluster.verilaunch.id
  task_definition = aws_ecs_task_definition.verilaunch_core.arn
  desired_count   = var.environment == "prod" ? 2 : 1

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 100
  }

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.verilaunch_core.arn
    container_name   = "verilaunch-core"
    container_port   = 8080
  }

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  depends_on = [aws_lb_listener.https]

  lifecycle {
    ignore_changes = [task_definition]
  }
}

# CloudWatch log group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/verilaunch-${var.environment}"
  retention_in_days = 30
}
