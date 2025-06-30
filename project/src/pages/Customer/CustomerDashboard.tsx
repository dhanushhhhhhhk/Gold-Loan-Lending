import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  CreditCard, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Eye,
  TrendingUp,
  Shield
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserApplications } = useData();
  
  const applications = getUserApplications(user?.id || '');
  const activeLoans = applications.filter(app => app.status === 'disbursed').length;
  const pendingApplications = applications.filter(app => !['approved', 'rejected', 'disbursed'].includes(app.status)).length;

  const stats = [
    {
      icon: CreditCard,
      label: 'Active Loans',
      value: activeLoans.toString(),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      label: 'Pending Applications',
      value: pendingApplications.toString(),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: FileText,
      label: 'Total Applications',
      value: applications.length.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: CheckCircle,
      label: 'KYC Status',
      value: user?.kycNumber ? 'Verified' : 'Pending',
      color: user?.kycNumber ? 'text-green-600' : 'text-yellow-600',
      bgColor: user?.kycNumber ? 'bg-green-100' : 'bg-yellow-100'
    }
  ];

  const quickActions = [
    {
      icon: Plus,
      title: 'Apply for New Loan',
      description: 'Start a new gold loan application',
      link: user?.kycNumber ? '/customer/apply' : '/customer/kyc',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      icon: Shield,
      title: 'Complete KYC',
      description: 'Verify your identity to apply for loans',
      link: '/customer/kyc',
      color: 'bg-secondary-600 hover:bg-secondary-700',
      hidden: !!user?.kycNumber
    },
    {
      icon: Eye,
      title: 'Track Applications',
      description: 'View the status of your applications',
      link: '/customer/status',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ].filter(action => !action.hidden);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your gold loans and applications from your dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* KYC Alert */}
        {!user?.kycNumber && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Complete Your KYC Verification</h3>
                <p className="text-yellow-700 mb-4">
                  To apply for gold loans, you need to complete your KYC verification process. 
                  It only takes a few minutes and ensures secure transactions.
                </p>
                <Link to="/customer/kyc">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Complete KYC Now
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <div className={`${action.color} text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 group`}>
                      <div className="flex items-center space-x-3">
                        <action.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm opacity-90">{action.description}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Market Rates */}
            <Card className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Gold Rates</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">22K Gold</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹5,450/gm</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +₹25
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">18K Gold</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹4,087/gm</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +₹18
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Silver</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹72/gm</div>
                    <div className="text-xs text-red-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                      -₹2
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3 text-center">
                Rates updated at 10:30 AM
              </div>
            </Card>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <Link to="/customer/status">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-4">You haven't submitted any loan applications yet.</p>
                  <Link to={user?.kycNumber ? '/customer/apply' : '/customer/kyc'}>
                    <Button icon={Plus}>
                      {user?.kycNumber ? 'Apply for Loan' : 'Complete KYC First'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">Request ID: {application.requestId}</h3>
                          <p className="text-sm text-gray-600">
                            {application.goldDetails.type} • {application.goldDetails.weight}g
                          </p>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Applied: {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                        {application.approvedAmount && (
                          <span className="font-medium text-green-600">
                            Approved: ₹{application.approvedAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Tips & Information */}
            <Card className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Helpful Tips</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-1 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Quick Approval:</strong> Complete applications with all required documents get approved faster.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Higher Loans:</strong> Higher purity gold (22K) gets better loan amounts.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-1 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Secure Storage:</strong> Your gold is safely stored in our secure vaults with full insurance.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;