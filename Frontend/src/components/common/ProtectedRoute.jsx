import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
  const { user, loading } = useAuth();

  // ⛔ IMPORTANT FIX: Wait for auth check to finish
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl font-semibold">
        Checking authentication...
      </div>
    );
  }

  // If still no user after loading → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Student-only route
  if (studentOnly && user.role !== "student") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
