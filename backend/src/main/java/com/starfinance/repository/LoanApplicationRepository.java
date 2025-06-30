package com.starfinance.repository;

import com.starfinance.model.LoanApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends MongoRepository<LoanApplication, String> {
    Optional<LoanApplication> findByRequestId(String requestId);

    List<LoanApplication> findByUserId(String userId);

    List<LoanApplication> findByStatus(LoanApplication.ApplicationStatus status);

    List<LoanApplication> findByKycNumber(String kycNumber);

    boolean existsByRequestId(String requestId);
}