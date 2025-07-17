import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    loadStats();
    fetchLeaveBalances();
    fetchLeaveHistory();
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

  const fetchLeaveBalances = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/employees/${user.email}/leave-balance`);
      setLeaveBalances(res.data);
    } catch (err) {
      setLeaveBalances(null);
    }
  };

  const fetchLeaveHistory = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/employees/${user.email}/leave-history`);
      setLeaveHistory(res.data || []);
    } catch (err) {
      setLeaveHistory([]);
    }
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

        {/* Leave Balances */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['sick', 'casual', 'annual', 'maternity', 'paternity', 'emergency'].map(type => (
            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-xs text-gray-500 font-medium mb-1 capitalize">{type} Leave</div>
              <div className="text-2xl font-bold text-gray-900">{leaveBalances ? leaveBalances[type] ?? 0 : 0}</div>
            </div>
          ))}
        </div>

        {/* Leave History */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Leave History</h2>
          {leaveHistory.length === 0 ? (
            <div className="text-gray-500">No leave history found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map((leave) => (
                    <tr key={leave._id}>
                      <td className="px-4 py-2 text-sm">{leave.leaveType}</td>
                      <td className="px-4 py-2 text-sm">{leave.fromDate}</td>
                      <td className="px-4 py-2 text-sm">{leave.toDate}</td>
                      <td className="px-4 py-2 text-sm">{leave.numberOfDays || 1}</td>
                      <td className="px-4 py-2 text-sm capitalize">{leave.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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