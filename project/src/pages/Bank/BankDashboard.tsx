import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Search,
  RefreshCw
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

const BankDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycs, setKycs] = useState<any[]>([]); // Using any for now

  // Fetch applications from API
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [appResponse, kycResponse] = await Promise.all([
        apiService.getPendingApplications(),
        apiService.getPendingKYCs()
      ]);

      if (appResponse.success && appResponse.data) {
        setApplications(appResponse.data);
      } else {
        setError(appResponse.message || 'Failed to fetch applications');
      }

      if (kycResponse.success && kycResponse.data) {
        setKycs(kycResponse.data);
      } else {
        setError(kycResponse.message || 'Failed to fetch KYC submissions');
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.assetDetails.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => !['APPROVED', 'REJECTED', 'DISBURSED'].includes(app.status)).length,
    approved: applications.filter(app => app.status === 'APPROVED' || app.status === 'DISBURSED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    totalValue: applications.reduce((sum, app) => sum + (app.approvedAmount || app.requestedAmount || 0), 0)
  };

  const priorityApplications = applications
    .filter(app => ['SUBMITTED', 'UNDER_REVIEW'].includes(app.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5);

  const getUrgencyLevel = (createdAt: string) => {
    const hoursSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreated > 24) return 'high';
    if (hoursSinceCreated > 12) return 'medium';
    return 'low';
  };

  const getUrgencyColor = (level: string) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      SUBMITTED: 'text-blue-600 bg-blue-100',
      UNDER_REVIEW: 'text-yellow-600 bg-yellow-100',
      DOCUMENT_VERIFICATION: 'text-purple-600 bg-purple-100',
      PHYSICAL_VERIFICATION: 'text-indigo-600 bg-indigo-100',
      GOLD_EVALUATION: 'text-orange-600 bg-orange-100',
      OFFER_MADE: 'text-cyan-600 bg-cyan-100',
      APPROVED: 'text-green-600 bg-green-100',
      REJECTED: 'text-red-600 bg-red-100',
      DISBURSED: 'text-emerald-600 bg-emerald-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bank Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.name} ({user?.employeeId})
              </p>
            </div>
            <Button onClick={fetchAllData} icon={RefreshCw} variant="outline">
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ₹{(stats.totalValue / 100000).toFixed(1)}L
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Request ID or Asset Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="DOCUMENT_VERIFICATION">Document Verification</option>
            <option value="PHYSICAL_VERIFICATION">Physical Verification</option>
            <option value="GOLD_EVALUATION">Gold Evaluation</option>
            <option value="OFFER_MADE">Offer Made</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="DISBURSED">Disbursed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Priority Applications */}
          <div className="lg:col-span-1">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Priority Queue</h2>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>

              {priorityApplications.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-600">All caught up!</p>
                  <p className="text-sm text-gray-500">No urgent applications pending</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {priorityApplications.map((app) => {
                    const urgency = getUrgencyLevel(app.createdAt);
                    const urgencyColor = getUrgencyColor(urgency);

                    return (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            {app.requestId}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColor}`}>
                            {urgency} priority
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {app.assetDetails.type} • ₹{app.requestedAmount?.toLocaleString()}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                          <Link to={`/bank/review/${app.requestId}`}>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Pending KYC Reviews</h2>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              {kycs.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No pending KYCs.</div>
              ) : (
                <div className="space-y-3">
                  {kycs.map((kyc) => (
                    <div key={kyc._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="text-sm font-medium text-gray-900">{kyc.kycNumber}</div>
                      <div className="text-xs text-gray-600 mb-2">User ID: {kyc.userId}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(kyc.createdAt).toLocaleDateString()}
                        </span>
                        <Link to={`/bank/kyc/review/${kyc._id}`}>
                          <Button size="sm" variant="outline">Review KYC</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applications Reviewed</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-semibold text-gray-900">12</div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loans Approved</span>
                  <div className="text-lg font-semibold text-green-600">8</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Disbursed</span>
                  <div className="text-lg font-semibold text-primary-600">₹4.2L</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Processing Time</span>
                  <div className="text-lg font-semibold text-blue-600">2.3 hrs</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Applications List */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Applications</h2>
                <div className="text-sm text-gray-500">
                  Showing {filteredApplications.length} of {applications.length}
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Applications will appear here once customers submit them'
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3">Request ID</th>
                        <th scope="col" className="px-6 py-3">Asset Details</th>
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Submitted</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((application) => (
                        <tr key={application.requestId} className="bg-white border-b hover:bg-gray-50">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {application.requestId}
                          </th>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{application.assetDetails.type} ({application.assetDetails.weight}g)</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">₹{application.requestedAmount?.toLocaleString()}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                {application.status.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <Link to={`/bank/review/${application.requestId}`}>
                                <Button size="sm" variant="outline" icon={Eye}>
                                  Review
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDashboard;