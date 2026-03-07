import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const translations = {
  english: {
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    title: 'Create Your Account',
    subtitle: 'Join thousands of learners and start your journey today',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter 10 digit phone number',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Create a strong password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    showPassword: 'Show',
    hidePassword: 'Hide',
    registerButton: 'Register',
    registering: 'Registering...',
    haveAccount: 'Already have an account?',
    loginNow: 'Login',
    fillAllFields: 'Please fill in all fields',
    invalidPhone: 'Please enter a valid 10-digit phone number',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    registrationFailed: 'Registration failed. Please try again.',
    otpMessage: 'Please check your WhatsApp for OTP',
    welcomeTitle: 'Welcome to TreeCampus',
    welcomeSubtitle: 'Join our community and unlock unlimited learning opportunities',
    feature1: '1000+ Courses Available',
    feature2: 'Learn from Expert Instructors',
    feature3: 'Earn Certificates',
    feature4: '24/7 Access',
    signUpWithGoogle: 'Sign up with Google',
    or: 'OR'
  },
  hindi: {
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    title: 'अपना अकाउंट बनाएं',
    subtitle: 'हजारों शिक्षार्थियों के साथ जुड़ें और आज ही अपनी यात्रा शुरू करें',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    phoneLabel: 'फोन नंबर',
    phonePlaceholder: '10 अंकों का फोन नंबर दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'एक मजबूत पासवर्ड बनाएं',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'अपना पासवर्ड फिर से दर्ज करें',
    showPassword: 'दिखाएं',
    hidePassword: 'छुपाएं',
    registerButton: 'रजिस्टर करें',
    registering: 'रजिस्टर हो रहा है...',
    haveAccount: 'पहले से अकाउंट है?',
    loginNow: 'लॉगिन करें',
    fillAllFields: 'कृपया सभी फ़ील्ड भरें',
    invalidPhone: 'कृपया वैध 10 अंकों का फोन नंबर दर्ज करें',
    passwordTooShort: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    registrationFailed: 'रजिस्ट्रेशन विफल रहा। कृपया पुनः प्रयास करें।',
    otpMessage: 'कृपया OTP के लिए अपना व्हाट्सएप चेक करें',
    welcomeTitle: 'LMS में आपका स्वागत है',
    welcomeSubtitle: 'हमारे समुदाय में शामिल हों और असीमित सीखने के अवसर प्राप्त करें',
    feature1: '1000+ कोर्स उपलब्ध',
    feature2: 'विशेषज्ञ प्रशिक्षकों से सीखें',
    feature3: 'प्रमाणपत्र अर्जित करें',
    feature4: '24/7 तक पहुंच',
    signUpWithGoogle: 'गूगल के साथ साइन अप करें',
    or: 'या'
  }
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('lms-language');
    return savedLanguage || 'english';
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError(t.fillAllFields);
      return false;
    }
    
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError(t.invalidPhone);
      return false;
    }

    if (formData.password.length < 6) {
      setError(t.passwordTooShort);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      
      navigate('/verify-otp', { 
        state: { 
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          message: response.message || t.otpMessage
        } 
      });
    } catch (err) {
      setError(err.message || t.registrationFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-red-50 to-pink-50 flex items-center justify-center p-4 relative">
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-teal-50 text-teal-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentLanguage === lang.code ? "bg-teal-100 text-teal-700" : "text-gray-700"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <svg className="w-4 h-4 ml-auto" style={{ color: '#14B8A6' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">
          
          {/* Left Panel - Register Form (appears first on mobile) */}
          <div className="p-8 lg:p-12 flex flex-col justify-center order-2 md:order-1">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16" style={{ color: '#14B8A6' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t.subtitle}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_ORIGIN}/api/auth/google`}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition transform hover:-translate-y-0.5"
                type="button"
              >
                <img className="h-5 w-5 mr-2" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                {t.signUpWithGoogle}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t.or}</span>
                </div>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.nameLabel}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                  placeholder={t.namePlaceholder}
                />
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
                  className="appearance-none w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                  placeholder={t.emailPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.phoneLabel}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                  placeholder={t.phonePlaceholder}
                  maxLength="10"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                    placeholder={t.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-sm font-medium hover:opacity-80 transition"
                    style={{ color: '#14B8A6' }}
                  >
                    {showPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                    placeholder={t.confirmPasswordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-sm font-medium hover:opacity-80 transition"
                    style={{ color: '#14B8A6' }}
                  >
                    {showConfirmPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                style={{ backgroundColor: '#115E59' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0F766E'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#115E59'}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  t.registerButton
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                {t.haveAccount}{' '}
                <Link to="/login" className="font-medium hover:opacity-80 transition" style={{ color: '#14B8A6' }}>
                  {t.loginNow}
                </Link>
              </p>
            </form>
          </div>

          {/* Right Panel - Welcome Section (appears second on mobile) */}
          <div className="p-8 lg:p-12 text-white flex flex-col justify-center order-1 md:order-2" style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)' }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                {t.welcomeTitle}
              </h2>
              <p className="text-teal-100 mb-8 text-lg">
                {t.welcomeSubtitle}
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
            from { opacity: 0; }
            to { opacity: 1; }
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
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
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

          input:focus {
            ring: 2px;
            ring-color: #14B8A6;
            border-color: transparent;
          }
        `}</style>
      </div>
    </>
  );
};

export default Register;