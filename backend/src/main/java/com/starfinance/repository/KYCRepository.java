package com.starfinance.repository;

import com.starfinance.model.KYC;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KYCRepository extends MongoRepository<KYC, String> {
    Optional<KYC> findByKycNumber(String kycNumber);

    Optional<KYC> findByUserId(String userId);

    List<KYC> findByStatus(KYC.KYCStatus status);

    boolean existsByKycNumber(String kycNumber);
}