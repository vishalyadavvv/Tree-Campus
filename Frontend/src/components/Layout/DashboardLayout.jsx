import Sidebar from "./Sidebar";
import Footer from "../common/Footer";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar - Remains fixed top-112px below navbar */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="flex-1 transition-all duration-300 flex flex-col min-h-screen md:pl-64"
      >
        <main className="flex-1 p-4 md:p-8 fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
