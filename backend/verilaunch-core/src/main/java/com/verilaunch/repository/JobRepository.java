package com.verilaunch.repository;

import com.verilaunch.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    Page<Job> findByStatus(Job.Status status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND (LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
