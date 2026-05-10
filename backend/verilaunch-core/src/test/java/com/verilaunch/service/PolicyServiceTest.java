package com.verilaunch.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class PolicyServiceTest {

    @InjectMocks
    private PolicyService policyService;

    @Test
    void evaluate_blockedAction_isDenied() {
        var result = policyService.evaluate("FABRICATE_EMPLOYMENT_HISTORY", "user-123", Map.of());
        assertThat(result.allowed()).isFalse();
        assertThat(result.reason()).contains("permanently blocked");
    }

    @Test
    void evaluate_consentRequiredAction_withConsent_isAllowed() {
        var result = policyService.evaluate("SUBMIT_APPLICATION", "user-123", Map.of("hasConsent", true));
        assertThat(result.allowed()).isTrue();
    }

    @Test
    void evaluate_consentRequiredAction_withoutConsent_isDenied() {
        var result = policyService.evaluate("SUBMIT_APPLICATION", "user-123", Map.of("hasConsent", false));
        assertThat(result.allowed()).isFalse();
        assertThat(result.reason()).contains("consent required");
    }

    @Test
    void evaluate_normalAction_isAllowed() {
        var result = policyService.evaluate("VIEW_JOB_LISTING", "user-123", Map.of());
        assertThat(result.allowed()).isTrue();
    }
}
