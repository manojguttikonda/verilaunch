package com.verilaunch.controller;

import com.verilaunch.model.VerificationRecord;
import com.verilaunch.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/verifications")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @PostMapping("/initiate")
    public ResponseEntity<VerificationRecord> initiate(@RequestBody Map<String, String> req) {
        UUID candidateId = UUID.fromString(req.get("candidateId"));
        String type = req.get("verificationType");
        return ResponseEntity.ok(verificationService.initiateVerification(candidateId, type));
    }

    @PutMapping("/{recordId}/status")
    public ResponseEntity<VerificationRecord> updateStatus(
            @PathVariable UUID recordId,
            @RequestBody Map<String, Object> req) {
        VerificationRecord.Status status = VerificationRecord.Status.valueOf((String) req.get("status"));
        Double confidence = req.get("confidenceScore") != null ? ((Number) req.get("confidenceScore")).doubleValue() : null;
        String notes = (String) req.get("notes");
        return ResponseEntity.ok(verificationService.updateStatus(recordId, status, confidence, notes));
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<VerificationRecord>> forCandidate(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(verificationService.getVerificationsForCandidate(candidateId));
    }

    @PostMapping("/ocr")
    public ResponseEntity<String> processOcr(@RequestBody Map<String, String> req) {
        String result = verificationService.processDocumentOcr(req.get("s3Key"));
        return ResponseEntity.ok(result);
    }
}
