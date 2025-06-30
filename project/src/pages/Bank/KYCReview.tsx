import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { FileText, User, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import StatusBadge from '../../components/UI/StatusBadge';

interface KYC {
    _id: string;
    userId: string;
    kycNumber: string;
    status: string;
    aadhaarNumber: string;
    panNumber: string;
    drivingLicense?: string;
    passport?: string;
    aadhaarImageUrl?: string;
    panImageUrl?: string;
    drivingLicenseImageUrl?: string;
    passportImageUrl?: string;
    verificationNotes?: string;
    createdAt: string;
}

const KYCReview: React.FC = () => {
    const { kycId } = useParams<{ kycId: string }>();
    const navigate = useNavigate();

    const [kyc, setKyc] = useState<KYC | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchKyc = async () => {
            if (!kycId) {
                setError('No KYC ID provided');
                setLoading(false);
                return;
            }

            try {
                const response = await apiService.getKYCById(kycId);
                if (response.success && response.data) {
                    setKyc(response.data);
                } else {
                    setError(response.message || 'Failed to fetch KYC details');
                }
            } catch (err) {
                setError('Failed to fetch KYC details');
            } finally {
                setLoading(false);
            }
        };

        fetchKyc();
    }, [kycId]);

    const handleStatusUpdate = async (newStatus: 'VERIFIED' | 'REJECTED') => {
        if (!kyc) return;

        setActionLoading(true);
        try {
            const response = await apiService.updateKYCStatus(kyc._id, newStatus, notes);
            if (response.success) {
                navigate('/bank/dashboard');
            } else {
                setError(response.message || 'Failed to update status');
            }
        } catch (err) {
            setError('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
    }

    if (error || !kyc) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Card className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p className="text-red-600 mb-4">{error || 'KYC record could not be found.'}</p>
                        <Button onClick={() => navigate('/bank/dashboard')}>Back to Dashboard</Button>
                    </Card>
                </div>
            </div>
        );
    }

    const documents = [
        { label: 'Aadhaar Card', number: kyc.aadhaarNumber, url: kyc.aadhaarImageUrl },
        { label: 'PAN Card', number: kyc.panNumber, url: kyc.panImageUrl },
        { label: 'Driving License', number: kyc.drivingLicense, url: kyc.drivingLicenseImageUrl },
        { label: 'Passport', number: kyc.passport, url: kyc.passportImageUrl },
    ].filter(doc => doc.number);


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/bank/dashboard')}>
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">KYC Review</h1>
                    <p className="text-gray-600">KYC Number: {kyc.kycNumber}</p>
                    <StatusBadge status={kyc.status} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <div className="flex items-center space-x-2 mb-4">
                            <User className="h-6 w-6 text-primary-600" />
                            <h2 className="text-xl font-semibold">Applicant Details</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">User ID</label>
                                <p className="text-gray-900">{kyc.userId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Submission Date</label>
                                <p className="text-gray-900">{new Date(kyc.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-6 w-6 text-primary-600" />
                            <h2 className="text-xl font-semibold">Documents</h2>
                        </div>
                        <div className="space-y-4">
                            {documents.map(doc => (
                                <div key={doc.label}>
                                    <label className="block text-sm font-medium text-gray-500">{doc.label}</label>
                                    <p className="text-gray-900 font-mono">{doc.number}</p>
                                    {doc.url && <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">View Document</a>}
                                    {!doc.url && <p className="text-sm text-gray-400">No document uploaded</p>}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="md:col-span-2">
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Verification Actions</h2>
                            <textarea
                                id="notes"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Add verification notes (optional)..."
                            ></textarea>
                            <div className="mt-4 flex space-x-4">
                                <Button
                                    fullWidth
                                    variant="primary"
                                    icon={CheckCircle}
                                    loading={actionLoading}
                                    onClick={() => handleStatusUpdate('VERIFIED')}
                                >
                                    Approve KYC
                                </Button>
                                <Button
                                    fullWidth
                                    variant="danger"
                                    icon={XCircle}
                                    loading={actionLoading}
                                    onClick={() => handleStatusUpdate('REJECTED')}
                                >
                                    Reject KYC
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCReview; 