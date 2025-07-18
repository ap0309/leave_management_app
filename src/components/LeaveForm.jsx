import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar, FileText, Clock } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const LeaveForm = ({ onLeaveSubmitted }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    leaveType: 'Sick',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const leaveTypes = ['Sick', 'Casual', 'Annual', 'Maternity', 'Paternity', 'Emergency'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate dates
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (fromDate < today) {
      toast.error('From date cannot be in the past');
      setLoading(false);
      return;
    }

    if (toDate < fromDate) {
      toast.error('To date cannot be earlier than from date');
      setLoading(false);
      return;
    }

    // Calculate number of days
    const timeDiff = toDate.getTime() - fromDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Create leave application
    const leaveApplication = {
      employeeEmail: user.email,
      employeeName: user.name,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      leaveType: formData.leaveType,
      reason: formData.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString(),
      numberOfDays: daysDiff
    };

    try {
      await axios.post(API_ENDPOINTS.LEAVES, leaveApplication);
      toast.success('Leave application submitted successfully!');
      setFormData({
        fromDate: '',
        toDate: '',
        leaveType: 'Sick',
        reason: ''
      });
      if (onLeaveSubmitted) {
        onLeaveSubmitted();
      }
    } catch (err) {
      toast.error('Failed to submit leave application');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Apply for Leave</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="fromDate"
                required
                value={formData.fromDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="toDate"
                required
                value={formData.toDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="reason"
              required
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide a reason for your leave request..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Leave Application'}
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;