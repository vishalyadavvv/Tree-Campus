import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome,
  FiBook,
  FiUsers,
  FiBarChart2,
  FiVideo,
  FiFileText,
  FiMenu,
  FiX,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiBell,
  FiSearch,
  FiSettings,
  FiUserX
} from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  // Primary color configuration
  const primaryColor = "#FD5A00";
  const primaryLight = "#FF8A3D";
  const primaryDark = "#D44A00";

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const adminMenuItems = [
    { path: "/admin", icon: FiHome, label: "Dashboard", section: "main" },
    { path: "/admin/courses", icon: FiBook, label: "Courses", section: "main" },
    { path: "/admin/studentanalytics", icon: FiUsers, label: "Students", section: "main" },
    { path: "/admin/analytics", icon: FiBarChart2, label: "Analytics", section: "main" },
    { path: "/admin/live-classes", icon: FiVideo, label: "Live Classes", section: "main" },
    { path: "/admin/blogs", icon: FiFileText, label: "Blogs", section: "main" },
    { type: "divider", label: "Management", section: "divider" },
    { path: "/admin/schools", icon: FiSettings, label: "School Registrations", section: "management" },
    { path: "/admin/volunteers", icon: FiUsers, label: "Volunteers", section: "management" },
    { path: "/admin/account-deletions", icon: FiUserX, label: "Account Deletions", section: "management" },
  ];

  const studentMenuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/courses', icon: FiBook, label: 'Courses' },
    { path: '/certificates', icon: FiAward, label: 'Certificates' },
    { path: '/live-classes', icon: FiVideo, label: 'Live Classes' },
    { path: '/blogs', icon: FiFileText, label: 'Blogs' }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems;
  const title = user?.role === 'admin' ? 'Tree Campus Admin' : 'Tree Campus Student';
  const subtitle = user?.role === 'admin' ? 'Dashboard' : 'Portal';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Function to handle user initials
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[#FD5A00] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        style={{ backgroundColor: primaryColor }}
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Backdrop for mobile - Fixed to cover entire screen */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="transition-opacity duration-300"
        />
      )}

      {/* Sidebar - Fixed positioning */}
      <aside
        className={`
          fixed md:absolute z-10 h-screen transition-all duration-300 ease-in-out w-64
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-white border-r border-gray-200 shadow-xl
        `}
        style={{ backgroundColor: 'white', color: '#374151' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand Section */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 
                  className="text-lg font-bold"
                  style={{ color: primaryColor }}
                >
                  {title}
                </h2>
                <p className="text-xs text-gray-600">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-2.5 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md text-xs"
                style={{ backgroundColor: primaryColor }}
              >
                {getUserInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-3">
            <ul className="space-y-0.5">
              {menuItems.map((item, index) => {
                // Render divider
                if (item.type === 'divider') {
                  return (
                    <li key={`divider-${index}`} className="py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
                          {item.label}
                        </span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                    </li>
                  );
                }

                // Render menu item
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center transition-all duration-300 rounded-xl px-4 py-2
                        ${isActive 
                          ? 'text-white shadow-md' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                      style={isActive ? { backgroundColor: primaryColor } : {}}
                    >
                      <div className="relative">
                        <Icon size={20} />
                        {isActive && (
                          <div className="absolute -right-1 -top-1 w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <span className="ml-3 font-medium flex-1">{item.label}</span>
                      {isActive && (
                        <FiChevronRight size={16} className="ml-auto" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-2.5 border-t border-gray-200">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 transition-all duration-300 rounded-xl text-gray-700 hover:text-white"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              <FiLogOut size={20} />
              <span className="ml-3 font-medium">Logout</span>
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
            >
              Close Menu
            </button>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(253, 90, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${primaryColor};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${primaryDark};
        }
      `}</style>
    </>
  );
};

export default Sidebar;
