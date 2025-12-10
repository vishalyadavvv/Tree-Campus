// client/src/components/auth/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const translations = {
  english: {
    title: 'LMS Login',
    subtitle: 'Access your learning dashboard and explore courses',
    loginAs: 'Login As',
    selectRole: 'Select Role',
    student: 'Student',
    admin: 'Admin',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot Password?',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    noAccount: "Don't have an account?",
    registerNow: 'Register Now',
    fillAllFields: 'Please fill in all fields',
    loginFailed: 'Login failed. Please try again.',
    incorrectPassword: 'Incorrect password. Please try again.',
    userNotFound: 'User not found. Please check your email.',
    welcomeTitle: 'Welcome to LMS',
    welcomeSubtitle: 'Start your journey to accessing unlimited courses and learning resources',
    feature1: '1000+ Courses Available',
    feature2: 'Learn from Expert Instructors',
    feature3: 'Earn Certificates',
    feature4: '24/7 Access',
    rightPanelTitle: 'Welcome to LMS',
    rightPanelSubtitle: 'Continue your learning journey and access unlimited courses'
  },
  hindi: {
    title: 'LMS लॉगिन',
    subtitle: 'अपने लर्निंग डैशबोर्ड तक पहुंचें और कोर्स एक्सप्लोर करें',
    loginAs: 'इस रूप में लॉगिन करें',
    selectRole: 'भूमिका चुनें',
    student: 'छात्र',
    admin: 'व्यवस्थापक',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginButton: 'लॉगिन करें',
    loggingIn: 'लॉगिन हो रहा है...',
    noAccount: 'कोई अकाउंट नहीं है?',
    registerNow: 'अभी रजिस्टर करें',
    fillAllFields: 'कृपया सभी फ़ील्ड भरें',
    loginFailed: 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।',
    incorrectPassword: 'गलत पासवर्ड। कृपया पुनः प्रयास करें।',
    userNotFound: 'उपयोगकर्ता नहीं मिला। कृपया अपना ईमेल जांचें।',
    welcomeTitle: 'LMS में आपका स्वागत है',
    welcomeSubtitle: 'असीमित कोर्स और लर्निंग संसाधनों तक पहुंचने की अपनी यात्रा शुरू करें',
    feature1: '1000+ कोर्स उपलब्ध',
    feature2: 'विशेषज्ञ प्रशिक्षकों से सीखें',
    feature3: 'प्रमाणपत्र अर्जित करें',
    feature4: '24/7 तक पहुंच',
    rightPanelTitle: 'LMS में आपका स्वागत है',
    rightPanelSubtitle: 'अपने सीखने की यात्रा को जारी रखें और असीमित कोर्स तक पहुंचें'
  }
};


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showFullScreenWelcome, setShowFullScreenWelcome] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('lms-language');
    return savedLanguage || 'english';
  });

  const { login, refreshUser } = useContext(AuthContext); // ⭐ ADD refreshUser
  const navigate = useNavigate();
  const location = useLocation();
  
  const successMessage = location.state?.message;
  const prefillEmail = location.state?.email;

  const t = translations[currentLanguage];

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('lms-language', languageCode);
    setShowLanguageDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.language-selector')) {
      setShowLanguageDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFullScreenWelcome(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefillEmail) {
      setFormData(prev => ({ ...prev, email: prefillEmail }));
    }
  }, [prefillEmail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setError('');

    if (!formData.email || !formData.password || !formData.role) {
      setError(t.fillAllFields);
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, formData.role);
      
      console.log('✅ Login result:', result);
      
      if (result && result.success) {
        // ⭐ FETCH FRESH PROFILE DATA FROM DATABASE
        console.log('🔄 Fetching fresh profile data...');
        await refreshUser();
        console.log('✅ Profile data refreshed');
        
        // Get user role from server response
        const userRole = result.user?.role;
        
        // Route based on role
        const redirectPath = userRole === 'admin' ? '/admin' : '/dashboard';
        
        console.log('➡️ Navigating to:', redirectPath);
        
        // Use navigate for SPA routing
        navigate(redirectPath, { replace: true });
        
      } else {
        // Show error message without reloading page
        setError(result?.message || t.loginFailed);
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      
      let errorMessage = t.loginFailed;
      
      // Handle different error types
      if (err.response?.status === 401) {
        errorMessage = t.incorrectPassword;
      } else if (err.response?.status === 404) {
        errorMessage = t.userNotFound;
      } else if (err.message) {
        const errorMsg = err.message.toLowerCase();
        if (errorMsg.includes('password') || errorMsg.includes('incorrect') || errorMsg.includes('invalid') || errorMsg.includes('wrong') || errorMsg.includes('credentials')) {
          errorMessage = t.incorrectPassword;
        } else if (errorMsg.includes('user') || errorMsg.includes('not found') || errorMsg.includes('exist') || errorMsg.includes('email')) {
          errorMessage = t.userNotFound;
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };
  return (
    <>
      {showFullScreenWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FD5B00] animate-fade-in">
          <div className="text-center text-white px-4">
            <div className="mb-8 animate-bounce-slow">
              <svg className="w-24 h-24 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-up">
              {t.welcomeTitle}
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 animate-slide-up-delay">
              {t.welcomeSubtitle}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4 z-40">
          <div className="relative language-selector">
            <button 
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-all"
            >
              <span className="font-medium">
                {languages.find(lang => lang.code === currentLanguage)?.flag}
              </span>
              <span className="text-gray-700 hidden sm:inline">
                {languages.find(lang => lang.code === currentLanguage)?.name}
              </span>
              <svg 
                className={`w-4 h-4 text-gray-500 transform transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border min-w-48 transform transition-all duration-200 origin-top-right ${
              showLanguageDropdown ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
            }`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-orange-50 text-orange-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentLanguage === lang.code ? "bg-orange-100 text-orange-700" : "text-gray-700"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <svg className="w-4 h-4 ml-auto text-[#FD5B00]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">
          
          {/* Left Panel - Login Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center order-2 md:order-1">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-[#FD5B00]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#FD5B00]">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t.subtitle}
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.loginAs}
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD5A00] focus:border-transparent transition"
                  required
                >
                  <option value="">{t.selectRole}</option>
                  <option value="student">{t.student}</option>
                  <option value="admin">{t.admin}</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD5A00] focus:border-transparent transition"
                  placeholder={t.emailPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.passwordLabel}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD5A00] focus:border-transparent transition"
                  placeholder={t.passwordPlaceholder}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-[#FD5B00] hover:text-black transition">
                    {t.forgotPassword}
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FD5B00] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD5A00] transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.loggingIn}
                  </>
                ) : (
                  t.loginButton
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                {t.noAccount}{' '}
                <Link to="/register" className="font-medium text-[#FD5B00] hover:text-black transition">
                  {t.registerNow}
                </Link>
              </p>
            </form>
          </div>

          {/* Right Panel - Welcome Section - ✅ Fixed order for mobile */}
          <div className="bg-[#FD5B00] p-8 lg:p-12 text-white flex flex-col justify-center order-1 md:order-2">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                {t.rightPanelTitle}
              </h2>
              <p className="text-orange-100 mb-8 text-lg">
                {t.rightPanelSubtitle}
              </p>
              <ul className="space-y-4 text-left max-w-md mx-auto">
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>{t.feature1}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>{t.feature2}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>{t.feature3}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>{t.feature4}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slide-up {
            from {
              transform: translateY(30px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.8s ease-out;
          }
          
          .animate-slide-up-delay {
            animation: slide-up 0.8s ease-out 0.2s both;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default Login;