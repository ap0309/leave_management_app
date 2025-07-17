import React from 'react';
import { Calendar, Clock, FileText, User, Check, X } from 'lucide-react';

const LeaveCard = ({ leave, isAdmin, onApprove, onReject, onEditStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{leave.employeeName}</h3>
            <p className="text-sm text-gray-500">{leave.employeeEmail}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
          {leave.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {leave.numberOfDays} day{leave.numberOfDays > 1 ? 's' : ''} • {leave.leaveType}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
            <p className="text-sm text-gray-600">{leave.reason}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Applied on: {formatDate(leave.appliedDate)}</span>
      </div>

      {isAdmin && (
        <div className="flex flex-col gap-2">
          {leave.status === 'Pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => onApprove(leave._id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => onReject(leave._id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          )}
          {/* Edit status dropdown for admin */}
          <div className="flex items-center space-x-2 mt-2">
            <label className="text-sm text-gray-700 font-medium">Edit Status:</label>
            <select
              value={leave.status}
              onChange={e => onEditStatus && onEditStatus(leave._id, e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;