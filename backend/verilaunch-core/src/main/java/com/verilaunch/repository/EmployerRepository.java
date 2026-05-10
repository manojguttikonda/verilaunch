package com.verilaunch.repository;

import com.verilaunch.model.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, UUID> {
    Optional<Employer> findByUserId(UUID userId);
}
