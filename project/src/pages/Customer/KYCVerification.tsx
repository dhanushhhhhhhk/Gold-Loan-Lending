import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, Camera, Clock } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const KYCVerification: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    drivingLicense: '',
    passport: ''
  });

  const [files, setFiles] = useState({
    aadhaar: null as File | null,
    pan: null as File | null,
    drivingLicense: null as File | null,
    passport: null as File | null
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const documentTypes = [
    {
      key: 'aadhaarNumber',
      label: 'Aadhaar Card',
      required: true,
      placeholder: 'Enter 12-digit Aadhaar number',
      pattern: /^\d{12}$/,
      errorMessage: 'Aadhaar number must be 12 digits'
    },
    {
      key: 'panNumber',
      label: 'PAN Card',
      required: true,
      placeholder: 'Enter 10-digit PAN number',
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      errorMessage: 'Invalid PAN format (e.g., ABCDE1234F)'
    },
    {
      key: 'drivingLicense',
      label: 'Driving License',
      required: false,
      placeholder: 'Enter driving license number',
      pattern: /^.{8,}$/,
      errorMessage: 'Invalid driving license number'
    },
    {
      key: 'passport',
      label: 'Passport',
      required: false,
      placeholder: 'Enter passport number',
      pattern: /^[A-Z]{1}[0-9]{7}$/,
      errorMessage: 'Invalid passport format (e.g., A1234567)'
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const validateForm = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required);

    for (const doc of requiredDocs) {
      const value = formData[doc.key as keyof typeof formData];
      if (!value || !doc.pattern.test(value)) {
        setError(`${doc.label}: ${doc.errorMessage}`);
        return false;
      }

      // Check if required file is uploaded
      const fileKey = doc.key === 'aadhaarNumber' ? 'aadhaar' :
        doc.key === 'panNumber' ? 'pan' :
          doc.key === 'drivingLicense' ? 'drivingLicense' : 'passport';

      if (!files[fileKey as keyof typeof files]) {
        setError(`Please upload ${doc.label} document`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Call the API service for KYC submission
      const response = await apiService.submitKYC({
        userId: user?.id || '',
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        drivingLicense: formData.drivingLicense || undefined,
        passport: formData.passport || undefined,
        documents: {
          aadhaar: files.aadhaar || undefined,
          pan: files.pan || undefined,
          drivingLicense: files.drivingLicense || undefined,
          passport: files.passport || undefined
        }
      });

      if (response.success) {
        setSuccess(true);

        // Update user context with KYC number
        if (user && response.data?.kycNumber) {
          const updatedUser = { ...user, kycNumber: response.data.kycNumber };
          // Note: For Firebase users, this will be handled by the backend
          // The KYC number will be stored in the backend database
        }

        setTimeout(() => {
          navigate('/customer/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'KYC verification failed. Please try again.');
      }

    } catch (err) {
      console.error('KYC submission error:', err);
      setError('KYC verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.kycStatus === 'VERIFIED') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verified</h2>
            <p className="text-gray-600 mb-4">
              Your KYC is verified. Your KYC Number is: <strong>{user.kycNumber}</strong>
            </p>
            <Button onClick={() => navigate('/customer/dashboard')}>
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (user?.kycStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Submitted</h2>
            <p className="text-gray-600 mb-4">
              Your KYC documents have been submitted and are pending review.
            </p>
            <Button onClick={() => navigate('/customer/dashboard')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your documents have been verified successfully. You can now apply for gold loans.
            </p>
            <LoadingSpinner />
            <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-2">
            Complete your KYC verification to apply for gold loans. This process is secure and takes only a few minutes.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-blue-700 text-sm">
                  <strong>Required Documents:</strong> Aadhaar Card and PAN Card are mandatory.
                  Additional documents like Driving License or Passport can be provided for faster verification.
                </div>
              </div>
            </div>

            {documentTypes.map((doc) => (
              <div key={doc.key} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">{doc.label}</h3>
                  {doc.required && <span className="text-red-500 text-sm">*</span>}
                </div>

                <div>
                  <input
                    type="text"
                    value={formData[doc.key as keyof typeof formData]}
                    onChange={(e) => handleInputChange(doc.key, e.target.value)}
                    placeholder={doc.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={doc.required}
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <input
                      type="file"
                      id={`file-${doc.key}`}
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        const fileKey = doc.key === 'aadhaarNumber' ? 'aadhaar' :
                          doc.key === 'panNumber' ? 'pan' :
                            doc.key === 'drivingLicense' ? 'drivingLicense' : 'passport';
                        handleFileChange(fileKey, file);
                      }}
                      className="hidden"
                      required={doc.required}
                    />
                    <label htmlFor={`file-${doc.key}`} className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        {files[doc.key === 'aadhaarNumber' ? 'aadhaar' :
                          doc.key === 'panNumber' ? 'pan' :
                            doc.key === 'drivingLicense' ? 'drivingLicense' : 'passport' as keyof typeof files] ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            <span>Document uploaded</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400" />
                            <div>
                              <span className="text-sm font-medium text-primary-600">Upload {doc.label}</span>
                              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                I consent to the verification of my documents and agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              Submit KYC Verification
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default KYCVerification;