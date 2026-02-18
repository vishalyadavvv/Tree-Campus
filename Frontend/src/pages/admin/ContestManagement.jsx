import React, { useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import AdminPanel from "../Contest/AdminPanel";
import AdminTables from "../Contest/AdminTables";
import { motion } from "framer-motion";

export default function ContestManagement() {
  const [activeTab, setActiveTab] = useState("manage"); // "manage" or "reports"
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/contest/exams`, {
           headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch exams");
      const data = await response.json();
      setAllExams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "reports") {
      fetchExams();
    }
  }, [activeTab]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contest Management</h1>
            <p className="text-gray-500 mt-1">Create exams, manage questions, and view participant reports</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "manage"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Management
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "reports"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === "manage" ? (
             <AdminPanel />
          ) : (
             loading ? (
                <div className="py-20 flex justify-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
             ) : (
                <AdminTables allExams={allExams} />
             )
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
