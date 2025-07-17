import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = () => {
    const allLeaves = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    const userLeaves = allLeaves.filter(leave => leave.employeeEmail === user.email);
    
    setStats({
      total: userLeaves.length,
      pending: userLeaves.filter(leave => leave.status === 'Pending').length,
      approved: userLeaves.filter(leave => leave.status === 'Approved').length,
      rejected: userLeaves.filter(leave => leave.status === 'Rejected').length
    });
  };

  const handleLeaveSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your leave applications and track their status</p>
        </div>

        {/* Stats */}
        

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Leave Form */}
          <div className="xl:col-span-1">
            <LeaveForm onLeaveSubmitted={handleLeaveSubmitted} />
          </div>

          {/* Leave List */}
          <div className="xl:col-span-2">
            <LeaveList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;