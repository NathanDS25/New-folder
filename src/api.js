// Centralized API handler with Frontend Mock Mode fallback
const BASE_URL = 'http://localhost:5000/api';

const isProduction = !window.location.hostname.includes('localhost');

const getMockData = (key, defaultData = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultData;
};

const setMockData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize Mock Store if empty
if (!localStorage.getItem('mock_rooms')) {
  setMockData('mock_rooms', [
    { _id: 'r1', roomNumber: '101', capacity: 1, occupants: [], type: 'single', fees: 500 },
    { _id: 'r2', roomNumber: '102', capacity: 2, occupants: [], type: 'double', fees: 300 },
    { _id: 'r3', roomNumber: '103', capacity: 4, occupants: [], type: 'dorm', fees: 150 },
  ]);
}

const api = {
  async get(url, config = {}) {
    if (isProduction) {
      if (url.includes('/auth/me')) {
        const user = getMockData('auth_user', null);
        return { data: { success: true, user } };
      }
      if (url.includes('/rooms')) {
        return { data: { success: true, data: getMockData('mock_rooms') } };
      }
      if (url.includes('/leaves')) {
        return { data: { success: true, data: getMockData('mock_leaves') } };
      }
      if (url.includes('/visitors')) {
        return { data: { success: true, data: getMockData('mock_visitors') } };
      }
      if (url.includes('/analytics')) {
        return { data: { success: true, data: { totalRevenue: 1250, totalBeds: 20, availableBeds: 12, studentCount: 8, openComplaints: 2 } } };
      }
    }
    
    // Fallback to real axios for local dev (this will fail on Vercel which is what we want)
    const axios = (await import('axios')).default;
    return axios.get(url, config);
  },

  async post(url, data, config = {}) {
    if (isProduction) {
      if (url.includes('/auth/register') || url.includes('/auth/login')) {
        const user = { _id: 'u' + Date.now(), name: data.name || 'User', email: data.email, role: data.role || 'Student' };
        setMockData('auth_user', user);
        localStorage.setItem('token', 'mock_token_' + Date.now());
        return { data: { success: true, token: 'mock_token', user } };
      }
      if (url.includes('/leaves')) {
        const leaves = getMockData('mock_leaves');
        const newLeave = { ...data, _id: 'l' + Date.now(), status: 'Pending', createdAt: new Date() };
        setMockData('mock_leaves', [newLeave, ...leaves]);
        return { data: { success: true, data: newLeave } };
      }
      if (url.includes('/visitors')) {
        const visitors = getMockData('mock_visitors');
        const newVisitor = { ...data, _id: 'v' + Date.now(), createdAt: new Date() };
        setMockData('mock_visitors', [newVisitor, ...visitors]);
        return { data: { success: true, data: newVisitor } };
      }
    }
    const axios = (await import('axios')).default;
    return axios.post(url, data, config);
  },

  async put(url, data, config = {}) {
    if (isProduction) {
      if (url.includes('/leaves/')) {
        const id = url.split('/').pop();
        const leaves = getMockData('mock_leaves');
        const updated = leaves.map(l => l._id === id ? { ...l, ...data } : l);
        setMockData('mock_leaves', updated);
        return { data: { success: true } };
      }
      if (url.includes('/visitors/')) {
        const id = url.split('/').pop();
        const visitors = getMockData('mock_visitors');
        const updated = visitors.map(v => v._id === id ? { ...v, timeOut: new Date() } : v);
        setMockData('mock_visitors', updated);
        return { data: { success: true } };
      }
    }
    const axios = (await import('axios')).default;
    return axios.put(url, data, config);
  }
};

export default api;
