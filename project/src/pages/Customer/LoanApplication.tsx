import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import {
  Upload,
  Camera,
  CreditCard,
  Building2,
  Weight,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const LoanApplication: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [goldDetails, setGoldDetails] = useState({
    type: '',
    weight: '',
    purity: '',
    description: '',
    images: [] as File[]
  });

  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: ''
  });

  const [loanAmount, setLoanAmount] = useState('');

  const goldTypes = [
    'Gold Jewelry',
    'Gold Coins',
    'Gold Bars',
    'Silver Jewelry',
    'Silver Coins',
    'Silver Bars',
    'Platinum Jewelry'
  ];

  const goldPurities = [
    '24K (99.9%)',
    '22K (91.6%)',
    '18K (75%)',
    '14K (58.3%)',
    'Silver (92.5%)',
    'Platinum (95%)'
  ];

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files).filter(file =>
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    setGoldDetails(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index: number) => {
    setGoldDetails(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const calculateEstimatedLoan = () => {
    const weight = parseFloat(goldDetails.weight);
    if (!weight || !goldDetails.purity) return 0;

    // Mock calculation based on type and purity
    const baseRates: Record<string, number> = {
      '24K (99.9%)': 5800,
      '22K (91.6%)': 5300,
      '18K (75%)': 4300,
      '14K (58.3%)': 3400,
      'Silver (92.5%)': 70,
      'Platinum (95%)': 2800
    };

    const rate = baseRates[goldDetails.purity] || 0;
    const loanPercentage = 0.75; // 75% of gold value

    return Math.floor(weight * rate * loanPercentage);
  };

  const validateStep1 = () => {
    if (!goldDetails.type || !goldDetails.weight || !goldDetails.purity) {
      setError('Please fill all required gold details');
      return false;
    }

    if (goldDetails.images.length === 0) {
      setError('Please upload at least one image of your gold');
      return false;
    }

    const weight = parseFloat(goldDetails.weight);
    if (weight <= 0 || weight > 1000) {
      setError('Weight must be between 0.1g and 1000g');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!bankDetails.accountNumber || !bankDetails.confirmAccountNumber ||
      !bankDetails.ifscCode || !bankDetails.bankName) {
      setError('Please fill all required bank details');
      return false;
    }

    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      setError('Account numbers do not match');
      return false;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode)) {
      setError('Invalid IFSC code format');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    const amount = parseFloat(loanAmount);
    const maxLoan = calculateEstimatedLoan();

    if (!amount || amount <= 0) {
      setError('Please enter a valid loan amount');
      return false;
    }

    if (amount > maxLoan) {
      setError(`Loan amount cannot exceed ₹${maxLoan.toLocaleString()}`);
      return false;
    }

    if (amount < 1000) {
      setError('Minimum loan amount is ₹1,000');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setError('');

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.submitLoanApplication({
        userId: user?.id || '',
        kycNumber: user?.kycNumber || '',
        assetDetails: {
          type: goldDetails.type,
          weight: parseFloat(goldDetails.weight),
          purity: goldDetails.purity,
          description: goldDetails.description,
          images: goldDetails.images
        },
        bankDetails: {
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
          bankName: bankDetails.bankName,
          branchName: bankDetails.branchName,
          accountHolderName: user?.name || ''
        },
        requestedAmount: parseFloat(loanAmount)
      });

      if (response.success) {
        // Redirect to status page
        navigate('/customer/status', {
          state: { newApplication: response.data?.requestId }
        });
      } else {
        setError(response.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.kycNumber) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification Required</h2>
            <p className="text-gray-600 mb-4">
              You need to complete KYC verification before applying for a loan.
            </p>
            <Button onClick={() => navigate('/customer/kyc')}>
              Complete KYC Verification
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for Gold Loan</h1>
          <p className="text-gray-600 mt-2">
            Complete the application process in 3 simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}>
                  {step < currentStep ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="font-medium">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
              Gold Details
            </span>
            <span className={currentStep >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
              Bank Details
            </span>
            <span className={currentStep >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
              Loan Amount
            </span>
          </div>
        </div>

        <Card>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Step 1: Gold Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Weight className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Gold/Silver Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Asset *
                  </label>
                  <select
                    value={goldDetails.type}
                    onChange={(e) => setGoldDetails(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    {goldTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (grams) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={goldDetails.weight}
                    onChange={(e) => setGoldDetails(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter weight"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purity *
                  </label>
                  <select
                    value={goldDetails.purity}
                    onChange={(e) => setGoldDetails(prev => ({ ...prev, purity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select purity</option>
                    {goldPurities.map((purity) => (
                      <option key={purity} value={purity}>{purity}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Value
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                    ₹{calculateEstimatedLoan().toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={goldDetails.description}
                  onChange={(e) => setGoldDetails(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your gold/silver items..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                    id="gold-images"
                  />
                  <label htmlFor="gold-images" className="cursor-pointer">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload images</p>
                    <p className="text-sm text-gray-500">
                      Upload clear photos of your gold/silver items (max 5 images, 5MB each)
                    </p>
                  </label>
                </div>

                {goldDetails.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {goldDetails.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Gold item ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-blue-700 text-sm">
                    <strong>Photography Tips:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Take photos in good lighting</li>
                      <li>Show all sides of the jewelry/items</li>
                      <li>Include any hallmarks or stamps</li>
                      <li>Ensure images are clear and focused</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Bank Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Bank Account Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Account Number *
                  </label>
                  <input
                    type="text"
                    value={bankDetails.confirmAccountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, confirmAccountNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Re-enter account number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., SBIN0001234"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={bankDetails.branchName}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, branchName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter branch name"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-yellow-700 text-sm">
                    <strong>Important:</strong> The loan amount will be directly transferred to this bank account.
                    Please ensure all details are correct to avoid delays in disbursement.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Loan Amount */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Loan Amount</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Asset Type:</span>
                    <span className="ml-2 font-medium">{goldDetails.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="ml-2 font-medium">{goldDetails.weight}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Purity:</span>
                    <span className="ml-2 font-medium">{goldDetails.purity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Loan Amount:</span>
                    <span className="ml-2 font-medium text-green-600">
                      ₹{calculateEstimatedLoan().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Loan Amount *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1000"
                    max={calculateEstimatedLoan()}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    placeholder="Enter loan amount"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Minimum: ₹1,000 | Maximum: ₹{calculateEstimatedLoan().toLocaleString()}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Loan Terms</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Interest Rate: 12% per annum</div>
                  <div>• Loan Tenure: Up to 12 months</div>
                  <div>• Processing Fee: Nil</div>
                  <div>• Prepayment: Allowed without penalty</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || loading}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              loading={loading}
              disabled={loading}
            >
              {currentStep === 3 ? (loading ? 'Submitting...' : 'Submit Application') : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoanApplication;