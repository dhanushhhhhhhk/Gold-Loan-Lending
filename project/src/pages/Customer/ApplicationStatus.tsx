import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface LoanApplication {
  id: string;
  requestId: string;
  status: string;
  assetDetails: {
    type: string;
    weight: number;
    purity: string;
  };
  requestedAmount: number;
  approvedAmount?: number;
  createdAt: string;
}

const ApplicationStatus: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const newApplicationId = location.state?.newApplication;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await apiService.getLoanApplications(user.id);
        if (response.success && response.data) {
          setApplications(response.data);
        } else {
          setError(response.message || 'Failed to fetch applications.');
        }
      } catch (err) {
        setError('An error occurred while fetching applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getProgressPercentage = (status: string) => {
    const progressMap: Record<string, number> = {
      SUBMITTED: 10,
      UNDER_REVIEW: 20,
      DOCUMENT_VERIFICATION: 35,
      PHYSICAL_VERIFICATION: 50,
      GOLD_EVALUATION: 70,
      OFFER_MADE: 85,
      APPROVED: 90,
      DISBURSED: 100,
      REJECTED: 100
    };
    return progressMap[status] || 0;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-xl text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
            <p className="text-gray-600 mt-2">Track the progress of your loan applications</p>
          </div>
          <Card className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h2>
            <p className="text-gray-600 mb-4">You haven't submitted any loan applications yet.</p>
            <Button onClick={() => navigate('/customer/apply')}>
              Apply for Loan
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
          <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
          <p className="text-gray-600 mt-2">Track the progress of your loan applications</p>
        </div>

        {newApplicationId && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-1">Application Submitted Successfully!</h3>
                <p className="text-green-700 text-sm">
                  Your loan application has been submitted with Request ID: <strong>{newApplicationId}</strong>.
                  You will receive updates via email and SMS.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {applications.map((application) => {
            const progress = getProgressPercentage(application.status);
            return (
              <Card key={application.id} className="overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Request ID: {application.requestId}
                    </h3>
                    <p className="text-gray-600">
                      {application.assetDetails.type} • {application.assetDetails.weight}g • {application.assetDetails.purity}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${application.status === 'REJECTED' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Applied Amount</div>
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{application.requestedAmount?.toLocaleString()}
                    </div>
                  </div>

                  {application.approvedAmount && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-sm text-green-600">Approved Amount</div>
                      <div className="text-lg font-semibold text-green-700">
                        ₹{application.approvedAmount.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600">Application Date</div>
                    <div className="text-sm font-medium text-blue-700">
                      {new Date(application.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;