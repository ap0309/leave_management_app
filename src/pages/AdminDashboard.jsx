import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LeaveList from '../components/LeaveList';
import { Users, Calendar, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalEmployees: 0,
    thisMonth: 0
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = () => {
    const allLeaves = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    
    // Get unique employees
    const uniqueEmployees = [...new Set(allLeaves.map(leave => leave.employeeEmail))];
    
    // Get current month applications
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthLeaves = allLeaves.filter(leave => {
      const leaveDate = new Date(leave.appliedDate);
      return leaveDate.getMonth() === currentMonth && leaveDate.getFullYear() === currentYear;
    });
    
    setStats({
      totalApplications: allLeaves.length,
      pending: allLeaves.filter(leave => leave.status === 'Pending').length,
      approved: allLeaves.filter(leave => leave.status === 'Approved').length,
      rejected: allLeaves.filter(leave => leave.status === 'Rejected').length,
      totalEmployees: uniqueEmployees.length,
      thisMonth: thisMonthLeaves.length
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage leave applications and track employee requests</p>
        </div>

        {/* Stats */}
        

        {/* Quick Actions */}

        {/* Leave Applications */}
        <div>
          <LeaveList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;