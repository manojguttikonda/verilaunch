package com.verilaunch.controller;

import com.verilaunch.model.Application;
import com.verilaunch.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/draft")
    public ResponseEntity<Application> createDraft(@RequestBody Map<String, String> req) {
        UUID candidateId = UUID.fromString(req.get("candidateId"));
        UUID jobId = UUID.fromString(req.get("jobId"));
        UUID resumeVersionId = UUID.fromString(req.get("resumeVersionId"));
        return ResponseEntity.ok(applicationService.createDraft(candidateId, jobId, resumeVersionId));
    }

    @PutMapping("/{applicationId}/queue")
    public ResponseEntity<Application> queue(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(applicationService.queue(applicationId));
    }

    /**
     * Submit a QUEUED application. Requires human approval (QUEUED state) first.
     * Will throw 400 if not yet queued.
     */
    @PutMapping("/{applicationId}/submit")
    public ResponseEntity<?> submit(@PathVariable UUID applicationId) {
        try {
            return ResponseEntity.ok(applicationService.submit(applicationId));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Application>> forCandidate(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(applicationService.getApplicationsForCandidate(candidateId));
    }
}
