package com.verilaunch.controller;

import com.verilaunch.model.Job;
import com.verilaunch.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Map<String, String> req) {
        UUID employerId = UUID.fromString(req.get("employerId"));
        Job job = jobService.createJob(
                employerId,
                req.get("title"),
                req.get("description"),
                req.get("requirements"),
                req.get("location"),
                req.get("employmentType")
        );
        return ResponseEntity.ok(job);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Job>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, page, size));
    }

    @GetMapping("/{jobId}/match")
    public ResponseEntity<Map<String, Object>> matchScore(
            @PathVariable UUID jobId,
            @RequestParam String skills) {
        return ResponseEntity.ok(jobService.matchScore(jobId, skills));
    }

    @PutMapping("/{jobId}/close")
    public ResponseEntity<Job> closeJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok(jobService.closeJob(jobId));
    }
}
