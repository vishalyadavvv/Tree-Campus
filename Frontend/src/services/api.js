// client/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Changed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Don't redirect on login page for 401 errors - let the component handle it
      if (error.response.status === 401 && window.location.pathname === '/login') {
        return Promise.reject(error);
      }
      
      if (error.response.status === 401) {
        localStorage.removeItem('token'); // Changed
        window.location.href = '/login';
      }

      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data?.message || 'No message provided');
      }
      if (error.response.status === 404) console.error('Resource not found');
      if (error.response.status === 500) console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default api;