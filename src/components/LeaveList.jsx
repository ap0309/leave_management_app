import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LeaveCard from './LeaveCard';
import { toast } from 'react-toastify';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaves';

const LeaveList = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadLeaves();
    // eslint-disable-next-line
  }, [refreshTrigger]);

  useEffect(() => {
    filterLeaves();
    // eslint-disable-next-line
  }, [leaves, searchTerm, statusFilter]);

  const loadLeaves = async () => {
    try {
      const res = await axios.get(API_URL);
      let allLeaves = res.data;
      if (user.role !== 'admin') {
        allLeaves = allLeaves.filter(leave => leave.employeeEmail === user.email);
      }
      setLeaves(allLeaves);
    } catch (err) {
      toast.error('Failed to load leave applications');
    }
  };

  const filterLeaves = () => {
    let filtered = leaves;

    if (searchTerm) {
      filtered = filtered.filter(leave => 
        leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(leave => leave.status === statusFilter);
    }

    setFilteredLeaves(filtered);
  };

  const handleApprove = async (leaveId) => {
    await updateLeaveStatus(leaveId, 'Approved');
    toast.success('Leave approved successfully!');
  };

  const handleReject = async (leaveId) => {
    await updateLeaveStatus(leaveId, 'Rejected');
    toast.success('Leave rejected successfully!');
  };

  const updateLeaveStatus = async (leaveId, newStatus) => {
    try {
      await axios.put(`${API_URL}/${leaveId}`, { status: newStatus });
      loadLeaves();
    } catch (err) {
      toast.error('Failed to update leave status');
    }
  };

  // Add handler for editing status
  const handleEditStatus = async (leaveId, newStatus) => {
    await updateLeaveStatus(leaveId, newStatus);
    toast.success('Leave status updated!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {user.role === 'admin' ? 'All Leave Applications' : 'My Leave Applications'}
        </h2>
        <div className="text-sm text-gray-500">
          {filteredLeaves.length} of {leaves.length} applications
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Leave Cards */}
      <div className="space-y-4">
        {filteredLeaves.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No leave applications found.</p>
          </div>
        ) : (
          filteredLeaves.map(leave => (
            <LeaveCard
              key={leave._id}
              leave={leave}
              isAdmin={user.role === 'admin'}
              onApprove={handleApprove}
              onReject={handleReject}
              onEditStatus={handleEditStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveList;