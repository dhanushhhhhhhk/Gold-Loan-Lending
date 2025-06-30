import React, { createContext, useContext, useState } from 'react';

interface KYCData {
  id: string;
  userId: string;
  status: 'pending' | 'verified' | 'rejected';
  kycNumber?: string;
  documents: {
    aadhaar?: string;
    pan?: string;
    drivingLicense?: string;
    passport?: string;
  };
  createdAt: Date;
}

interface LoanApplication {
  id: string;
  userId: string;
  requestId: string;
  status: 'submitted' | 'under_review' | 'document_verification' | 'physical_verification' | 'gold_evaluation' | 'offer_made' | 'approved' | 'rejected' | 'disbursed';
  goldDetails: {
    type: string;
    weight: number;
    images: string[];
    description: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  loanAmount?: number;
  approvedAmount?: number;
  goldQualityIndex?: number;
  evaluationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextType {
  kycData: KYCData[];
  loanApplications: LoanApplication[];
  submitKYC: (documents: any) => Promise<string>;
  submitLoanApplication: (applicationData: any) => Promise<string>;
  updateApplicationStatus: (applicationId: string, status: string, data?: any) => void;
  getApplicationById: (id: string) => LoanApplication | undefined;
  getUserApplications: (userId: string) => LoanApplication[];
  getAllApplications: () => LoanApplication[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kycData, setKycData] = useState<KYCData[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);

  const submitKYC = async (documents: any): Promise<string> => {
    // Simulate API call for KYC verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const kycNumber = 'KYC' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newKYC: KYCData = {
      id: Math.random().toString(36).substr(2, 9),
      userId: documents.userId,
      status: 'verified',
      kycNumber,
      documents,
      createdAt: new Date()
    };
    
    setKycData(prev => [...prev, newKYC]);
    return kycNumber;
  };

  const submitLoanApplication = async (applicationData: any): Promise<string> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const requestId = 'RID' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newApplication: LoanApplication = {
      id: Math.random().toString(36).substr(2, 9),
      userId: applicationData.userId,
      requestId,
      status: 'submitted',
      goldDetails: applicationData.goldDetails,
      bankDetails: applicationData.bankDetails,
      loanAmount: applicationData.loanAmount,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setLoanApplications(prev => [...prev, newApplication]);
    return requestId;
  };

  const updateApplicationStatus = (applicationId: string, status: string, data?: any) => {
    setLoanApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: status as any, ...data, updatedAt: new Date() }
          : app
      )
    );
  };

  const getApplicationById = (id: string) => {
    return loanApplications.find(app => app.id === id);
  };

  const getUserApplications = (userId: string) => {
    return loanApplications.filter(app => app.userId === userId);
  };

  const getAllApplications = () => {
    return loanApplications;
  };

  const value = {
    kycData,
    loanApplications,
    submitKYC,
    submitLoanApplication,
    updateApplicationStatus,
    getApplicationById,
    getUserApplications,
    getAllApplications
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};