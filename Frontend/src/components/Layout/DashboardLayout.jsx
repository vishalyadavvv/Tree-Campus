import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

const DashboardLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - manages its own collapse state */}
      <Sidebar />

      {/* Content Area - with responsive margin */}
      <div
        className="flex flex-col w-full transition-all duration-300 md:ml-64"
      >
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
