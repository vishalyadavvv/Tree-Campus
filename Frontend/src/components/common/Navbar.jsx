import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiX, FiChevronRight, FiHome, FiBook, FiUser, 
  FiInfo, FiMessageCircle, FiAward, FiLogIn, FiLogOut,
  FiChevronDown, FiMail, FiPhone, FiSettings, FiVideo
} from "react-icons/fi";


export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileEnglishOpen, setMobileEnglishOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mobileBlogsOpen, setMobileBlogsOpen] = useState(false);
  const [mobileContestOpen, setMobileContestOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // FIXED: Added useNavigate for proper navigation
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  // FIXED: Enhanced auth state management
  const { user, loading, logout } = useAuth();
  
  const timeoutRef = useRef(null);
  const submenuTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // FIXED: Enhanced authentication state detection
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const isUnverified = isLoggedIn && userData && userData.isVerified === false;

  // Navigation links data - FIXED: Removed settings from navigation
  const navigation = {
    home: "/",
    login: "/login",
    register: "/register",
    profile: "/profile",
    dashboard: "/dashboard",
    admin: "/admin",
    adminCourses: "/admin/courses",
    logout: "/logout",
    courses: "/courses",
    certificate: "/certificate",
    liveClasses: "/live-classes",
    EnglishSpeaking: "/englishspeaking",
    volunteer: "/volunteer",
    AccountDeletionForm: "/accountdeletion",
    howItWorks: "/howitworks",
    myblogs: "/myblogs",
    blogs: {
      main: "/blogs"
    },
    contest: {
      main: "/contest",
      SchoolRegistration: "/contest/schoolregistration",
      contestQuiz: "/contest/quiz"
    },
    aiTeacher: "/ai-teacher"
  };

  const menuData = {
    englishCourse: {
      items: [
        { label: "Courses", href: navigation.courses },
        { label: "Certificate", href: navigation.certificate },
        { label: "Blogs", href: navigation.blogs.main },
        { label: "English Speaking Classes Online Free", href: navigation.EnglishSpeaking }
      ]
    },
    more: {
      items: [
        {
          type: "link", 
          label: "Volunteer",
          href: navigation.volunteer
        },
        {
          type: "link",
          label: "User Account Deletion – Request Form",
          href: navigation.AccountDeletionForm
        },
        {
          type: "link",
          label: "School Registration",
          href: navigation.contest.SchoolRegistration
        },
        {
          type: "link",
          label: "Contest",
          href: navigation.contest.main
        },
        {
          type: "link",
          label: "How It Works",
          href: navigation.howItWorks
        }
      ]
    }
  };

  // Student menu items - FIXED: Removed settings option
  const studentMenuItems = [
    { label: "My Profile", href: navigation.profile, icon: "👤" },
    { label: "Dashboard", href: navigation.dashboard, icon: "📊" },
    { label: "Logout", href: "#", icon: "🚪", action: "logout" }
  ];

  // Admin menu items - FIXED: Removed settings option
  const adminMenuItems = [
    { label: "Admin Dashboard", href: navigation.admin, icon: "🏠" },

    { label: "Course Management", href: navigation.adminCourses, icon: "📚" },
    { label: "Profile", href: navigation.profile, icon: "👤" },
    { label: "Logout", href: "#", icon: "🚪", action: "logout" }
  ];

  // Get current profile menu based on user role
  const getProfileMenuItems = () => {
    let items = userRole === 'admin' ? adminMenuItems : studentMenuItems;
    
    // ⭐ Filter items for unverified users
    if (userData && userData.isVerified === false) {
      return items.filter(item => item.action === 'logout');
    }
    
    return items;
  };

  // FIXED: Use initials instead of default avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // FIXED: Enhanced auth state synchronization
  useEffect(() => {
    const checkAuthState = () => {
      try {
        // Check both context and localStorage for auth state
        const token = localStorage.getItem('token');
        const userFromStorage = localStorage.getItem('user');
        
        if (user && token) {
          // Use context user data
          setIsLoggedIn(true);
          setUserData(user);
          setUserRole(user.role || 'student');
        } else if (token && userFromStorage) {
          // Fallback to localStorage if context is not updated
          try {
            const parsedUser = JSON.parse(userFromStorage);
            setIsLoggedIn(true);
            setUserData(parsedUser);
            setUserRole(parsedUser.role || 'student');
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            setIsLoggedIn(false);
            setUserData(null);
            setUserRole('student');
          }
        } else {
          // Not logged in
          setIsLoggedIn(false);
          setUserData(null);
          setUserRole('student');
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsLoggedIn(false);
        setUserData(null);
        setUserRole('student');
      }
    };

    checkAuthState();
  }, [user, loading]);

  // FIXED: Enhanced auth state change listener
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      const userFromStorage = localStorage.getItem('user');
      
      if (token && userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          setIsLoggedIn(true);
          setUserData(parsedUser);
          setUserRole(parsedUser.role || 'student');
        } catch (error) {
          console.error('Error parsing user data from event:', error);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        setUserRole('student');
      }
    };

    // Listen for custom events
    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('userLoggedOut', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback((dropdown) => {
    clearAllTimeouts();
    setActiveDropdown(dropdown);
    setActiveSubmenu(null);
  }, [clearAllTimeouts]);

  const handleMouseLeave = useCallback(() => {
    clearAllTimeouts();
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubmenu(null);
    }, 150);
  }, [clearAllTimeouts]);

  const handleSubmenuEnter = useCallback((submenu) => {
    clearAllTimeouts();
    setActiveSubmenu(submenu);
  }, [clearAllTimeouts]);

  const handleSubmenuLeave = useCallback(() => {
    clearAllTimeouts();
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 150);
  }, [clearAllTimeouts]);

  const handleDropdownContentEnter = useCallback(() => {
    clearAllTimeouts();
  }, [clearAllTimeouts]);

  const handleDropdownContentLeave = useCallback(() => {
    clearAllTimeouts();
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubmenu(null);
    }, 150);
  }, [clearAllTimeouts]);

  const handleDropdownTriggerClick = useCallback((e, dropdown) => {
    e.preventDefault();
    e.stopPropagation();
    clearAllTimeouts();
    
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
      setActiveSubmenu(null);
    } else {
      setActiveDropdown(dropdown);
      setActiveSubmenu(null);
    }
  }, [activeDropdown, clearAllTimeouts]);

  const handleSubmenuTriggerClick = useCallback((e, submenu) => {
    e.preventDefault();
    e.stopPropagation();
    clearAllTimeouts();
    
    if (activeSubmenu === submenu) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(submenu);
    }
  }, [activeSubmenu, clearAllTimeouts]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setMobileEnglishOpen(false);
      setMobileMoreOpen(false);
      setMobileBlogsOpen(false);
      setMobileContestOpen(false);
      setMobileProfileOpen(false);
    }
  };

  const toggleProfileDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeAllMenus = useCallback(() => {
    clearAllTimeouts();
    setActiveDropdown(null);
    setActiveSubmenu(null);
    setIsMobileMenuOpen(false);
    setMobileEnglishOpen(false);
    setMobileMoreOpen(false);
    setMobileBlogsOpen(false);
    setMobileContestOpen(false);
    setMobileProfileOpen(false);
    setProfileDropdownOpen(false);
  }, [clearAllTimeouts]);

  const handleLinkClick = () => {
    closeAllMenus();
  };

  // FIXED: Enhanced navigation handler for mobile menu
  const handleNavigation = (href) => {
    if (href && href !== '#' && !href.startsWith('http')) {
      closeAllMenus();
      navigate(href);
      return true;
    }
    return false;
  };

  // FIXED: Enhanced logout function with better state management
  const handleLogout = async () => {
    try {
      await logout();
      closeAllMenus();
      
      // AuthContext.logout() handles localStorage removal, we just need to reset local state
      setIsLoggedIn(false);
      setUserData(null);
      setUserRole('student');
      
      // Dispatch events
      window.dispatchEvent(new Event('userLoggedOut'));
      window.dispatchEvent(new Event('authStateChanged'));
      
      // Redirect to home
      setTimeout(() => {
        navigate(navigation.home);
        window.location.reload(); // Force reload to clear any cached state
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback cleanup
      setIsLoggedIn(false);
      setUserData(null);
      setUserRole('student');
      navigate(navigation.home);
      window.location.reload();
    }
  };

  // FIXED: Enhanced menu item click handler for mobile menu
  const handleMobileMenuItemClick = (item) => {
    console.log('Mobile menu item clicked:', item);
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.href && item.href !== '#') {
      if (!handleNavigation(item.href)) {
        // If navigate didn't work (external link), use window.location
        window.location.href = item.href;
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [closeAllMenus]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // FIXED: Enhanced NavLink component for better navigation
  const NavLink = ({ href, children, className = "", onClick, ...props }) => {
    const isExternal = href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'));
    
    if (isExternal) {
      return (
        <a 
          href={href} 
          className={className}
          onClick={(e) => {
            if (onClick) onClick(e);
            handleLinkClick();
          }}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link 
        to={href || '#'}
        className={className}
        onClick={(e) => {
          if (onClick) onClick(e);
          handleLinkClick();
        }}
        {...props}
      >
        {children}
      </Link>
    );
  };

  // FIXED: Enhanced loading state with better auth detection
  if (loading) {
    return (
      <nav className="w-full bg-white sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-2 border-b" style={{ backgroundImage: 'linear-gradient(to right, #FD5A00, #E54F00)', borderColor: '#FD5A00' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="h-4 rounded w-32 animate-pulse" style={{ backgroundColor: '#FD5A00', opacity: 0.3 }}></div>
            <div className="h-4 rounded w-24 animate-pulse" style={{ backgroundColor: '#FD5A00', opacity: 0.3 }}></div>
          </div>
        </div>
        <div className="bg-white px-6 py-0 border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="hidden sm:block">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="lg:hidden flex items-center gap-3">
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
   <nav className="w-full bg-white fixed top-0 left-0 right-0 z-[9999] shadow-sm">

      
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 border-b border-orange-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a
            href="mailto:info@treecampus.in"
            className="flex items-center gap-2 text-white hover:text-gray-200 transition"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span className="text-sm font-medium tracking-wide">
              info@treecampus.in
            </span>
          </a>

          <div className="relative group cursor-pointer text-white">
            <div className="flex items-center gap-2 hover:text-gray-200 transition">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C11.29 21 3 12.71 3 2a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.19 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z"/>
              </svg>
              <span className="text-sm font-medium tracking-wide">+91 xxxxxxxxxx</span>
            </div>

            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <a
                href="tel:+91-xxxxxxxxxx"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                📞 Call Now
              </a>
              <a
                href="https://wa.me/91xxxxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white px-6 py-0 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center py-3">
            <NavLink href={navigation.home} className="flex items-center gap-3 group">
              <div className="w-12 h-12 flex items-center justify-center transition-shadow overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dtcaankcx/image/upload/v1764152899/tree_logo_c2dhe0.png"
                  alt="Tree Campus Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-gray-900 font-bold text-lg leading-tight">Tree Campus</div>
                <div className="text-gray-500 text-xs">Learn English Free</div>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 h-full py-2">
            
            {/* Home */}
            <NavLink 
              href={navigation.home}
              className="px-6 py-2.5 rounded-full flex items-center group relative overflow-hidden bg-orange-500 text-white font-bold tracking-wide text-sm shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-300 active:scale-95"
            >
              <div className="flex items-center gap-2">
                <FiHome className="text-lg" />
                <span>HOME</span>
              </div>
            </NavLink>

            {/* ⚠️ Verification Banner for unverified users */}
            {isUnverified && (
              <div className="flex items-center gap-3 px-4 py-2 bg-yellow-50 border border-yellow-300 rounded-full shadow-sm">
                <span className="text-yellow-800 text-sm font-semibold">⚠️ Please verify your phone to access all features</span>
                <NavLink
                  href="/verify-otp"
                  state={{ email: userData?.email, phone: userData?.phone, mode: 'register' }}
                  className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition shadow-sm ml-2"
                >
                  Verify Now
                </NavLink>
              </div>
            )}

            {!isUnverified && (
            <>
            {/* English Course Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('englishCourse')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`px-6 py-2.5 rounded-full flex items-center gap-2 font-bold tracking-wide text-sm transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                  activeDropdown === 'englishCourse' ? 'text-orange-600 bg-orange-50 shadow-inner' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={(e) => handleDropdownTriggerClick(e, 'englishCourse')}
              >
                ENGLISH COURSE
                <FiChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'englishCourse' ? 'rotate-180 text-orange-600' : 'text-gray-400'}`} 
                />
              </button>

              {activeDropdown === 'englishCourse' && (
                <div 
                  className="absolute top-full left-0 w-80 bg-white shadow-xl border-t-2 border-orange-500 rounded-b-lg z-[1001]"
                  onMouseEnter={handleDropdownContentEnter}
                  onMouseLeave={handleDropdownContentLeave}
                >
                  {menuData.englishCourse.items.map((item, index) => (
                    <NavLink
                      key={index}
                      href={item.href}
                      className="block px-6 py-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 last:rounded-b-lg group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Live Classes Button */}
            <NavLink 
              href={navigation.liveClasses}
              className="px-6 py-2.5 rounded-full flex items-center bg-orange-500 text-white font-bold tracking-wide text-sm shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-300 active:scale-95 mx-1"
            >
              <div className="flex items-center gap-2">
                <FiVideo className="text-lg" />
                <span>LIVE CLASSES</span>
              </div>
            </NavLink>

            {/* AI Teacher Link */}
            <NavLink 
              href={navigation.aiTeacher}
              className="px-6 py-2.5 rounded-full flex items-center bg-orange-500 text-white font-bold tracking-wide text-sm shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-300 active:scale-95 mx-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">👩‍🏫</span>
                <span>AI TEACHER</span>
              </div>
            </NavLink>

            {/* More Dropdown */}
            <div 
              className="relative h-full flex items-center ml-1"
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`px-6 py-2.5 rounded-full flex items-center gap-2 font-bold tracking-wide text-sm transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                  activeDropdown === 'more' ? 'text-orange-600 bg-orange-50 shadow-inner' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={(e) => handleDropdownTriggerClick(e, 'more')}
              >
                MORE
                <FiChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'more' ? 'rotate-180 text-orange-600' : 'text-gray-400'}`} 
                />
              </button>

              {activeDropdown === 'more' && (
                <div 
                  className="absolute top-full right-0 w-80 bg-white shadow-xl border-t-2 border-orange-500 rounded-b-lg z-[1001]"
                  onMouseEnter={handleDropdownContentEnter}
                  onMouseLeave={handleDropdownContentLeave}
                >
                  {menuData.more.items.map((item, index) => (
                    <div key={index} className="relative">
                      {item.type === 'link' ? (
                        <NavLink
                          href={item.href}
                          className="block px-6 py-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                            <span>{item.label}</span>
                          </div>
                        </NavLink>
                      ) : (
                        <div
                          className={`flex items-center justify-between px-6 py-4 transition-all cursor-pointer text-sm border-b border-gray-100 group/item ${
                            activeSubmenu === item.label ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                          }`}
                          onMouseEnter={() => handleSubmenuEnter(item.label)}
                          onMouseLeave={handleSubmenuLeave}
                          onClick={(e) => {
                             if (item.type === 'submenu') {
                               handleSubmenuTriggerClick(e, item.label);
                             }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                            <span>{item.label}</span>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 group-hover/item:text-orange-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                          </svg>
                        </div>
                      )}

                      {item.type === 'submenu' && activeSubmenu === item.label && (
                        <div 
                          className="absolute top-0 right-full w-96 bg-white shadow-xl border-r-2 border-orange-500 max-h-96 overflow-y-auto rounded-l-lg z-[1001] custom-scrollbar"
                          onMouseEnter={() => handleSubmenuEnter(item.label)}
                          onMouseLeave={handleSubmenuLeave}
                        >
                          {item.items.map((subItem, subIndex) => (  
                            <NavLink
                              key={subIndex}
                              href={subItem.href}
                              className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 group/subitem"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover/subitem:opacity-100 transition-opacity flex-shrink-0"></div>
                                <span className="leading-relaxed">{subItem.label}</span>
                              </div>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            </>
            )}

            {/* Admin Dashboard Link for Admin Users */}
            {isLoggedIn && !isUnverified && userRole === 'admin' && (
              <NavLink 
                href={navigation.admin}
                className="px-6 py-2.5 rounded-full flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold tracking-wide text-sm shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 active:scale-95 ml-2"
              >
                <div className="flex items-center gap-2">
                  <FiSettings className="w-4 h-4" />
                  <span>ADMIN</span>
                </div>
              </NavLink>
            )}

            {/* Login/Profile Dropdown */}
            {isLoggedIn ? (
              <div 
                ref={profileDropdownRef}
                className="relative h-full flex items-center ml-2"
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="px-5 py-2 rounded-full border border-gray-200 bg-white flex items-center gap-3 text-gray-700 font-bold tracking-wide text-xs shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 active:scale-95 cursor-pointer"
                  onClick={toggleProfileDropdown}
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-orange-100">
                    {getUserInitials(userData?.name)}
                  </div>
                  <span className="max-w-[80px] truncate">
                    {userData?.name || 'User'}
                  </span>
                  <FiChevronDown 
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} 
                  />
                </button>

                {(profileDropdownOpen || activeDropdown === 'profile') && (
                  <div 
                    className="absolute top-full right-0 w-64 bg-white shadow-xl border-t-2 border-orange-500 rounded-b-lg z-[1001]"
                    onMouseEnter={handleDropdownContentEnter}
                    onMouseLeave={handleDropdownContentLeave}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-orange-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-orange-200 bg-white text-orange-600 flex items-center justify-center font-bold">
                          {getUserInitials(userData?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {userData?.name || 'User'} {userRole === 'admin' && '(Admin)'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{userData?.email || ''}</p>
                        </div>
                      </div>
                    </div>

                    {getProfileMenuItems().map((item, index) => (
                      item.action === "logout" ? (
                        <button
                          key={index}
                          onClick={() => handleMobileMenuItemClick(item)}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 last:rounded-b-lg flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <NavLink
                          key={index}
                          href={item.href}
                          onClick={() => handleMobileMenuItemClick(item)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 last:rounded-b-lg cursor-pointer"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </NavLink>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink 
                href={navigation.login}
                className="px-8 py-2.5 rounded-full flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold tracking-wide text-sm shadow-md hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 active:scale-95 ml-2"
              >
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  LOGIN
                </div>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {isLoggedIn ? (
              <div 
                ref={profileDropdownRef}
                className="relative"
              >
                <button 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={toggleProfileDropdown}
                >
                  {/* FIXED: Use initials instead of default image */}
                  <div className="w-8 h-8 rounded-full border-2 border-orange-500 bg-white text-orange-600 flex items-center justify-center font-bold">
                    {getUserInitials(userData?.name)}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-orange-50 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-orange-200 bg-white text-orange-600 flex items-center justify-center font-bold">
                          {getUserInitials(userData?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {userData?.name || 'User'} {userRole === 'admin' && '(Admin)'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{userData?.email || ''}</p>
                        </div>
                      </div>
                    </div>

                    {getProfileMenuItems().map((item, index) => (
                      item.action === "logout" ? (
                        <button
                          key={index}
                          onClick={() => handleMobileMenuItemClick(item)}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 last:rounded-b-lg flex items-center gap-3"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <NavLink
                          key={index}
                          href={item.href}
                          onClick={() => handleMobileMenuItemClick(item)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 last:rounded-b-lg"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </NavLink>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink 
                href={navigation.login}
                onClick={handleLinkClick}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                LOGIN
              </NavLink>
            )}
            
            <button 
              onClick={toggleMobileMenu}
              className="mobile-menu-button p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navbar Sidebar Redesign */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMobileMenu}
                className="lg:hidden fixed inset-0 bg-black/60 z-[1010] backdrop-blur-sm"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-white z-[1020] shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://res.cloudinary.com/dtcaankcx/image/upload/v1764152899/tree_logo_c2dhe0.png"
                      alt="Logo"
                      className="h-10 w-10 object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 leading-none">Tree Campus</span>
                      <span className="text-[10px] text-gray-500 font-medium">Learn English Free</span>
                    </div>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                  <div className="py-2">
                    {/* Primary Links */}
                    <div className="px-3 mb-2">
                      <NavLink
                        href={navigation.home}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                          isActive(navigation.home) 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <FiHome className="text-xl group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">Home</span>
                      </NavLink>

                      {/* ⚠️ Verification banner in mobile */}
                      {isUnverified && (
                        <div className="mx-1 my-3 p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
                          <p className="text-yellow-800 text-sm font-semibold mb-2">⚠️ Verify Your Account</p>
                          <p className="text-yellow-700 text-xs mb-3">Please verify your phone number to access courses, live classes, and all features.</p>
                          <NavLink
                            href="/verify-otp"
                            state={{ email: userData?.email, phone: userData?.phone, mode: 'register' }}
                            onClick={handleLinkClick}
                            className="block text-center px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition"
                          >
                            Verify Now
                          </NavLink>
                        </div>
                      )}

                      {!isUnverified && (
                      <div className="w-full">
                      <NavLink
                        href={navigation.liveClasses}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                          isActive(navigation.liveClasses) 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <FiVideo className="text-xl group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">Live Classes</span>
                      </NavLink>

                      <NavLink
                        href={navigation.aiTeacher}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                          isActive(navigation.aiTeacher) 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">👩‍🏫</span>
                        <span className="font-semibold text-sm uppercase">AI Teacher</span>
                      </NavLink>
                      </div>
                      )}
                    </div>

                    {/* Expandable Sections */}
                    {!isUnverified && (
                    <div className="w-full">
                    <div className="space-y-1">
                      {/* English Course */}
                      <div className="px-3">
                        <button
                          onClick={() => setMobileEnglishOpen(!mobileEnglishOpen)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            mobileEnglishOpen ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <FiAward className="text-xl" />
                            <span className="font-bold text-sm">English Course</span>
                          </div>
                          <FiChevronDown className={`transition-transform duration-300 ${mobileEnglishOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{ height: mobileEnglishOpen ? "auto" : 0, opacity: mobileEnglishOpen ? 1 : 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-b-xl mx-2"
                        >
                          {menuData.englishCourse.items.map((item, index) => (
                            <NavLink
                              key={index}
                              href={item.href}
                              onClick={handleLinkClick}
                              className={`flex items-center gap-3 py-3 px-6 transition-colors text-sm border-l-2 ${
                                isActive(item.href)
                                  ? 'bg-white text-orange-600 border-orange-500'
                                  : 'text-gray-600 hover:text-orange-600 hover:bg-white border-transparent hover:border-orange-500'
                              }`}
                            >
                              <FiChevronRight className="text-xs" />
                              {item.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      </div>

                      {/* More Section */}
                      <div className="px-3">
                        <button
                          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${
                            mobileMoreOpen ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <FiInfo className="text-xl" />
                            <span className="font-bold text-sm">More</span>
                          </div>
                          <FiChevronDown className={`transition-transform duration-300 ${mobileMoreOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{ height: mobileMoreOpen ? "auto" : 0, opacity: mobileMoreOpen ? 1 : 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-b-xl mx-2"
                        >
                          {menuData.more.items.map((item, index) => (
                            <NavLink
                              key={index}
                              href={item.href}
                              onClick={handleLinkClick}
                              className={`flex items-center gap-3 py-3 px-6 transition-colors text-sm border-l-2 ${
                                isActive(item.href)
                                  ? 'bg-white text-orange-600 border-orange-500'
                                  : 'text-gray-600 hover:text-orange-600 hover:bg-white border-transparent hover:border-orange-500'
                              }`}
                            >
                              <FiChevronRight className="text-xs" />
                              {item.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      </div>

                      {/* Profile Section (If Logged In) */}
                      {isLoggedIn && (
                        <div className="px-3">
                          <button
                            onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                              mobileProfileOpen ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                                {getUserInitials(userData?.name)}
                              </div>
                              <span className="font-bold text-sm uppercase">My Account</span>
                            </div>
                            <FiChevronDown className={`transition-transform duration-300 ${mobileProfileOpen ? 'rotate-180' : ''}`} />
                          </button>
                          <motion.div
                            initial={false}
                            animate={{ height: mobileProfileOpen ? "auto" : 0, opacity: mobileProfileOpen ? 1 : 0 }}
                            className="overflow-hidden bg-gray-50/50 rounded-b-xl mx-2"
                          >
                            {getProfileMenuItems().map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleMobileMenuItemClick(item)}
                                className={`w-full flex items-center gap-4 py-3 px-6 transition-colors text-sm border-l-2 ${
                                  isActive(item.href)
                                    ? 'bg-white text-orange-600 border-orange-500'
                                    : 'text-gray-600 hover:text-orange-600 hover:bg-white border-transparent hover:border-orange-500'
                                }`}
                              >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                              </button>
                            ))}
                          </motion.div>
                        </div>
                      )}
                    </div>
                    </div>
                    )}
                  </div>

                  {/* Contact Info in Sidebar */}
                  <div className="mt-4 px-6 py-6 border-t border-gray-100 bg-gray-50/30">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Contact Support</p>
                    <div className="space-y-4">
                      <a href="mailto:info@treecampus.in" className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors">
                        <FiMail className="text-lg" />
                        <span className="text-xs font-medium">info@treecampus.in</span>
                      </a>
                      <a href="tel:+91xxxxxxxxxx" className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors">
                        <FiPhone className="text-lg" />
                        <span className="text-xs font-medium">+91 xxxxxxxxxx</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Sidebar Footer - ACTION BUTTON */}
                <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-all group"
                    >
                      <FiLogOut className="text-xl group-hover:translate-x-1 transition-transform" />
                      LOGOUT
                    </button>
                  ) : (
                    <NavLink
                      href={navigation.login}
                      onClick={handleLinkClick}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all group"
                    >
                      <FiLogIn className="text-xl group-hover:translate-x-1 transition-transform" />
                      LOGIN / REGISTER
                    </NavLink>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff9966;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff8547;
        }
      `}</style>
    </nav>
  );
}