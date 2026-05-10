package com.verilaunch.service;

import com.verilaunch.model.Job;
import com.verilaunch.repository.EmployerRepository;
import com.verilaunch.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private EmployerRepository employerRepository;

    public Job createJob(UUID employerId, String title, String description, String requirements,
                         String location, String employmentType) {
        var employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found: " + employerId));

        Job job = new Job();
        job.setEmployer(employer);
        job.setTitle(title);
        job.setDescription(description);
        job.setRequirements(requirements);
        job.setLocation(location);
        job.setEmploymentType(employmentType);
        job.setStatus(Job.Status.OPEN);
        return jobRepository.save(job);
    }

    public Page<Job> searchJobs(String keyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (keyword != null && !keyword.isBlank()) {
            return jobRepository.searchByKeyword(keyword, pageRequest);
        }
        return jobRepository.findByStatus(Job.Status.OPEN, pageRequest);
    }

    /**
     * Matching agent: produce a transparent interpretable match score.
     * Factors: title similarity, keyword overlap, location match.
     * Returns score and explanation — no hidden logic.
     */
    public Map<String, Object> matchScore(UUID jobId, String candidateSkills) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        // Simplified keyword overlap scoring
        String[] jobKeywords = (job.getTitle() + " " + job.getRequirements()).toLowerCase().split("\\W+");
        String[] candidateKeywords = candidateSkills.toLowerCase().split("\\W+");

        int matches = 0;
        for (String ck : candidateKeywords) {
            for (String jk : jobKeywords) {
                if (ck.equals(jk) && ck.length() > 3) matches++;
            }
        }
        double score = Math.min(100.0, (matches * 10.0));

        Map<String, Object> result = new HashMap<>();
        result.put("jobId", jobId);
        result.put("matchScore", score);
        result.put("factors", Map.of(
                "keywordOverlap", matches,
                "titleFit", job.getTitle(),
                "explanation", "Score based on keyword overlap between candidate skills and job requirements."
        ));
        return result;
    }

    public Job closeJob(UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        job.setStatus(Job.Status.CLOSED);
        return jobRepository.save(job);
    }
}
