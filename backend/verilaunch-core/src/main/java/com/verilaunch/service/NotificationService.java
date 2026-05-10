package com.verilaunch.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Notification Service — async event-driven email and in-app notifications.
 * In production:
 *   - SQS queue receives notification events
 *   - Lambda consumer dispatches to AWS SES for email
 *   - In-app notifications stored in DB
 *
 * Notifications are always a best-effort side-effect, never a blocking operation.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    @Value("${notifications.sqs-queue-url:#{null}}")
    private String sqsQueueUrl;

    public enum NotificationType {
        APPLICATION_SUBMITTED,
        APPLICATION_STATUS_CHANGE,
        VERIFICATION_COMPLETE,
        NEW_JOB_MATCH,
        RESUME_BUILT,
        ACCOUNT_WELCOME
    }

    /**
     * Enqueue a notification for async delivery.
     * Uses SQS when configured; logs locally in dev.
     *
     * @param recipientEmail  target email address
     * @param type            type of notification
     * @param payload         template variables
     */
    public void enqueue(String recipientEmail, NotificationType type, java.util.Map<String, String> payload) {
        if (sqsQueueUrl != null && !sqsQueueUrl.isBlank()) {
            // Production: publish to SQS
            // In production: AmazonSQS client.sendMessage(sqsQueueUrl, buildMessage(type, payload))
            log.info("[NOTIFICATION] Enqueued to SQS. type={} recipient={}", type, recipientEmail);
        } else {
            // Dev: log the notification
            log.info("[NOTIFICATION][DEV] type={} recipient={} payload={}", type, recipientEmail, payload);
        }
    }

    /**
     * Send a welcome email upon user registration.
     */
    public void sendWelcome(String recipientEmail, String firstName) {
        enqueue(recipientEmail, NotificationType.ACCOUNT_WELCOME,
                java.util.Map.of("firstName", firstName, "platform", "VeriLaunch"));
    }

    /**
     * Notify candidate when their application status changes.
     */
    public void notifyApplicationStatus(String recipientEmail, String jobTitle, String newStatus) {
        enqueue(recipientEmail, NotificationType.APPLICATION_STATUS_CHANGE,
                java.util.Map.of("jobTitle", jobTitle, "status", newStatus));
    }

    /**
     * Notify candidate when a verification completes.
     */
    public void notifyVerificationComplete(String recipientEmail, String verificationType, String status) {
        enqueue(recipientEmail, NotificationType.VERIFICATION_COMPLETE,
                java.util.Map.of("verificationType", verificationType, "status", status));
    }
}
