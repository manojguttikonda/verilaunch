package com.verilaunch.service;

import com.verilaunch.model.Job;
import com.verilaunch.repository.EmployerRepository;
import com.verilaunch.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private EmployerRepository employerRepository;

    @InjectMocks
    private JobService jobService;

    private Job sampleJob;

    @BeforeEach
    void setUp() {
        sampleJob = new Job();
        sampleJob.setId(UUID.randomUUID());
        sampleJob.setTitle("Senior Java Engineer");
        sampleJob.setDescription("Build scalable backend services using Java and Spring Boot.");
        sampleJob.setRequirements("Java, Spring Boot, PostgreSQL, AWS");
        sampleJob.setStatus(Job.Status.OPEN);
    }

    @Test
    void searchJobs_withKeyword_returnsMatchingJobs() {
        Page<Job> mockPage = new PageImpl<>(List.of(sampleJob));
        when(jobRepository.searchByKeyword(eq("Java"), any(Pageable.class))).thenReturn(mockPage);

        Page<Job> result = jobService.searchJobs("Java", 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Senior Java Engineer");
    }

    @Test
    void searchJobs_withoutKeyword_returnsOpenJobs() {
        Page<Job> mockPage = new PageImpl<>(List.of(sampleJob));
        when(jobRepository.findByStatus(eq(Job.Status.OPEN), any(Pageable.class))).thenReturn(mockPage);

        Page<Job> result = jobService.searchJobs("", 0, 10);

        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void matchScore_returnsTransparentScore() {
        when(jobRepository.findById(sampleJob.getId())).thenReturn(Optional.of(sampleJob));

        Map<String, Object> result = jobService.matchScore(sampleJob.getId(), "Java Spring Boot AWS PostgreSQL Docker");

        assertThat(result).containsKey("matchScore");
        assertThat(result).containsKey("factors");
        assertThat((Double) result.get("matchScore")).isGreaterThanOrEqualTo(0.0);
    }

    @Test
    void closeJob_changesStatusToClosed() {
        when(jobRepository.findById(sampleJob.getId())).thenReturn(Optional.of(sampleJob));
        when(jobRepository.save(sampleJob)).thenReturn(sampleJob);

        Job closed = jobService.closeJob(sampleJob.getId());

        assertThat(closed.getStatus()).isEqualTo(Job.Status.CLOSED);
        verify(jobRepository, times(1)).save(sampleJob);
    }
}
