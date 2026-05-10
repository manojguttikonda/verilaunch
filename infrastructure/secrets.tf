resource "aws_secretsmanager_secret" "verilaunch_app" {
  name        = "verilaunch/${var.environment}/app"
  description = "VeriLaunch application secrets"

  recovery_window_in_days = var.environment == "prod" ? 30 : 0
}

resource "aws_secretsmanager_secret_version" "verilaunch_app_initial" {
  secret_id = aws_secretsmanager_secret.verilaunch_app.id

  secret_string = jsonencode({
    DB_HOST     = module.db.db_instance_address
    DB_USER     = "vladmin"
    DB_PASSWORD = var.db_password
    JWT_SECRET  = var.jwt_secret
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret (base64-encoded, min 256 bits)"
  type        = string
  sensitive   = true
}

output "secrets_manager_arn" {
  value       = aws_secretsmanager_secret.verilaunch_app.arn
  description = "ARN of the app secrets in Secrets Manager"
}
