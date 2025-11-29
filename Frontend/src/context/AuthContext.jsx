// client/src/context/AuthContext.jsx
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

  // Fetch fresh user data from server
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch('http://localhost:5000/api/auth/profile', {
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
      return data.user || data.data?.user || data;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Fetch fresh user data from server on page load
      const freshUser = await fetchUserProfile();

      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } else {
        // If fetch failed, try localStorage as fallback
        const rawUser = localStorage.getItem('user');
        
        if (rawUser && rawUser !== "null" && rawUser !== "undefined") {
          try {
            const savedUser = JSON.parse(rawUser);
            setUser(savedUser);
          } catch (e) {
            console.error('Failed to parse user from localStorage:', e);
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }

    } catch (err) {
      console.error('Auth check failed:', err);
      const rawUser = localStorage.getItem('user');
      if (rawUser && rawUser !== "null" && rawUser !== "undefined") {
        try {
          const savedUser = JSON.parse(rawUser);
          setUser(savedUser);
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(email, password);

      // FIXED: Check response properly
      if (!response.data || response.data.success === false) {
        throw new Error(response.data?.message || "Invalid email or password");
      }

      // Save tokens
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
      if (response.data?.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      // FIXED: Set user immediately for instant UI update
      if (response.data?.user) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData); // This triggers re-render

        // FIXED: Add role-based redirection here
        setTimeout(() => {
          if (userData.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        }, 100);
      }

      // FIXED: Return the data in the format Login.jsx expects
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };

    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
      
      // FIXED: Return error in correct format
      return {
        success: false,
        message: err.message || "Login failed"
      };
    } finally {
      setLoading(false);
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
      
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
      if (response.data?.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      if (response.data?.user) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // FIXED: Add role-based redirection for OTP verification too
        setTimeout(() => {
          if (userData.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        }, 100);
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'OTP verification failed');
      throw err;
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
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    console.log('Updating user context with:', userData);
    
    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        ...userData
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const refreshUser = async () => {
    try {
      const freshUser = await fetchUserProfile();
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
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