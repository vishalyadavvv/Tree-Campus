import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import AccountDeletionForm from "../../pages/UserAccountDeletion";

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

  // Navigation links data
  const navigation = {
    home: "/",
    login: "/login",
    register: "/register",
    profile: "/profile",
    dashboard: "/dashboard",
    myCourses: "/my-courses",
    settings: "/settings",
    admin: "/admin",
    adminUsers: "/admin/users",
    adminCourses: "/admin/courses",
    logout: "/logout",
    courses: "/courses",
    certificate: "/certificate",
    liveClasses: "/live-classes",
    freeSpeakingClasses: "/free-speaking-classes",
    dailyReading: "/daily-reading",
    volunteer: "/volunteer",
    AccountDeletionForm: "/accountdeletion",
    howItWorks: "/howitworks",
    blogs: {
      main: "/blogs",
      posts: {
        topMobileApps: "/blogs/top-7-mobile-apps-free-english-learning-2025",
        benefitsLearningEnglish: "/blogs/benefits-learning-spoken-english",
        treecampusTool: "/blogs/treecampus-free-spoken-english-learning-tool",
        speakEnglishOnline: "/blogs/speak-english-online-free",
        motherSonConnection: "/blogs/mother-son-connection-english",
        studentJourney: "/blogs/student-journey-failure-to-triumph",
        studyingEnglish: "/blogs/studying-english-online-practice",
        whyTreecampus: "/blogs/why-treecampus-best-option",
        speakingEnglishKnowledge: "/blogs/speaking-english-with-knowledge",
        investFuture: "/blogs/invest-future-elderly-woman-english",
        realizePotential: "/blogs/realize-potential-learn-english-online",
        aiPoweredApp: "/blogs/tree-campus-ai-powered-language-learning",
        uncoverPotential: "/blogs/uncover-potential-free-english-classes",
        masteringEnglish: "/blogs/journey-mastering-english",
        hindiLearnEnglish: "/blogs/free-mein-english-kaise-sikhe",
        futureProficiency: "/blogs/future-english-proficiency-2024",
        englishSpeakingCourse: "/blogs/english-speaking-course-online-free",
        top5MobileApps: "/blogs/top-5-free-mobile-apps-learn-english",
        benefitsSpokenEnglish: "/blogs/10-benefits-spoken-english-course",
        bestFreeApp: "/blogs/best-free-app-learn-english"
      }
    },
    contest: {
      main: "/contest",
      schoolRegistration: "/contest/school-registration",
      contestQuiz: "/contest/quiz"
    }
  };

  const menuData = {
    englishCourse: {
      items: [
        { label: "Courses", href: navigation.courses },
        { label: "Certificate", href: navigation.certificate },
        { label: "Live Classes", href: navigation.liveClasses },
        { label: "English Speaking Classes Online Free", href: navigation.freeSpeakingClasses }
      ]
    },
    more: {
      items: [
        {
          type: "link",
          label: "Daily English Reading – Tree Campus",
          href: navigation.dailyReading
        },
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
          type: "submenu",
          label: "Blogs",
          href: navigation.blogs.main,
          items: [
            { label: "Top 7 Mobile Apps for Free English Learning in 2025", href: navigation.blogs.posts.topMobileApps },
            { label: "Benefits of Learning Spoken English: Students, Job Seekers and Professionals", href: navigation.blogs.posts.benefitsLearningEnglish },
            { label: "Treecampus: The Free Spoken English Learning Tool Making A Difference", href: navigation.blogs.posts.treecampusTool },
            { label: "Speak English Online Free : Change Your Academic Path with Tree Campus", href: navigation.blogs.posts.speakEnglishOnline },
            { label: "The way a Mother Used the Tree Campus Learning App to Establish a Connection with Her Son Through English", href: navigation.blogs.posts.motherSonConnection },
            { label: "A Student's Journey with the Tree Campus Learning App: From Failure to Triumph", href: navigation.blogs.posts.studentJourney },
            { label: "Studying English: How to Acquire and Utilize Free Online Speaking Practice", href: navigation.blogs.posts.studyingEnglish },
            { label: "Why the Tree Campus Learning App is the Best Option for Free English Learning", href: navigation.blogs.posts.whyTreecampus },
            { label: "Speaking English with Knowledge : A Comprehensive Guide to Complimentary Practice Resources", href: navigation.blogs.posts.speakingEnglishKnowledge },
            { label: "Invest in Your Future:An Elderly Woman's Adventure to Learn English.", href: navigation.blogs.posts.investFuture },
            { label: "Realize Your Potential: Learn English Online for Free and Explore the Journey", href: navigation.blogs.posts.realizePotential },
            { label: "Tree Campus – AI-Powered Language Learning App", href: navigation.blogs.posts.aiPoweredApp },
            { label: "Attend Free Online English-speaking Classes to Uncover Your Potential", href: navigation.blogs.posts.uncoverPotential },
            { label: "A Journey Story of Learning and Discovery to Mastering English", href: navigation.blogs.posts.masteringEnglish },
            { label: "फ्री में इंग्लिश कैसे सीखें?", href: navigation.blogs.posts.hindiLearnEnglish },
            { label: "Future Of English Language Proficiency In 2024 - Tree Campus", href: navigation.blogs.posts.futureProficiency },
            { label: "English Speaking Course Online Free", href: navigation.blogs.posts.englishSpeakingCourse },
            { label: "Top 5 Free Mobile Apps To Learn English", href: navigation.blogs.posts.top5MobileApps },
            { label: "10 Benefits Of Spoken English Course Online Free", href: navigation.blogs.posts.benefitsSpokenEnglish },
            { label: "अंग्रेजी सीखने के लिए सबसे अच्छा मुफ्त ऐप कौन सा है?", href: navigation.blogs.posts.bestFreeApp }
          ]
        },
        {
          type: "submenu",
          label: "Contest",
          href: navigation.contest.main,
          items: [
            { label: "School Registration", href: navigation.contest.schoolRegistration },
            { label: "Contest Quiz", href: navigation.contest.contestQuiz }
          ]
        },
        {
          type: "link",
          label: "How It Works",
          href: navigation.howItWorks
        }
      ]
    }
  };

  // Student menu items
  const studentMenuItems = [
    { label: "My Profile", href: navigation.profile, icon: "👤" },
    { label: "Dashboard", href: navigation.dashboard, icon: "📊" },
    { label: "My Courses", href: navigation.myCourses, icon: "📚" },
    { label: "Settings", href: navigation.settings, icon: "⚙️" },
    { label: "Logout", href: "#", icon: "🚪", action: "logout" }
  ];

  // Admin menu items
  const adminMenuItems = [
    { label: "Admin Dashboard", href: navigation.admin, icon: "🏠" },
    { label: "User Management", href: navigation.adminUsers, icon: "👥" },
    { label: "Course Management", href: navigation.adminCourses, icon: "📚" },
    { label: "Settings", href: navigation.settings, icon: "⚙️" },
    { label: "Logout", href: "#", icon: "🚪", action: "logout" }
  ];

  // Get current profile menu based on user role
  const getProfileMenuItems = () => {
    if (userRole === 'admin') {
      return adminMenuItems;
    }
    return studentMenuItems;
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

  // FIXED: Enhanced auth state synchronization
  useEffect(() => {
    const checkAuthState = () => {
      try {
        // Check both context and localStorage for auth state
        const token = localStorage.getItem('token');
        const userFromStorage = localStorage.getItem('user');
        
        console.log('🔄 Navbar Auth Check:', {
          contextUser: user,
          token,
          userFromStorage,
          loading
        });

        if (user && token) {
          // Use context user data
          setIsLoggedIn(true);
          setUserData(user);
          setUserRole(user.role || 'student');
          console.log('✅ Using context user data');
        } else if (token && userFromStorage) {
          // Fallback to localStorage if context is not updated
          try {
            const parsedUser = JSON.parse(userFromStorage);
            setIsLoggedIn(true);
            setUserData(parsedUser);
            setUserRole(parsedUser.role || 'student');
            console.log('✅ Using localStorage user data');
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
          console.log('❌ No auth data found');
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
      console.log('📢 Auth state change event received in Navbar');
      // Force re-check of auth state
      const token = localStorage.getItem('token');
      const userFromStorage = localStorage.getItem('user');
      
      console.log('🔄 Manual auth check after event:', { token, userFromStorage });
      
      if (token && userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          setIsLoggedIn(true);
          setUserData(parsedUser);
          setUserRole(parsedUser.role || 'student');
          console.log('✅ Auth state updated from event');
        } catch (error) {
          console.error('Error parsing user data from event:', error);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        setUserRole('student');
        console.log('❌ Auth state cleared from event');
      }
    };

    // Listen for custom events
    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('userLoggedOut', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    // Check auth state periodically to catch any missed updates
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && !isLoggedIn) {
        console.log('🔄 Periodic auth check: Found token, updating state');
        handleAuthChange();
      }
    }, 1000);

    return () => {
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

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

  // FIXED: Enhanced logout function with better state management
  const handleLogout = async () => {
    console.log('Logging out...');
    
    try {
      await logout();
      closeAllMenus();
      
      // Clear all storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // Reset local state
      setIsLoggedIn(false);
      setUserData(null);
      setUserRole('student');
      
      // Dispatch events
      window.dispatchEvent(new Event('userLoggedOut'));
      window.dispatchEvent(new Event('authStateChanged'));
      
      // Redirect to home
      setTimeout(() => {
        window.location.href = navigation.home;
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback cleanup
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      setUserData(null);
      setUserRole('student');
      window.location.href = navigation.home;
    }
  };

  // FIXED: Enhanced menu item click handler
  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      handleLinkClick();
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

  const NavLink = ({ href, children, className = "", onClick, ...props }) => {
    return (
      <a 
        href={href} 
        className={className}
        onClick={(e) => {
          if (onClick) onClick(e);
          handleLinkClick();
        }}
        {...props}
      >
        {children}
      </a>
    );
  };

  // FIXED: Enhanced loading state with better auth detection
  if (loading) {
    return (
      <nav className="w-full bg-white sticky top-0 z-50 shadow-sm">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 border-b border-orange-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="h-4 bg-orange-400 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-orange-400 rounded w-24 animate-pulse"></div>
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

  console.log('🎯 Final Navbar Render State:', {
    isLoggedIn,
    userData,
    userRole,
    loading
  });

  return (
    <nav ref={navRef} className="w-full bg-white sticky top-0 z-50 shadow-sm">
      
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
              <span className="text-sm font-medium tracking-wide">+91 9876543210</span>
            </div>

            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <a
                href="tel:+919876543210"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                📞 Call Now
              </a>
              <a
                href="https://wa.me/919876543210"
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
          <div className="hidden lg:flex items-stretch h-16">
            
            {/* Home */}
            <NavLink 
              href={navigation.home}
              className="bg-gradient-to-b from-orange-500 to-orange-600 px-8 flex items-center group relative overflow-hidden hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="text-white font-bold tracking-wide text-sm relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                HOME
              </div>
            </NavLink>

            {/* English Course Dropdown */}
            <div 
              className="relative bg-white border-l border-gray-100 h-full"
              onMouseEnter={() => handleMouseEnter('englishCourse')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`h-full px-8 flex items-center gap-2 font-semibold tracking-wide text-sm transition-colors cursor-pointer select-none ${
                  activeDropdown === 'englishCourse' ? 'text-orange-600 bg-orange-50' : 'text-gray-800 hover:text-orange-600 hover:bg-gray-50'
                }`}
                onClick={(e) => handleDropdownTriggerClick(e, 'englishCourse')}
              >
                ENGLISH COURSE
                <svg 
                  className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'englishCourse' ? 'rotate-180 text-orange-600' : 'text-gray-500'}`} 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {activeDropdown === 'englishCourse' && (
                <div 
                  className="absolute top-full left-0 w-80 bg-white shadow-xl border-t-2 border-orange-500 rounded-b-lg z-50"
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

            {/* More Dropdown */}
            <div 
              className="relative bg-white border-l border-gray-100 h-full"
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`h-full px-8 flex items-center gap-2 font-semibold tracking-wide text-sm transition-colors cursor-pointer select-none ${
                  activeDropdown === 'more' ? 'text-orange-600 bg-orange-50' : 'text-gray-800 hover:text-orange-600 hover:bg-gray-50'
                }`}
                onClick={(e) => handleDropdownTriggerClick(e, 'more')}
              >
                MORE
                <svg 
                  className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180 text-orange-600' : 'text-gray-500'}`} 
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {activeDropdown === 'more' && (
                <div 
                  className="absolute top-full right-0 w-80 bg-white shadow-xl border-t-2 border-orange-500 rounded-b-lg z-50"
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
                          onClick={(e) => handleSubmenuTriggerClick(e, item.label)}
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
                          className="absolute top-0 right-full w-96 bg-white shadow-xl border-r-2 border-orange-500 max-h-96 overflow-y-auto rounded-l-lg z-50 custom-scrollbar"
                          onMouseEnter={() => handleSubmenuEnter(item.label)}
                          onMouseLeave={handleSubmenuLeave}
                        >
                          <NavLink
                            href={item.href}
                            className="block px-6 py-3 bg-orange-50 text-orange-700 font-semibold border-b border-orange-100 hover:bg-orange-100 transition-colors"
                          >
                            View All {item.label}
                          </NavLink>
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

            {/* Admin Dashboard Link for Admin Users */}
            {isLoggedIn && userRole === 'admin' && (
              <NavLink 
                href={navigation.admin}
                className="bg-gradient-to-b from-purple-500 to-purple-600 px-8 flex items-center border-l border-purple-600 group relative overflow-hidden hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="text-white font-bold tracking-wide text-sm relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  ADMIN
                </div>
              </NavLink>
            )}

            {/* FIXED: Enhanced Login/Profile Dropdown with better state management */}
            {isLoggedIn ? (
              <div 
                ref={profileDropdownRef}
                className="relative bg-gradient-to-b from-orange-500 to-orange-600 border-l border-orange-600 h-full"
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="h-full px-8 flex items-center gap-3 text-white font-bold tracking-wide text-sm cursor-pointer select-none hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  onClick={toggleProfileDropdown}
                >
                  <img 
                    src={userData?.avatar || defaultAvatar} 
                    alt={userData?.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="max-w-24 truncate">
                    {userData?.name || 'User'} {userRole === 'admin' && '(Admin)'}
                  </span>
                  <svg 
                    className={`w-3 h-3 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>

                {(profileDropdownOpen || activeDropdown === 'profile') && (
                  <div 
                    className="absolute top-full right-0 w-64 bg-white shadow-xl border-t-2 border-orange-500 rounded-b-lg z-50"
                    onMouseEnter={handleDropdownContentEnter}
                    onMouseLeave={handleDropdownContentLeave}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-orange-50">
                      <div className="flex items-center gap-3">
                        <img 
                          src={userData?.avatar || defaultAvatar} 
                          alt={userData?.name || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-orange-200"
                        />
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
                          onClick={() => handleMenuItemClick(item)}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 last:rounded-b-lg flex items-center gap-3"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <NavLink
                          key={index}
                          href={item.href}
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
                className="bg-gradient-to-b from-orange-500 to-orange-600 px-8 flex items-center border-l border-orange-600 group relative overflow-hidden hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="text-white font-bold tracking-wide text-sm relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
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
                  <img 
                    src={userData?.avatar || defaultAvatar} 
                    alt={userData?.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-orange-500"
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-orange-50 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={userData?.avatar || defaultAvatar} 
                          alt={userData?.name || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-orange-200"
                        />
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
                          onClick={() => handleMenuItemClick(item)}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all text-sm border-b border-gray-100 last:border-b-0 last:rounded-b-lg flex items-center gap-3"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <NavLink
                          key={index}
                          href={item.href}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mobile-menu-container bg-white border-t border-gray-200 shadow-xl">
            <div className="py-2 space-y-0 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              <NavLink 
                href={navigation.home}
                className="block px-5 py-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 font-bold text-sm border-b border-orange-400 hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                  HOME
                </div>
              </NavLink>

              {/* Admin Dashboard in Mobile Menu for Admin Users */}
              {isLoggedIn && userRole === 'admin' && (
                <NavLink 
                  href={navigation.admin}
                  className="block px-5 py-4 text-white bg-gradient-to-r from-purple-500 to-purple-600 font-bold text-sm border-b border-purple-400 hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    ADMIN DASHBOARD
                  </div>
                </NavLink>
              )}

              {/* English Course Mobile */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => setMobileEnglishOpen(!mobileEnglishOpen)}
                  className="w-full text-left px-5 py-4 text-gray-800 hover:bg-orange-50 transition-colors font-semibold flex items-center justify-between text-sm border-b border-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l5.5 9h-11L12 2zm0 3.84L10.5 9h3L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
                    </svg>
                    ENGLISH COURSE
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${mobileEnglishOpen ? 'rotate-180 text-orange-600' : 'text-gray-500'}`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                {mobileEnglishOpen && (
                  <div className="bg-gray-50 px-5 py-2 space-y-1 border-b border-gray-200">
                    {menuData.englishCourse.items.map((item, index) => (
                      <NavLink
                        key={index}
                        href={item.href}
                        className="block py-3 px-3 text-gray-700 hover:text-orange-600 hover:bg-white transition-colors text-sm rounded-lg border-l-2 border-transparent hover:border-orange-500"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* More Mobile */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                  className="w-full text-left px-5 py-4 text-gray-800 hover:bg-orange-50 transition-colors font-semibold flex items-center justify-between text-sm border-b border-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    MORE
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${mobileMoreOpen ? 'rotate-180 text-orange-600' : 'text-gray-500'}`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                {mobileMoreOpen && (
                  <div className="bg-gray-50 px-5 py-2 space-y-0 border-b border-gray-200">
                    {menuData.more.items.map((item, index) => (
                      <div key={index}>
                        {item.type === 'link' ? (
                          <NavLink
                            href={item.href}
                            className="block py-3 px-3 text-gray-700 hover:text-orange-600 hover:bg-white transition-colors text-sm rounded-lg border-l-2 border-transparent hover:border-orange-500 border-b border-gray-100 last:border-b-0"
                          >
                            {item.label}
                          </NavLink>
                        ) : (
                          <div className="border-b border-gray-100 last:border-b-0">
                            <button 
                              onClick={() => {
                                if (item.label === 'Blogs') setMobileBlogsOpen(!mobileBlogsOpen);
                                if (item.label === 'Contest') setMobileContestOpen(!mobileContestOpen);
                              }}
                              className="w-full text-left py-3 px-3 text-gray-700 hover:text-orange-600 transition-colors text-sm font-semibold flex items-center justify-between rounded-lg hover:bg-white"
                            >
                              <span>{item.label}</span>
                              <svg 
                                className={`w-4 h-4 transition-transform ${
                                  (item.label === 'Blogs' && mobileBlogsOpen) || 
                                  (item.label === 'Contest' && mobileContestOpen) ? 'rotate-180 text-orange-600' : 'text-gray-500'
                                }`} 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path d="M7 10l5 5 5-5z"/>
                              </svg>
                            </button>
                            {((item.label === 'Blogs' && mobileBlogsOpen) || 
                              (item.label === 'Contest' && mobileContestOpen)) && (
                              <div className="pl-6 py-2 space-y-1 bg-white rounded-lg mt-1 max-h-60 overflow-y-auto custom-scrollbar border-l-2 border-orange-500 ml-3">
                                <NavLink
                                  href={item.href}
                                  className="block py-2 px-3 text-orange-600 hover:bg-orange-50 transition-colors text-xs rounded font-semibold mb-1"
                                >
                                  View All {item.label} →
                                </NavLink>
                                {item.items.map((subItem, subIndex) => (
                                  <NavLink
                                    key={subIndex}
                                    href={subItem.href}
                                    className="block py-2 px-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors text-xs rounded border-l border-orange-200 hover:border-orange-300"
                                  >
                                    {subItem.label}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Section in Mobile Menu */}
              {isLoggedIn && (
                <div className="border-b border-gray-100">
                  <button 
                    onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                    className="w-full text-left px-5 py-4 text-gray-800 hover:bg-orange-50 transition-colors font-semibold flex items-center justify-between text-sm border-b border-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      MY ACCOUNT {userRole === 'admin' && '(Admin)'}
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform ${mobileProfileOpen ? 'rotate-180 text-orange-600' : 'text-gray-500'}`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {mobileProfileOpen && (
                    <div className="bg-gray-50 px-5 py-2 space-y-1 border-b border-gray-200">
                      {getProfileMenuItems().map((item, index) => (
                        item.action === "logout" ? (
                          <button
                            key={index}
                            onClick={() => handleMenuItemClick(item)}
                            className="w-full text-left py-3 px-3 text-gray-700 hover:text-orange-600 hover:bg-white transition-colors text-sm rounded-lg border-l-2 border-transparent hover:border-orange-500 flex items-center gap-3"
                          >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ) : (
                          <NavLink
                            key={index}
                            href={item.href}
                            className="flex items-center gap-3 py-3 px-3 text-gray-700 hover:text-orange-600 hover:bg-white transition-colors text-sm rounded-lg border-l-2 border-transparent hover:border-orange-500"
                          >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                          </NavLink>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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