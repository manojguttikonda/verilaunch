package com.verilaunch.service;

import com.verilaunch.model.Application;
import com.verilaunch.model.Candidate;
import com.verilaunch.model.Job;
import com.verilaunch.model.ResumeVersion;
import com.verilaunch.repository.ApplicationRepository;
import com.verilaunch.repository.CandidateRepository;
import com.verilaunch.repository.JobRepository;
import com.verilaunch.repository.ResumeVersionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock private ApplicationRepository applicationRepository;
    @Mock private CandidateRepository candidateRepository;
    @Mock private JobRepository jobRepository;
    @Mock private ResumeVersionRepository resumeVersionRepository;
    @Mock private AuditLogService auditLogService;

    @InjectMocks
    private ApplicationService applicationService;

    private UUID candidateId, jobId, resumeId;
    private Candidate candidate;
    private Job job;

    @BeforeEach
    void setUp() {
        candidateId = UUID.randomUUID();
        jobId = UUID.randomUUID();
        resumeId = UUID.randomUUID();

        candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setFirstName("Jane");
        candidate.setLastName("Doe");

        job = new Job();
        job.setId(jobId);
        job.setTitle("Staff Engineer");
    }

    @Test
    void createDraft_isIdempotent_returnsSameApplication() {
        String idempotencyKey = candidateId + ":" + jobId;
        Application existing = new Application();
        existing.setIdempotencyKey(idempotencyKey);
        existing.setStatus(Application.Status.DRAFT);

        when(applicationRepository.findByIdempotencyKey(idempotencyKey)).thenReturn(Optional.of(existing));

        Application result = applicationService.createDraft(candidateId, jobId, resumeId);

        assertThat(result.getIdempotencyKey()).isEqualTo(idempotencyKey);
        assertThat(result.getStatus()).isEqualTo(Application.Status.DRAFT);
    }

    @Test
    void submit_withoutQueuedState_throwsIllegalState() {
        Application app = new Application();
        app.setId(UUID.randomUUID());
        app.setStatus(Application.Status.DRAFT); // NOT queued

        when(applicationRepository.findById(app.getId())).thenReturn(Optional.of(app));

        assertThrows(IllegalStateException.class, () -> applicationService.submit(app.getId()));
    }
}
