// Frontend/src/pages/CompleteProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const translations = {
  english: {
    title: 'Complete Your Profile',
    subtitle: 'Just a few more details to finish setting up your account',
    phoneLabel: 'Mobile Number',
    phonePlaceholder: 'Enter 10-digit mobile number',
    passwordLabel: 'Create Password',
    passwordPlaceholder: 'Enter password (min 6 characters)',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    continueButton: 'Continue',
    processing: 'Processing...',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Phone number must be 10 digits',
    passwordRequired: 'Password is required',
    passwordShort: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    welcomeBack: 'Welcome',
    googleUser: 'Signed in with Google',
    step1: 'Step 1: Enter your mobile number',
    step2: 'Step 2: Create a password',
    whyNeeded: 'We need your phone for OTP verification and password for alternate login.',
  },
  hindi: {
    title: 'अपनी प्रोफ़ाइल पूरी करें',
    subtitle: 'अपना खाता सेटअप पूरा करने के लिए कुछ और विवरण',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
    passwordLabel: 'पासवर्ड बनाएं',
    passwordPlaceholder: 'पासवर्ड दर्ज करें (न्यूनतम 6 अक्षर)',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'पासवर्ड फिर से दर्ज करें',
    continueButton: 'जारी रखें',
    processing: 'प्रोसेसिंग...',
    phoneRequired: 'फोन नंबर आवश्यक है',
    phoneInvalid: 'फोन नंबर 10 अंकों का होना चाहिए',
    passwordRequired: 'पासवर्ड आवश्यक है',
    passwordShort: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    welcomeBack: 'स्वागत है',
    googleUser: 'Google से साइन इन किया गया',
    step1: 'चरण 1: अपना मोबाइल नंबर दर्ज करें',
    step2: 'चरण 2: पासवर्ड बनाएं',
    whyNeeded: 'OTP सत्यापन के लिए आपके फोन और वैकल्पिक लॉगिन के लिए पासवर्ड की आवश्यकता है।',
  }
};

const CompleteProfile = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('lms-language') || 'english';
  });

  const navigate = useNavigate();
  const location = useLocation();
  
  const user = location.state?.user || JSON.parse(localStorage.getItem('user') || '{}');
  const t = translations[currentLanguage];

  useEffect(() => {
    // If no user or user already has complete profile, redirect
    const token = localStorage.getItem('token');
    if (!token || !user?.id) {
      navigate('/login', { replace: true });
      return;
    }

    // If profile already complete, redirect to dashboard
    if (user.hasPhone && user.hasPassword) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.phone) {
      setError(t.phoneRequired);
      return false;
    }
    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      setError(t.phoneInvalid);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError(t.passwordRequired);
      return false;
    }
    if (formData.password.length < 6) {
      setError(t.passwordShort);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNext();
      return;
    }

    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/complete-google-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete profile');
      }

      // Update user in localStorage with new phone
      const updatedUser = { ...user, phone: formData.phone, hasPhone: true, hasPassword: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Navigate to OTP verification
      navigate('/verify-otp', {
        state: {
          email: user.email,
          phone: formData.phone,
          mode: 'register',
          name: user.name,
          triggerAutoResend: false // OTP already sent by backend
        },
        replace: true
      });

    } catch (err) {
      console.error('Complete profile error:', err);
      setError(err.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#FD5B00] p-6 text-white text-center">
          <div className="flex justify-center mb-3">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.name} 
                className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold">{t.welcomeBack}, {user.name?.split(' ')[0]}!</h2>
          <p className="text-orange-100 text-sm mt-1 flex items-center justify-center gap-2">
            <img className="h-4 w-4" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            {t.googleUser}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{t.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{t.whyNeeded}</p>

          {/* Progress Steps */}
          <div className="flex items-center mb-6">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-[#FD5B00]' : 'bg-gray-200'}`}></div>
            <div className="w-2"></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-[#FD5B00]' : 'bg-gray-200'}`}></div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <p className="text-sm font-medium text-[#FD5B00] mb-2">{t.step1}</p>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phoneLabel}
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: value });
                        setError('');
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#FD5B00] focus:border-transparent"
                      placeholder={t.phonePlaceholder}
                      maxLength="10"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm font-medium text-[#FD5B00] mb-2">{t.step2}</p>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.passwordLabel}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD5B00] focus:border-transparent"
                    placeholder={t.passwordPlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.confirmPasswordLabel}
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD5B00] focus:border-transparent"
                    placeholder={t.confirmPasswordPlaceholder}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-[#FD5B00] text-white rounded-lg font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? t.processing : t.continueButton}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
