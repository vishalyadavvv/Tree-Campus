// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

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
      const token = sessionStorage.getItem('token');

      if (!token) return null;

      const response = await fetch('http://localhost:4000/api/auth/profile', {
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
      const token = sessionStorage.getItem('token');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Fetch fresh user data from server on page load
      const freshUser = await fetchUserProfile();

      if (freshUser) {
        setUser(freshUser);
         sessionStorage.setItem('user', JSON.stringify(freshUser));
      } else {
        // If fetch failed, try localStorage as fallback
          const rawUser = sessionStorage.getItem('user');
        
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

    console.log('✅ Full API response:', response);
    console.log('✅ Response data:', response.data);

    // authService returns the FULL axios response object
    // So backend data is at: response.data
    // Backend structure: response.data = { success, message, data: { user, accessToken, refreshToken } }
    
    const apiData = response.data; // This is your backend's response
    
    if (!apiData || apiData.success === false) {
      throw new Error(apiData?.message || "Invalid email or password");
    }

    // Save tokens - they're inside apiData.data (backend's nested "data" key)
    if (apiData.data?.accessToken) {
      sessionStorage.setItem('token', apiData.data.accessToken);
      console.log('✅ Token saved');
    }
    if (apiData.data?.refreshToken) {
      sessionStorage.setItem('refreshToken', apiData.data.refreshToken);
      console.log('✅ Refresh token saved');
    }

    // Save user - also inside apiData.data
    if (apiData.data?.user) {
      const userData = apiData.data.user;
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('✅ User saved:', userData);
    }

    setLoading(false);

    // Return in the format Login.jsx expects
    return {
      success: apiData.success,
      user: apiData.data.user,
      message: apiData.message
    };

  } catch (err) {
    console.error('❌ Login error in AuthContext:', err);
    
    setError(err.message || "Login failed");
    setLoading(false);
    
    return {
      success: false,
      message: err.message || "Login failed"
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

    // MUST return response.data
    return response.data;

  } catch (err) {
    throw new Error(
      err.response?.data?.message || "OTP verification failed"
    );
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
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
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
      
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const refreshUser = async () => {
    try {
      const freshUser = await fetchUserProfile();
      if (freshUser) {
        setUser(freshUser);
       sessionStorage.setItem('user', JSON.stringify(freshUser));
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