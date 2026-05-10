package com.verilaunch.repository;

import com.verilaunch.model.VerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VerificationRecordRepository extends JpaRepository<VerificationRecord, UUID> {
    List<VerificationRecord> findByCandidateId(UUID candidateId);
}
