import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LeaveList from '../components/LeaveList';
import { Users, Calendar, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';

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

  // Add state for employee form
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [empLoading, setEmpLoading] = useState(false);
  const [empMessage, setEmpMessage] = useState('');

  const handleEmpChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
  };

  const handleEmpSubmit = async (e) => {
    e.preventDefault();
    setEmpLoading(true);
    setEmpMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/employees', employeeForm);
      setEmpMessage('Employee added successfully!');
      setEmployeeForm({ name: '', email: '', password: '', role: 'employee' });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setEmpMessage(err.response?.data?.error || 'Failed to add employee');
    }
    setEmpLoading(false);
  };

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

        {/* Add Employee Form */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Employee</h2>
          <form onSubmit={handleEmpSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={employeeForm.name} onChange={handleEmpChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={employeeForm.email} onChange={handleEmpChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" value={employeeForm.password} onChange={handleEmpChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" value={employeeForm.role} onChange={handleEmpChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <button type="submit" disabled={empLoading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{empLoading ? 'Adding...' : 'Add Employee'}</button>
              {empMessage && <span className={`text-sm ${empMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{empMessage}</span>}
            </div>
          </form>
        </div>

        {/* Leave Applications */}
        <div>
          <LeaveList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;