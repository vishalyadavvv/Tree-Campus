import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
  const { user, loading } = useAuth();

  // ⛔ IMPORTANT FIX: Wait for auth check to finish
  if (loading) {
    console.log('⏳ Auth still loading...');
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl font-semibold">
        Checking authentication...
      </div>
    );
  }

  // If still no user after loading → redirect
  if (!user) {
    console.log('❌ No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // ⭐ ENFORCE VERIFICATION
  if (user.isVerified === false) {
    console.log('🟠 User not verified, redirecting to verification page');
    return <Navigate to="/verify-otp" replace state={{ email: user.email, phone: user.phone, mode: 'register' }} />;
  }

  console.log('🛡️ ProtectedRoute Check:', {
    user: user?.email,
    role: user?.role,
    adminOnly,
    studentOnly,
    path: window.location.pathname
  });

  // ⭐ FIX: Only redirect if user.role is DEFINED and doesn't match
  // This prevents redirects when role is still loading
  if (adminOnly) {
    if (!user.role) {
      console.log('⏳ User role not loaded yet, waiting...');
      return (
        <div className="w-full h-screen flex items-center justify-center text-xl font-semibold">
          Loading...
        </div>
      );
    }
    if (user.role !== "admin") {
      console.log('❌ Admin route but user is not admin, redirecting to /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Student-only route
  if (studentOnly) {
    if (!user.role) {
      console.log('⏳ User role not loaded yet, waiting...');
      return (
        <div className="w-full h-screen flex items-center justify-center text-xl font-semibold">
          Loading...
        </div>
      );
    }
    if (user.role !== "student") {
      console.log('❌ Student route but user is not student, redirecting to /admin');
      return <Navigate to="/admin" replace />;
    }
  }

  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;
