package com.starfinance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "loan_applications")
public class LoanApplication {
    @Id
    private String id;

    @Indexed(unique = true)
    private String requestId;

    private String userId;
    private String kycNumber;
    private ApplicationStatus status;
    private AssetDetails assetDetails;
    private BankDetails bankDetails;
    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;
    private BigDecimal goldQualityIndex;
    private String evaluationNotes;
    private List<String> suspiciousFlags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum ApplicationStatus {
        SUBMITTED,
        UNDER_REVIEW,
        DOCUMENT_VERIFICATION,
        PHYSICAL_VERIFICATION,
        GOLD_EVALUATION,
        OFFER_MADE,
        APPROVED,
        REJECTED,
        DISBURSED
    }

    // Asset Details inner class
    public static class AssetDetails {
        private String type; // GOLD, SILVER, PLATINUM
        private BigDecimal weight;
        private String purity;
        private String description;
        private List<String> imageUrls;

        // Getters and Setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public BigDecimal getWeight() {
            return weight;
        }

        public void setWeight(BigDecimal weight) {
            this.weight = weight;
        }

        public String getPurity() {
            return purity;
        }

        public void setPurity(String purity) {
            this.purity = purity;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getImageUrls() {
            return imageUrls;
        }

        public void setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }
    }

    // Bank Details inner class
    public static class BankDetails {
        private String accountNumber;
        private String ifscCode;
        private String bankName;
        private String branchName;
        private String accountHolderName;

        // Getters and Setters
        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public String getIfscCode() {
            return ifscCode;
        }

        public void setIfscCode(String ifscCode) {
            this.ifscCode = ifscCode;
        }

        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

        public String getBranchName() {
            return branchName;
        }

        public void setBranchName(String branchName) {
            this.branchName = branchName;
        }

        public String getAccountHolderName() {
            return accountHolderName;
        }

        public void setAccountHolderName(String accountHolderName) {
            this.accountHolderName = accountHolderName;
        }
    }

    // Constructors
    public LoanApplication() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = ApplicationStatus.SUBMITTED;
        this.requestId = "RID" + System.currentTimeMillis();
    }

    public LoanApplication(String userId, String kycNumber) {
        this();
        this.userId = userId;
        this.kycNumber = kycNumber;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getKycNumber() {
        return kycNumber;
    }

    public void setKycNumber(String kycNumber) {
        this.kycNumber = kycNumber;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public AssetDetails getAssetDetails() {
        return assetDetails;
    }

    public void setAssetDetails(AssetDetails assetDetails) {
        this.assetDetails = assetDetails;
    }

    public BankDetails getBankDetails() {
        return bankDetails;
    }

    public void setBankDetails(BankDetails bankDetails) {
        this.bankDetails = bankDetails;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public BigDecimal getApprovedAmount() {
        return approvedAmount;
    }

    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }

    public BigDecimal getGoldQualityIndex() {
        return goldQualityIndex;
    }

    public void setGoldQualityIndex(BigDecimal goldQualityIndex) {
        this.goldQualityIndex = goldQualityIndex;
    }

    public String getEvaluationNotes() {
        return evaluationNotes;
    }

    public void setEvaluationNotes(String evaluationNotes) {
        this.evaluationNotes = evaluationNotes;
    }

    public List<String> getSuspiciousFlags() {
        return suspiciousFlags;
    }

    public void setSuspiciousFlags(List<String> suspiciousFlags) {
        this.suspiciousFlags = suspiciousFlags;
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