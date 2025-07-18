// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  LEAVES: `${API_BASE_URL}/api/leaves`,
  EMPLOYEES: `${API_BASE_URL}/api/employees`,
  LEAVE_BALANCE: (email) => `${API_BASE_URL}/api/employees/${email}/leave-balance`,
  LEAVE_HISTORY: (email) => `${API_BASE_URL}/api/employees/${email}/leave-history`,
  UPDATE_LEAVE_BALANCE: (email) => `${API_BASE_URL}/api/employees/${email}/leave-balance`,
};

export default API_BASE_URL; 