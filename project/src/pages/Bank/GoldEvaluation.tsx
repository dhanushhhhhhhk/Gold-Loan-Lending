import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { 
  Weight, 
  Eye, 
  Calculator, 
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Star,
  Camera
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';

const GoldEvaluation: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { getApplicationById, updateApplicationStatus } = useData();
  const navigate = useNavigate();
  
  const [evaluation, setEvaluation] = useState({
    actualWeight: '',
    purityVerified: '',
    qualityIndex: '',
    marketRate: '5450',
    loanPercentage: '75',
    evaluationNotes: '',
    physicalCondition: 'excellent'
  });
  
  const [loading, setLoading] = useState(false);
  
  const application = getApplicationById(applicationId || '');

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <Weight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-4">The requested application could not be found.</p>
            <Button onClick={() => navigate('/bank/dashboard')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const calculateLoanAmount = () => {
    const weight = parseFloat(evaluation.actualWeight) || 0;
    const rate = parseFloat(evaluation.marketRate) || 0;
    const percentage = parseFloat(evaluation.loanPercentage) || 0;
    return Math.floor(weight * rate * (percentage / 100));
  };

  const calculateQualityIndex = () => {
    const baseScore = 70;
    const purityBonus = evaluation.purityVerified === '22K' ? 20 : evaluation.purityVerified === '18K' ? 15 : 10;
    const conditionBonus = evaluation.physicalCondition === 'excellent' ? 10 : 
                          evaluation.physicalCondition === 'good' ? 5 : 0;
    return Math.min(100, baseScore + purityBonus + conditionBonus);
  };

  const handleInputChange = (field: string, value: string) => {
    setEvaluation(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitEvaluation = async () => {
    setLoading(true);
    try {
      const qualityIndex = calculateQualityIndex();
      const approvedAmount = calculateLoanAmount();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateApplicationStatus(application.id, 'offer_made', {
        goldQualityIndex: qualityIndex,
        approvedAmount,
        evaluationNotes: evaluation.evaluationNotes,
        evaluatedAt: new Date(),
        actualWeight: parseFloat(evaluation.actualWeight),
        verifiedPurity: evaluation.purityVerified
      });
      
      navigate('/bank/dashboard');
    } catch (error) {
      console.error('Failed to submit evaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = evaluation.actualWeight && evaluation.purityVerified && evaluation.qualityIndex;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="outline" 
              icon={ArrowLeft} 
              onClick={() => navigate('/bank/dashboard')}
            >
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gold Evaluation</h1>
              <p className="text-gray-600">Request ID: {application.requestId}</p>
            </div>
          </div>
          <StatusBadge status={application.status} className="text-base px-3 py-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Details */}
          <div className="space-y-6">
            {/* Asset Information */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Weight className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Asset Information</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                  <div className="text-gray-900">{application.goldDetails.type}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Declared Weight</label>
                  <div className="text-gray-900">{application.goldDetails.weight}g</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested Amount</label>
                  <div className="text-gray-900 font-semibold">₹{application.loanAmount?.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
                  <div className="text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {application.goldDetails.description && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Description</label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {application.goldDetails.description}
                  </div>
                </div>
              )}

              {/* Asset Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Asset Images</label>
                <div className="grid grid-cols-2 gap-4">
                  {application.goldDetails.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Asset ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => window.open(image, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Market Rates */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Current Market Rates</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-gray-900">24K Gold</span>
                  <span className="text-lg font-bold text-yellow-600">₹5,800/gm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-gray-900">22K Gold</span>
                  <span className="text-lg font-bold text-yellow-600">₹5,450/gm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">18K Gold</span>
                  <span className="text-lg font-bold text-gray-600">₹4,087/gm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Silver</span>
                  <span className="text-lg font-bold text-gray-600">₹72/gm</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-3 text-center">
                Rates updated at 10:30 AM today
              </div>
            </Card>
          </div>

          {/* Evaluation Form */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Physical Evaluation</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Weight (grams) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={evaluation.actualWeight}
                      onChange={(e) => handleInputChange('actualWeight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter actual weight"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verified Purity *
                    </label>
                    <select
                      value={evaluation.purityVerified}
                      onChange={(e) => handleInputChange('purityVerified', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select purity</option>
                      <option value="24K">24K (99.9%)</option>
                      <option value="22K">22K (91.6%)</option>
                      <option value="18K">18K (75%)</option>
                      <option value="14K">14K (58.3%)</option>
                      <option value="Silver">Silver (92.5%)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Condition
                  </label>
                  <select
                    value={evaluation.physicalCondition}
                    onChange={(e) => handleInputChange('physicalCondition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Rate (₹/gm)
                    </label>
                    <input
                      type="number"
                      value={evaluation.marketRate}
                      onChange={(e) => handleInputChange('marketRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="85"
                      value={evaluation.loanPercentage}
                      onChange={(e) => handleInputChange('loanPercentage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluation Notes
                  </label>
                  <textarea
                    value={evaluation.evaluationNotes}
                    onChange={(e) => handleInputChange('evaluationNotes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add detailed evaluation notes..."
                  />
                </div>
              </div>
            </Card>

            {/* Calculation Summary */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Loan Calculation</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <span className="ml-2 font-medium">{evaluation.actualWeight || '0'}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Rate:</span>
                      <span className="ml-2 font-medium">₹{evaluation.marketRate}/gm</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Loan %:</span>
                      <span className="ml-2 font-medium">{evaluation.loanPercentage}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quality Index:</span>
                      <span className="ml-2 font-medium">{calculateQualityIndex()}/100</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Approved Loan Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{calculateLoanAmount().toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Quality Rating */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 font-medium">Gold Quality Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${
                            i < Math.floor(calculateQualityIndex() / 20) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-blue-600">
                    Score: {calculateQualityIndex()}/100 - {
                      calculateQualityIndex() >= 90 ? 'Excellent' :
                      calculateQualityIndex() >= 80 ? 'Very Good' :
                      calculateQualityIndex() >= 70 ? 'Good' :
                      calculateQualityIndex() >= 60 ? 'Fair' : 'Poor'
                    }
                  </div>
                </div>
              </div>
            </Card>

            {/* Submit Evaluation */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Evaluation</h2>
              
              {!isFormValid && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-yellow-700 text-sm">
                      Please complete all required fields before submitting the evaluation.
                    </div>
                  </div>
                </div>
              )}

              <Button
                fullWidth
                size="lg"
                icon={CheckCircle}
                onClick={handleSubmitEvaluation}
                disabled={!isFormValid || loading}
                loading={loading}
              >
                {loading ? 'Submitting Evaluation...' : 'Submit Evaluation & Generate Offer'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldEvaluation;