import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import AdminPanel from '../../components/contest/AdminPanel';
import CouponGenerator from '../../components/contest/CouponGenerator';
import AdminTables from '../../components/contest/AdminTables';
import UserList from '../../components/contest/UserList';

export default function ContestAdminDashboard() {
  const location = useLocation();
  
  // Helper to get query param
  const getSectionFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('section') || 'adminPanel';
  };

  const [activeSection, setActiveSection] = useState(getSectionFromURL());

  // Update active section when URL change
  useEffect(() => {
    setActiveSection(getSectionFromURL());
  }, [location.search]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-transparent text-stone-900 font-sans p-2">
        <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                {activeSection === 'adminPanel' && '🛠️ Contest Creation & Management'}
                {activeSection === 'couponGenerator' && '🎟️ Coupon Administration'}
                {activeSection === 'adminTables' && '📊 Contest Performance & Reports'}
                {activeSection === 'users' && '👥 Global User Directory'}
            </h1>
            <p className="text-gray-500 mt-1">
                Manage your contest platform settings and rewards.
            </p>
        </header>

        <AnimatePresence mode="wait">
          {activeSection === 'adminPanel' && (
            <motion.div
              key="adminPanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel />
            </motion.div>
          )}
          
          {activeSection === 'couponGenerator' && (
            <motion.div
              key="couponGenerator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CouponGenerator />
            </motion.div>
          )}
          
          {activeSection === 'adminTables' && (
            <motion.div
              key="adminTables"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminTables />
            </motion.div>
          )}

          {activeSection === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <UserList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
