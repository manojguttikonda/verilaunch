package com.verilaunch.service;

import com.verilaunch.model.Application;
import com.verilaunch.model.Candidate;
import com.verilaunch.model.Job;
import com.verilaunch.model.ResumeVersion;
import com.verilaunch.repository.ApplicationRepository;
import com.verilaunch.repository.CandidateRepository;
import com.verilaunch.repository.JobRepository;
import com.verilaunch.repository.ResumeVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Application Service.
 * POLICY: Require human approval (QUEUED status) before submission unless explicitly configured.
 * Idempotency enforced via idempotency_key to prevent duplicate submissions.
 * Retry-safe: calling submit on a QUEUED app will not create a duplicate.
 */
@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ResumeVersionRepository resumeVersionRepository;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Creates a draft application (idempotent).
     * If an application with the same idempotency key already exists, returns it.
     */
    public Application createDraft(UUID candidateId, UUID jobId, UUID resumeVersionId) {
        String idempotencyKey = candidateId + ":" + jobId;

        // Idempotency check
        return applicationRepository.findByIdempotencyKey(idempotencyKey).orElseGet(() -> {
            Candidate candidate = candidateRepository.findById(candidateId)
                    .orElseThrow(() -> new RuntimeException("Candidate not found"));
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            ResumeVersion resume = resumeVersionRepository.findById(resumeVersionId).orElse(null);

            Application app = new Application();
            app.setCandidate(candidate);
            app.setJob(job);
            app.setResumeVersion(resume);
            app.setStatus(Application.Status.DRAFT);
            app.setIdempotencyKey(idempotencyKey);

            Application saved = applicationRepository.save(app);
            auditLogService.log("APPLICATION_DRAFT_CREATED", candidateId.toString(),
                    "appId=" + saved.getId() + ", jobId=" + jobId);
            return saved;
        });
    }

    /**
     * Moves application to QUEUED — awaiting human approval.
     */
    public Application queue(UUID applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(Application.Status.QUEUED);
        Application saved = applicationRepository.save(app);
        auditLogService.log("APPLICATION_QUEUED", app.getCandidate().getId().toString(),
                "appId=" + applicationId);
        return saved;
    }

    /**
     * Submits a QUEUED application (requires prior human approval).
     * In production this integrates with the ATS via IntegrationService.
     */
    public Application submit(UUID applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (app.getStatus() != Application.Status.QUEUED) {
            throw new IllegalStateException("Application must be in QUEUED state before submission. Current: " + app.getStatus());
        }

        app.setStatus(Application.Status.SUBMITTED);
        app.setSubmittedAt(Instant.now());
        Application saved = applicationRepository.save(app);
        auditLogService.log("APPLICATION_SUBMITTED", app.getCandidate().getId().toString(),
                "appId=" + applicationId + ", submittedAt=" + app.getSubmittedAt());
        return saved;
    }

    public List<Application> getApplicationsForCandidate(UUID candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }
}
