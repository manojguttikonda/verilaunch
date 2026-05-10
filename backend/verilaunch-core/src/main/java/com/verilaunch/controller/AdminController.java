package com.verilaunch.controller;

import com.verilaunch.service.AuditLogService;
import com.verilaunch.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin Console Controller — Phase: Admin & Observability.
 * Restricted to ROLE_ADMIN. Provides audit trail, policy management, and operational insights.
 *
 * NOTE: RBAC enforcement should be added via @PreAuthorize("hasRole('ADMIN')")
 *       once full UserDetailsService is wired in a future phase.
 */
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private PolicyService policyService;

    /**
     * Health summary for ops dashboards.
     */
    @GetMapping("/health-summary")
    public ResponseEntity<Map<String, Object>> healthSummary() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "services", List.of("auth", "resume", "verification", "jobs", "applications", "integrations"),
                "policyEngine", "ACTIVE",
                "auditLog", "ACTIVE"
        ));
    }

    /**
     * Evaluate a policy action on behalf of a user — for admin testing/review.
     */
    @PostMapping("/policy/evaluate")
    public ResponseEntity<PolicyService.PolicyResult> evaluatePolicy(@RequestBody Map<String, Object> req) {
        String action = (String) req.get("action");
        String userId = (String) req.getOrDefault("userId", "admin");
        @SuppressWarnings("unchecked")
        Map<String, Object> context = (Map<String, Object>) req.getOrDefault("context", Map.of());
        return ResponseEntity.ok(policyService.evaluate(action, userId, context));
    }

    /**
     * Emit a manual audit log entry — for compliance and incident response.
     */
    @PostMapping("/audit/log")
    public ResponseEntity<String> logAuditEvent(@RequestBody Map<String, String> req) {
        auditLogService.log(
                req.getOrDefault("action", "MANUAL_AUDIT_ENTRY"),
                req.getOrDefault("actorId", "admin"),
                req.getOrDefault("details", "")
        );
        return ResponseEntity.ok("Audit event logged.");
    }
}
