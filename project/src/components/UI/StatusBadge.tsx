import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Submitted' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Under Review' },
      document_verification: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Document Verification' },
      physical_verification: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Physical Verification' },
      gold_evaluation: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Gold Evaluation' },
      offer_made: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Offer Made' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      disbursed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Disbursed' },
      pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' },
      verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verified' }
    };

    return statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  };

  const { bg, text, label } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;