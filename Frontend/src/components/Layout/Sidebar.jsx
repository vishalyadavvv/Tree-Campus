import { useState, useEffect, useRef } from "react";
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
  FiUserX,
  FiGift,
  FiMoreVertical
} from "react-icons/fi";

// Primary color configuration
const primaryColor = "#FD5A00";
const primaryLight = "#FF8A3D";
const primaryDark = "#D44A00";

const adminMenuItems = [
  { path: "/admin", icon: FiHome, label: "Dashboard", section: "main" },
  { path: "/admin/courses", icon: FiBook, label: "Courses", section: "main" },
  { path: "/admin/studentanalytics", icon: FiUsers, label: "Students", section: "main" },
  { path: "/admin/analytics", icon: FiBarChart2, label: "Analytics", section: "main" },
  { path: "/admin/live-classes", icon: FiVideo, label: "Live Classes", section: "main" },
  { path: "/admin/blogs", icon: FiFileText, label: "Blogs", section: "main" },
  { type: "divider", label: "Management", section: "divider" },
  { 
    label: "Contest Management", 
    icon: FiAward, 
    section: "management",
    subItems: [
      { path: "/admin/contests?section=adminPanel", label: "Contest Panel" },
      { path: "/admin/coupons", label: "Coupon Management" },
      { path: "/admin/contests?section=adminTables", label: "Admin Tables" },
      { path: "/admin/contests?section=users", label: "All Users" }
    ]
  },
  { path: "/admin/schools", icon: FiSettings, label: "School Registrations", section: "management" },
  { path: "/admin/volunteers", icon: FiUsers, label: "Volunteers", section: "management" },
  { path: "/admin/account-deletions", icon: FiUserX, label: "Account Deletions", section: "management" },
  { path: "/admin/management", icon: FiUsers, label: "Admin Management", section: "management" },
];

const studentMenuItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/courses', icon: FiBook, label: 'Courses' },
  { path: '/certificate', icon: FiAward, label: 'Certificates' },
  { path: '/live-classes', icon: FiVideo, label: 'Live Classes' },
  { path: '/blogs', icon: FiFileText, label: 'Blogs' }
];

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const { user, logout } = useAuth();
  const navRef = useRef(null);

  // Restore scroll position on mount
  useEffect(() => {
    const savedScroll = localStorage.getItem("sidebarScroll");
    if (savedScroll && navRef.current) {
      navRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  // Handle scroll to save position
  const handleScroll = (e) => {
    localStorage.setItem("sidebarScroll", e.target.scrollTop);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Auto-open sub-menus if active
  useEffect(() => {
    const activeSubMenu = adminMenuItems.find(item => 
      item.subItems && item.subItems.some(sub => location.pathname + location.search === sub.path)
    );
    if (activeSubMenu) {
      setOpenSubMenus(prev => ({ ...prev, [activeSubMenu.label]: true }));
    }
  }, [location.pathname, location.search]);

  const toggleSubMenu = (label) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

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
    if (!name || typeof name !== 'string') return "U";
    const initials = name
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join("")
      .toUpperCase();
    return initials.slice(0, 2) || "U";
  };

  return (
    <>
      {/* Mobile Menu Button - Moved below Navbar and increased z-index */}
      {/* Mobile Menu Button - Repositioned to the right to avoid overlapping text */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden fixed top-[115px] right-4 z-[10000] w-12 h-12 text-white rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Backdrop for mobile - Fixed to cover entire screen */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-[2900] backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      <aside
        className={`
          fixed top-0 md:top-[112px] left-0 
          ${isMobileOpen ? 'z-[9999] translate-x-0' : 'z-[5000] -translate-x-full md:translate-x-0'}
          bg-white border-r border-gray-200 shadow-2xl transition-transform duration-300
          w-64 h-screen md:h-[calc(100vh-112px)]
        `}
        style={{ 
          backgroundColor: 'white', 
          color: '#374151',
          minHeight: isMobileOpen ? '100vh' : 'auto',
          top: isMobileOpen ? '0' : '112px'
        }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryDark})` }}
              >
                <FiBook size={20} />
              </div>
              <div>
                <h2 
                  className="text-base font-extrabold leading-none tracking-tight"
                  style={{ color: primaryColor }}
                >
                  {title}
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-3 border-b border-gray-200">
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

          <nav 
            ref={navRef}
            onScroll={handleScroll}
            className="flex-1 p-3 overflow-y-auto scrollbar-hide"
          >
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

                // Render menu item with sub-items
                const Icon = item.icon;
                const isSubMenuOpen = openSubMenus[item.label];
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isActive = location.pathname === item.path || (hasSubItems && item.subItems.some(sub => location.pathname + location.search === sub.path));
                
                return (
                  <li key={item.label}>
                    {hasSubItems ? (
                      <div>
                        <button
                          onClick={() => toggleSubMenu(item.label)}
                          className={`
                            w-full flex items-center transition-all duration-300 rounded-xl px-4 py-2.5
                            ${isActive 
                              ? 'text-gray-900 bg-gray-50' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            }
                          `}
                        >
                          <div className="relative">
                            <Icon size={20} style={isActive ? { color: primaryColor } : {}} />
                          </div>
                          <span className={`ml-3 font-medium flex-1 text-left ${isActive ? 'text-[#FD5A00]' : ''}`}>{item.label}</span>
                          <FiChevronRight 
                            size={16} 
                            className={`transition-transform duration-300 ${isSubMenuOpen ? 'rotate-90' : ''}`} 
                          />
                        </button>
                        
                        {/* Sub-items list */}
                        <div className={`
                          overflow-hidden transition-all duration-300 ease-in-out
                          ${isSubMenuOpen ? 'max-h-96 mt-1' : 'max-h-0'}
                        `}>
                          <ul className="pl-12 space-y-0.5">
                            {item.subItems.map((sub) => {
                                const isSubActive = location.pathname + location.search === sub.path;
                                return (
                                    <li key={sub.path}>
                                    <Link
                                        to={sub.path}
                                        className={`
                                        block transition-all duration-300 rounded-lg px-3 py-2.5 text-sm
                                        ${isSubActive 
                                            ? 'text-white font-semibold' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }
                                        `}
                                        style={isSubActive ? { backgroundColor: primaryColor } : {}}
                                    >
                                        {sub.label}
                                    </Link>
                                    </li>
                                );
                            })}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`
                          flex items-center transition-all duration-300 rounded-xl px-4 py-2.5
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
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t border-gray-200">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 transition-all duration-300 rounded-xl text-gray-700 hover:text-white cursor-pointer"
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
              className="md:hidden w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium cursor-pointer"
            >
              Close Menu
            </button>
          </div>
        </div>
      </aside>

      {/* Custom Sidebar Animations */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
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