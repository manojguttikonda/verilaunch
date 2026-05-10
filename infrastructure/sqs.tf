# SQS queues for async, retry-safe event processing
resource "aws_sqs_queue" "application_events" {
  name                       = "verilaunch-application-events-${var.environment}"
  visibility_timeout_seconds = 300
  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 20 # Long polling

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.application_events_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "application_events_dlq" {
  name                      = "verilaunch-application-events-dlq-${var.environment}"
  message_retention_seconds = 1209600 # 14 days
}

resource "aws_sqs_queue" "verification_events" {
  name                       = "verilaunch-verification-events-${var.environment}"
  visibility_timeout_seconds = 300
  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 20

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.verification_events_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "verification_events_dlq" {
  name                      = "verilaunch-verification-events-dlq-${var.environment}"
  message_retention_seconds = 1209600
}

resource "aws_sqs_queue" "notification_events" {
  name                       = "verilaunch-notifications-${var.environment}"
  visibility_timeout_seconds = 60
  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 20
}

# SNS topic for fan-out (e.g. new job posted → email + matching)
resource "aws_sns_topic" "job_events" {
  name = "verilaunch-job-events-${var.environment}"
}

resource "aws_sns_topic_subscription" "job_events_to_notifications" {
  topic_arn = aws_sns_topic.job_events.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.notification_events.arn
}

output "sqs_application_events_url" {
  value = aws_sqs_queue.application_events.url
}

output "sqs_verification_events_url" {
  value = aws_sqs_queue.verification_events.url
}
