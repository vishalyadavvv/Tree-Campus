import Sidebar from "./Sidebar";
import Footer from "../common/Footer";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar - Remains fixed top-112px below navbar */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="transition-all duration-300 flex flex-col min-h-screen md:ml-64 w-full md:w-[calc(100%-16rem)]"
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
