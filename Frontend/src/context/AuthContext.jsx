import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const authTimestamp = localStorage.getItem('authTimestamp');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Check for 2-day expiration (48 hours)
      if (authTimestamp) {
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
        const timePassed = Date.now() - parseInt(authTimestamp);
        
        if (timePassed > twoDaysInMs) {
          console.log('Session expired (2 days). Logging out.');
          logout();
          return;
        }
      }

      // Try to get user from localStorage first (FAST)
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== "null" && savedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setLoading(false);
          
          // Refresh data in background (don't block UI)
          refreshUserInBackground();
          return;
        } catch (e) {
          console.error('Failed to parse saved user');
        }
      }

      // If no saved user, fetch from server
      await refreshUser();

    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('authTimestamp');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data in background (non-blocking)
  const refreshUserInBackground = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(import.meta.env.VITE_API_URL + '/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const freshUser = data.user || data.data;
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        }
      }
    } catch (err) {
      console.error('Background refresh failed:', err);
    }
  };

  const login = async (email, password, role = null) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(email, password, role);
      const apiData = response.data;

      if (!apiData || apiData.success === false) {
        throw new Error(apiData?.message || "Invalid email or password");
      }

      // Save tokens
      if (apiData.data?.accessToken) {
        localStorage.setItem('token', apiData.data.accessToken);
        localStorage.setItem('authTimestamp', Date.now().toString());
      }
      if (apiData.data?.refreshToken) {
        localStorage.setItem('refreshToken', apiData.data.refreshToken);
      }

      // Save user
      if (apiData.data?.user) {
        const userData = apiData.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      setLoading(false);

      return {
        success: apiData.success,
        user: apiData.data.user,
        message: apiData.message
      };

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "Login failed");
      setLoading(false);
      
      return {
        success: false,
        message: err.message || "Login failed",
        phone: err.phone
      };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setError(null);
      const response = await authService.verifyOTP(email, otp);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOTP = async (email) => {
    try {
      setError(null);
      const response = await authService.resendOTP(email);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authTimestamp');
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        ...userData,
        createdAt: prevUser?.createdAt || userData.createdAt
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(import.meta.env.VITE_API_URL + '/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      const freshUser = data.user || data.data;
      
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
      return null;
    }
  };

  const value = {
    user,
    setUser,
    updateUser,
    refreshUser,
    loading,
    setLoading,
    error,
    setError,
    login,
    logout,
    register,
    verifyOTP,
    resendOTP,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;