import React from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CouponGenerator from "../Contest/CouponGenerator";
import { motion } from "framer-motion";

export default function CouponManagement() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Coupon Management</h1>
          <p className="text-gray-500 mt-1">Generate and track scholarship coupons for contest winners</p>
        </div>

        {/* Coupon Generator Component */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          <CouponGenerator />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
