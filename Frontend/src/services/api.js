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
    const token = sessionStorage.getItem('token'); // Changed
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
      if (error.response.status === 401) {
        sessionStorage.removeItem('token'); // Changed
        window.location.href = '/login';
      }

      if (error.response.status === 403) console.error('Access forbidden');
      if (error.response.status === 404) console.error('Resource not found');
      if (error.response.status === 500) console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default api;