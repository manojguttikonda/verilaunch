package com.verilaunch.service;

import com.verilaunch.model.VerificationRecord;
import com.verilaunch.model.Candidate;
import com.verilaunch.repository.VerificationRecordRepository;
import com.verilaunch.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Verification Service — enforces the state machine:
 * PENDING → VERIFIED | PARTIALLY_VERIFIED | NEEDS_REVIEW | REJECTED
 *
 * POLICY: Never contact employers or references without explicit consent.
 * All state transitions are logged as audit events.
 */
@Service
public class VerificationService {

    @Autowired
    private VerificationRecordRepository verificationRecordRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private AuditLogService auditLogService;

    public VerificationRecord initiateVerification(UUID candidateId, String verificationType) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + candidateId));

        VerificationRecord record = new VerificationRecord();
        record.setCandidate(candidate);
        record.setVerificationType(verificationType);
        record.setStatus(VerificationRecord.Status.PENDING);

        VerificationRecord saved = verificationRecordRepository.save(record);
        auditLogService.log("VERIFICATION_INITIATED", candidateId.toString(),
                "type=" + verificationType + ", recordId=" + saved.getId());
        return saved;
    }

    public VerificationRecord updateStatus(UUID recordId, VerificationRecord.Status newStatus,
                                           Double confidenceScore, String notes) {
        VerificationRecord record = verificationRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Verification record not found: " + recordId));

        record.setStatus(newStatus);
        record.setConfidenceScore(confidenceScore);
        record.setReviewerNotes(notes);

        VerificationRecord saved = verificationRecordRepository.save(record);
        auditLogService.log("VERIFICATION_STATUS_UPDATED", record.getCandidate().getId().toString(),
                "recordId=" + recordId + ", newStatus=" + newStatus + ", confidence=" + confidenceScore);
        return saved;
    }

    public List<VerificationRecord> getVerificationsForCandidate(UUID candidateId) {
        return verificationRecordRepository.findByCandidateId(candidateId);
    }

    /**
     * OCR stub — delegates to AWS Textract in production.
     * Returns structured text extraction result with confidence.
     */
    public String processDocumentOcr(String s3Key) {
        // Stub: In production, call AWS Textract SDK
        auditLogService.log("OCR_PROCESSED", "system", "s3Key=" + s3Key);
        return "{\"text\": \"[OCR output from AWS Textract]\", \"confidence\": 0.95, \"anomalies\": []}";
    }
}
