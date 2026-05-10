package com.verilaunch.service;

import com.verilaunch.model.Candidate;
import com.verilaunch.model.ResumeVersion;
import com.verilaunch.repository.CandidateRepository;
import com.verilaunch.repository.ResumeVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * AI Resume Service.
 * - build() generates a structured ATS-friendly resume from factual candidate profile data.
 * - tailor() adapts an existing resume to a specific job description while preserving factual accuracy.
 *
 * POLICY: This service must NEVER invent, embellish, or fabricate employment history,
 * credentials, or achievements. All output is grounded in user-provided verified data.
 */
@Service
public class ResumeService {

    @Autowired
    private ResumeVersionRepository resumeVersionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    /**
     * Build a new base resume for a candidate from their profile.
     * In production, this delegates to an LLM agent with strict factual grounding.
     */
    public ResumeVersion buildResume(UUID candidateId, String profileData) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + candidateId));

        // Get next version number
        List<ResumeVersion> existing = resumeVersionRepository.findByCandidateIdOrderByVersionDesc(candidateId);
        int nextVersion = existing.isEmpty() ? 1 : existing.get(0).getVersion() + 1;

        // Deactivate existing resumes
        existing.forEach(r -> r.setIsActive(false));
        resumeVersionRepository.saveAll(existing);

        // Build resume content from factual profile data only
        String resumeContent = generateResumeContent(candidate, profileData);

        ResumeVersion resumeVersion = new ResumeVersion();
        resumeVersion.setCandidate(candidate);
        resumeVersion.setBaseContent(resumeContent);
        resumeVersion.setVersion(nextVersion);
        resumeVersion.setIsActive(true);

        return resumeVersionRepository.save(resumeVersion);
    }

    /**
     * Tailor an existing resume to a specific job description.
     * Returns a map containing the tailored content, a change summary, and risk flags.
     * Risk flags will be populated if any changes risk misrepresenting factual content.
     */
    public Map<String, String> tailorResume(UUID resumeVersionId, String jobDescription) {
        ResumeVersion base = resumeVersionRepository.findById(resumeVersionId)
                .orElseThrow(() -> new RuntimeException("Resume version not found: " + resumeVersionId));

        String tailoredContent = applyJobTailoring(base.getBaseContent(), jobDescription);
        String changeSummary = "Keywords optimized for job description. Bullet order reranked by relevance. No new facts added.";
        String riskFlags = evaluateRiskFlags(base.getBaseContent(), tailoredContent);

        Map<String, String> result = new HashMap<>();
        result.put("tailoredContent", tailoredContent);
        result.put("changeSummary", changeSummary);
        result.put("riskFlags", riskFlags);
        result.put("baseResumeId", resumeVersionId.toString());
        return result;
    }

    // --- Private Helpers (stubs for LLM agent integration) ---

    private String generateResumeContent(Candidate candidate, String profileData) {
        // Stub: In production this would call an LLM with factual grounding instructions.
        // System prompt enforces: "Only use the provided profile data. Do not invent any history."
        return String.format("""
                VERILAUNCH GENERATED RESUME
                ===========================
                Name: %s %s
                Phone: %s
                LinkedIn: %s

                PROFESSIONAL SUMMARY
                --------------------
                [AI-generated summary based on verified profile data]

                WORK EXPERIENCE
                ---------------
                [Populated from verified employment records]

                EDUCATION
                ---------
                [Populated from verified education records]

                SKILLS
                ------
                [Extracted from profile and verified experience data]
                """,
                candidate.getFirstName(),
                candidate.getLastName(),
                candidate.getPhone() != null ? candidate.getPhone() : "N/A",
                candidate.getLinkedinUrl() != null ? candidate.getLinkedinUrl() : "N/A"
        );
    }

    private String applyJobTailoring(String baseContent, String jobDescription) {
        // Stub: In production this would call the Tailoring Agent LLM.
        // System prompt enforces: "Reorder and keyword-optimize ONLY. Do not add new claims."
        return baseContent + "\n\n[TAILORED FOR: " + jobDescription.substring(0, Math.min(100, jobDescription.length())) + "...]";
    }

    private String evaluateRiskFlags(String original, String tailored) {
        // Stub: Checks for semantic drift between original and tailored content.
        return "NONE";
    }
}
