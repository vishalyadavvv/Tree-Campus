// client/src/services/authService.js
import api from './api';

export const authService = {
  
  // -------------------------
  // REGISTER
  // -------------------------
  register: async (userData) => {
    try {
      const res = await api.post('/auth/signup', userData);
      return res.data; // success, message, userId, email
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // VERIFY OTP
  // -------------------------
  verifyOTP: async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      return res.data; // contains tokens + user
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // RESEND OTP
  // -------------------------
  resendOTP: async (email) => {
    try {
      const res = await api.post('/auth/resend-otp', { email });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // LOGIN
  // -------------------------
  login: async (email, password, role = null) => {
    try {
      const payload = { email, password };
      if (role) payload.role = role;
      const res = await api.post('/auth/login', payload);
      return res;// MUST include accessToken, refreshToken, user
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // GET LOGGED-IN USER
  // -------------------------
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data.data; // backend returns { data: { user } }
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // UPDATE PROFILE
  // -------------------------
  updateProfile: async (userData) => {
    try {
      // adjust to correct backend route
      const res = await api.put('/users/profile', userData);

      return res.data.data; // updated user
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // UPDATE PASSWORD
  // -------------------------
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/auth/updatepassword', {
        currentPassword,
        newPassword,
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // FORGOT PASSWORD
  // -------------------------
  forgotPassword: async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // RESET PASSWORD
  // -------------------------
  resetPassword: async (token, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // -------------------------
  // LOGOUT
  // -------------------------
  logout: async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/auth/logout');
    }
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authTimestamp');
  }
},
};
