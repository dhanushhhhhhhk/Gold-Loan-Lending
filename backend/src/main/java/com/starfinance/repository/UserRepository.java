package com.starfinance.repository;

import com.starfinance.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByKycNumber(String kycNumber);

    Optional<User> findByEmployeeId(String employeeId);

    boolean existsByEmail(String email);
}