package com.verilaunch.controller;

import com.verilaunch.model.ResumeVersion;
import com.verilaunch.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    /**
     * Build a new resume for a candidate from their verified profile data.
     * POST /api/v1/resumes/build
     */
    @PostMapping("/build")
    public ResponseEntity<ResumeVersion> buildResume(@RequestBody Map<String, String> request) {
        UUID candidateId = UUID.fromString(request.get("candidateId"));
        String profileData = request.getOrDefault("profileData", "");
        ResumeVersion version = resumeService.buildResume(candidateId, profileData);
        return ResponseEntity.ok(version);
    }

    /**
     * Tailor an existing resume to a specific job description.
     * POST /api/v1/resumes/tailor
     */
    @PostMapping("/tailor")
    public ResponseEntity<Map<String, String>> tailorResume(@RequestBody Map<String, String> request) {
        UUID resumeVersionId = UUID.fromString(request.get("resumeVersionId"));
        String jobDescription = request.get("jobDescription");
        Map<String, String> result = resumeService.tailorResume(resumeVersionId, jobDescription);
        return ResponseEntity.ok(result);
    }
}
