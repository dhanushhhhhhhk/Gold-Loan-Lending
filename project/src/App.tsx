import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import CustomerLogin from './pages/Customer/CustomerLogin';
import CustomerRegister from './pages/Customer/CustomerRegister';
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import KYCVerification from './pages/Customer/KYCVerification';
import LoanApplication from './pages/Customer/LoanApplication';
import ApplicationStatus from './pages/Customer/ApplicationStatus';
import BankLogin from './pages/Bank/BankLogin';
import BankDashboard from './pages/Bank/BankDashboard';
import ApplicationReview from './pages/Bank/ApplicationReview';
import GoldEvaluation from './pages/Bank/GoldEvaluation';
import KYCReview from './pages/Bank/KYCReview';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />

                {/* Customer Routes */}
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route path="/customer/register" element={<CustomerRegister />} />
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute userType="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/kyc"
                  element={
                    <ProtectedRoute userType="customer">
                      <KYCVerification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/apply"
                  element={
                    <ProtectedRoute userType="customer">
                      <LoanApplication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/status"
                  element={
                    <ProtectedRoute userType="customer">
                      <ApplicationStatus />
                    </ProtectedRoute>
                  }
                />

                {/* Bank Routes */}
                <Route path="/bank/login" element={<BankLogin />} />
                <Route
                  path="/bank/dashboard"
                  element={
                    <ProtectedRoute userType="bank">
                      <BankDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank/review/:requestId"
                  element={
                    <ProtectedRoute userType="bank">
                      <ApplicationReview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank/kyc/review/:kycId"
                  element={
                    <ProtectedRoute userType="bank">
                      <KYCReview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank/evaluate/:requestId"
                  element={
                    <ProtectedRoute userType="bank">
                      <GoldEvaluation />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;