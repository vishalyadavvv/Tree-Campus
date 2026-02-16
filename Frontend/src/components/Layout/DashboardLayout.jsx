import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar - Now correctly fixed and responsive */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 transition-all duration-300 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
