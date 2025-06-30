import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import {
  FileText,
  User,
  CreditCard,
  Building2,
  Weight,
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Flag
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface LoanApplication {
  id: string;
  requestId: string;
  userId: string;
  kycNumber: string;
  status: string;
  assetDetails: {
    type: string;
    weight: number;
    purity: string;
    description: string;
    imageUrls: string[];
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    accountHolderName: string;
  };
  requestedAmount: number;
  approvedAmount?: number;
  goldQualityIndex?: number;
  evaluationNotes?: string;
  suspiciousFlags?: string[];
  createdAt: string;
  updatedAt: string;
}

const ApplicationReview: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [suspiciousFlags, setSuspiciousFlags] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!requestId) {
        setError('No application ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.getLoanApplication(requestId);
        if (response.success && response.data) {
          setApplication(response.data);
          setSuspiciousFlags(response.data.suspiciousFlags || []);
        } else {
          setError(response.message || 'Failed to fetch application');
        }
      } catch (err) {
        setError('Failed to fetch application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The requested application could not be found.'}</p>
            <Button onClick={() => navigate('/bank/dashboard')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const suspiciousIndicators = [
    'Unusually high loan amount for asset weight',
    'Inconsistent document information',
    'Poor quality asset images',
    'Suspicious bank account details',
    'Multiple applications from same user',
    'Asset appears to be damaged or fake'
  ];

  const handleFlagToggle = (flag: string) => {
    setSuspiciousFlags(prev =>
      prev.includes(flag)
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setActionLoading(true);
    try {
      const response = await apiService.updateApplicationStatus(application.requestId, newStatus, notes);

      if (response.success) {
        navigate('/bank/dashboard');
      } else {
        // Handle error, maybe show a toast notification
        console.error('Failed to update status:', response.message);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const canApprove = suspiciousFlags.length === 0;
  const estimatedValue = application.assetDetails.weight * 5000 * 0.75; // Mock calculation

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
              <h1 className="text-3xl font-bold text-gray-900">Application Review</h1>
              <p className="text-gray-600">Request ID: {application.requestId}</p>
            </div>
          </div>
          <StatusBadge status={application.status} className="text-base px-3 py-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                  <div className="text-gray-900">{application.userId}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KYC Number</label>
                  <div className="text-gray-900">{application.kycNumber}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
                  <div className="text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <div className="text-gray-900">
                    {new Date(application.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Gold Details */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Weight className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Asset Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                  <div className="text-gray-900">{application.assetDetails.type}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <div className="text-gray-900">{application.assetDetails.weight} grams</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested Amount</label>
                  <div className="text-gray-900 font-semibold">₹{application.requestedAmount?.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                  <div className="text-green-600 font-semibold">₹{estimatedValue.toLocaleString()}</div>
                </div>
              </div>

              {application.assetDetails.description && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {application.assetDetails.description}
                  </div>
                </div>
              )}

              {/* Asset Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {application.assetDetails.imageUrls.length > 0 ? (
                    application.assetDetails.imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img src={url} alt={`Asset ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">No images uploaded.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Bank Details */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Bank Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                  <div className="text-gray-900">{application.bankDetails.accountHolderName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <div className="text-gray-900">{application.bankDetails.accountNumber}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <div className="text-gray-900">{application.bankDetails.bankName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <div className="text-gray-900">{application.bankDetails.ifscCode}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions and Flags */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add notes for approval, rejection, or further checks..."
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleStatusUpdate('APPROVED')}
                    disabled={actionLoading || !canApprove}
                    icon={CheckCircle}
                    className="flex-1"
                  >
                    {actionLoading ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('REJECTED')}
                    disabled={actionLoading}
                    icon={XCircle}
                    variant="danger"
                    className="flex-1"
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
                {!canApprove && (
                  <p className="text-sm text-red-600">
                    Cannot approve while suspicious flags are raised.
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Flag className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-800">Suspicious Flags</h3>
              </div>
              <div className="space-y-2">
                {suspiciousIndicators.map(flag => (
                  <label key={flag} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suspiciousFlags.includes(flag)}
                      onChange={() => handleFlagToggle(flag)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{flag}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;