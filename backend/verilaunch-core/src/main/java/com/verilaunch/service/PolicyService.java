package com.verilaunch.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

/**
 * Policy Service — Phase 7: Compliance enforcement layer.
 *
 * Enforces consent, retention, privacy, and AI governance rules.
 * Blocks actions that violate policy, emits audit events, and provides remediation guidance.
 * All policy evaluations are logged.
 */
@Service
public class PolicyService {

    private static final Logger log = LoggerFactory.getLogger(PolicyService.class);

    /** Actions that require explicit consent before proceeding */
    private static final Set<String> CONSENT_REQUIRED_ACTIONS = Set.of(
            "CONTACT_REFERENCE",
            "SUBMIT_APPLICATION",
            "SHARE_PROFILE_WITH_EMPLOYER",
            "AI_RESUME_GENERATION"
    );

    /** Actions that are always blocked regardless of consent */
    private static final Set<String> BLOCKED_ACTIONS = Set.of(
            "FABRICATE_EMPLOYMENT_HISTORY",
            "INVENT_CREDENTIALS",
            "AUTO_APPLY_WITHOUT_APPROVAL"
    );

    public record PolicyResult(boolean allowed, String reason, String remediation) {}

    /**
     * Evaluate whether an action is permitted for a given user.
     * @param action     The action being attempted
     * @param userId     The actor attempting the action
     * @param context    Additional context (e.g., consent flags)
     */
    public PolicyResult evaluate(String action, String userId, Map<String, Object> context) {
        // Hard block — never permitted
        if (BLOCKED_ACTIONS.contains(action)) {
            log.warn("[POLICY_DENIED] action={} userId={} reason=HARD_BLOCK", action, userId);
            return new PolicyResult(false, "Action is permanently blocked by platform policy.",
                    "This action violates VeriLaunch's factual grounding policy.");
        }

        // Consent required
        if (CONSENT_REQUIRED_ACTIONS.contains(action)) {
            Boolean hasConsent = (Boolean) context.getOrDefault("hasConsent", false);
            if (!hasConsent) {
                log.warn("[POLICY_DENIED] action={} userId={} reason=NO_CONSENT", action, userId);
                return new PolicyResult(false, "Explicit user consent required for: " + action,
                        "Obtain consent before proceeding. Update consent_records.");
            }
        }

        log.info("[POLICY_ALLOWED] action={} userId={}", action, userId);
        return new PolicyResult(true, "Permitted", null);
    }
}
