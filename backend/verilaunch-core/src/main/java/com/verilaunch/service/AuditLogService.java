package com.verilaunch.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Audit Log Service — Phase 7: Compliance & Observability.
 * Every sensitive action and policy decision is logged.
 * In production, these are persisted to the audit_logs table and shipped to CloudWatch.
 */
@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    /**
     * Log a sensitive action with actor and detail context.
     * @param action    The action taken (e.g., "APPLICATION_SUBMITTED")
     * @param actorId   The ID of the user or system entity performing the action
     * @param details   Free-form detail string for the audit trail
     */
    public void log(String action, String actorId, String details) {
        // Structured log — shipped to CloudWatch Logs in production
        log.info("[AUDIT] action={} actorId={} details={}", action, actorId, details);
        // TODO: persist to audit_logs table via AuditLogRepository
    }
}
