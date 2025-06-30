package com.starfinance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "kyc")
public class KYC {
    @Id
    private String id;

    @Indexed(unique = true)
    private String kycNumber;

    private String userId;
    private KYCStatus status;
    private String aadhaarNumber;
    private String panNumber;
    private String drivingLicense;
    private String passport;
    private String aadhaarImageUrl;
    private String panImageUrl;
    private String drivingLicenseImageUrl;
    private String passportImageUrl;
    private String verificationNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum KYCStatus {
        PENDING, VERIFIED, REJECTED
    }

    // Constructors
    public KYC() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = KYCStatus.PENDING;
    }

    public KYC(String userId) {
        this();
        this.userId = userId;
        this.kycNumber = "KYC" + System.currentTimeMillis();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getKycNumber() {
        return kycNumber;
    }

    public void setKycNumber(String kycNumber) {
        this.kycNumber = kycNumber;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public KYCStatus getStatus() {
        return status;
    }

    public void setStatus(KYCStatus status) {
        this.status = status;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getDrivingLicense() {
        return drivingLicense;
    }

    public void setDrivingLicense(String drivingLicense) {
        this.drivingLicense = drivingLicense;
    }

    public String getPassport() {
        return passport;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }

    public String getAadhaarImageUrl() {
        return aadhaarImageUrl;
    }

    public void setAadhaarImageUrl(String aadhaarImageUrl) {
        this.aadhaarImageUrl = aadhaarImageUrl;
    }

    public String getPanImageUrl() {
        return panImageUrl;
    }

    public void setPanImageUrl(String panImageUrl) {
        this.panImageUrl = panImageUrl;
    }

    public String getDrivingLicenseImageUrl() {
        return drivingLicenseImageUrl;
    }

    public void setDrivingLicenseImageUrl(String drivingLicenseImageUrl) {
        this.drivingLicenseImageUrl = drivingLicenseImageUrl;
    }

    public String getPassportImageUrl() {
        return passportImageUrl;
    }

    public void setPassportImageUrl(String passportImageUrl) {
        this.passportImageUrl = passportImageUrl;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}