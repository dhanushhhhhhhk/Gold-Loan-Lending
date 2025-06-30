// API Service for communicating with the backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface KYCRequest {
    userId: string;
    aadhaarNumber: string;
    panNumber: string;
    drivingLicense?: string;
    passport?: string;
    documents: {
        aadhaar?: File;
        pan?: File;
        drivingLicense?: File;
        passport?: File;
    };
}

export interface LoanApplicationRequest {
    userId: string;
    kycNumber: string;
    assetDetails: {
        type: string;
        weight: number;
        purity: string;
        description: string;
        images: File[];
    };
    bankDetails: {
        accountNumber: string;
        ifscCode: string;
        bankName: string;
        branchName: string;
        accountHolderName: string;
    };
    requestedAmount: number;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    // Auth endpoints
    async bankLogin(credentials: LoginRequest): Promise<ApiResponse> {
        return this.request('/auth/bank/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async bankRegister(userData: RegisterRequest): Promise<ApiResponse> {
        return this.request('/auth/bank/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async testConnection(): Promise<ApiResponse> {
        return this.request('/auth/test');
    }

    // KYC endpoints
    async submitKYC(kycData: KYCRequest): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('userId', kycData.userId);
        formData.append('aadhaarNumber', kycData.aadhaarNumber);
        formData.append('panNumber', kycData.panNumber);

        if (kycData.drivingLicense) {
            formData.append('drivingLicense', kycData.drivingLicense);
        }
        if (kycData.passport) {
            formData.append('passport', kycData.passport);
        }

        if (kycData.documents.aadhaar) {
            formData.append('aadhaarDocument', kycData.documents.aadhaar);
        }
        if (kycData.documents.pan) {
            formData.append('panDocument', kycData.documents.pan);
        }
        if (kycData.documents.drivingLicense) {
            formData.append('drivingLicenseDocument', kycData.documents.drivingLicense);
        }
        if (kycData.documents.passport) {
            formData.append('passportDocument', kycData.documents.passport);
        }

        return this.request('/kyc/submit', {
            method: 'POST',
            headers: {}, // Let browser set Content-Type for FormData
            body: formData,
        });
    }

    async getKYCStatus(userId: string): Promise<ApiResponse> {
        return this.request(`/kyc/status/${userId}`);
    }

    // Loan application endpoints
    async submitLoanApplication(applicationData: LoanApplicationRequest): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('userId', applicationData.userId);
        formData.append('kycNumber', applicationData.kycNumber);
        formData.append('assetDetails', JSON.stringify(applicationData.assetDetails));
        formData.append('bankDetails', JSON.stringify(applicationData.bankDetails));
        formData.append('requestedAmount', applicationData.requestedAmount.toString());

        // Add images
        applicationData.assetDetails.images.forEach((image, index) => {
            formData.append(`assetImages`, image);
        });

        return this.request('/loan/submit', {
            method: 'POST',
            headers: {}, // Let browser set Content-Type for FormData
            body: formData,
        });
    }

    async getLoanApplications(userId: string): Promise<ApiResponse> {
        return this.request(`/loan/user/${userId}`);
    }

    async getLoanApplication(requestId: string): Promise<ApiResponse> {
        return this.request(`/loan/${requestId}`);
    }

    // Bank employee endpoints
    async getPendingApplications(): Promise<ApiResponse> {
        return this.request('/bank/applications/pending');
    }

    async getPendingKYCs(): Promise<ApiResponse> {
        return this.request('/bank/kyc/pending');
    }

    async getKYCById(id: string): Promise<ApiResponse> {
        return this.request(`/bank/kyc/${id}`);
    }

    async updateKYCStatus(
        id: string,
        status: 'VERIFIED' | 'REJECTED',
        notes?: string
    ): Promise<ApiResponse> {
        return this.request(`/bank/kyc/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes }),
        });
    }

    async updateApplicationStatus(
        requestId: string,
        status: string,
        notes?: string
    ): Promise<ApiResponse> {
        return this.request(`/bank/applications/${requestId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes }),
        });
    }

    async evaluateGold(
        requestId: string,
        evaluationData: {
            actualWeight: number;
            purityVerified: string;
            qualityIndex: number;
            marketRate: number;
            loanPercentage: number;
            evaluationNotes: string;
        }
    ): Promise<ApiResponse> {
        return this.request(`/bank/applications/${requestId}/evaluate`, {
            method: 'POST',
            body: JSON.stringify(evaluationData),
        });
    }

    // Mock 3rd party API endpoints (for now)
    async verifyAadhaar(aadhaarNumber: string): Promise<ApiResponse> {
        return this.request('/external/aadhaar/verify', {
            method: 'POST',
            body: JSON.stringify({ aadhaarNumber }),
        });
    }

    async verifyPAN(panNumber: string): Promise<ApiResponse> {
        return this.request('/external/pan/verify', {
            method: 'POST',
            body: JSON.stringify({ panNumber }),
        });
    }

    async getBullionRates(): Promise<ApiResponse> {
        return this.request('/external/bullion/rates');
    }
}

export const apiService = new ApiService();
export default apiService; 