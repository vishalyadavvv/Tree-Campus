// client/src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
  const { user, loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route protection
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Student-only route protection
  if (studentOnly && user.role !== 'student') {
    return <Navigate to="/admin" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;