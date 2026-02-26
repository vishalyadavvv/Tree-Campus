import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyOTP, resendOTP, user: authUser } = useContext(AuthContext);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [currentPhone, setCurrentPhone] = useState(location.state?.phone || authUser?.phone || '');
  const [tempPhone, setTempPhone] = useState(location.state?.phone || authUser?.phone || '');

  // Email & mode (register or forgot-password)
  const email = location.state?.email;
  const name = location.state?.name || '';
  const mode = location.state?.mode || 'register'; // default is registration

  useEffect(() => {
    if (!email) {
      navigate(mode === 'forgot-password' ? '/forgot-password' : '/register');
    }
  }, [email, navigate, mode]);

  // Removed bad useEffect placement from here


  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await verifyOTP(email, otp, mode); // optionally pass mode to backend
      setVerificationSuccess(true);

      setSuccessMessage(
        mode === 'register'
          ? 'Phone verified successfully! Redirecting to login...'
          : 'WhatsApp OTP verified! Redirecting to reset password...'
      );

      setTimeout(() => {
        if (mode === 'register') {
          // Check if this is a Google user completing profile
          const storedUser = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          
          if (storedUser && token) {
            // User already has token (Google OAuth flow) - go straight to dashboard
            try {
              const user = JSON.parse(storedUser);
              // Update user in localStorage with verified status
              user.isVerified = true;
              user.hasPhone = true;
              localStorage.setItem('user', JSON.stringify(user));
              
              // Redirect to appropriate dashboard
              navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
              return;
            } catch (e) {
              console.error('Failed to parse stored user', e);
            }
          }
          
          // Normal registration flow - redirect to login
          navigate('/login', { state: { message: 'Registration successful! Please login.', email } });
        } else if (mode === 'forgot-password') {
          navigate('/reset-password', { state: { email } });
        }
      }, 2000);
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (force = false) => {
    if (!canResend && !force && !isEditingPhone) return;
    
    setError('');
    setSuccessMessage('');
    setResending(true);
    
    // When editing phone, we use the tempPhone
    const phoneToUse = isEditingPhone ? tempPhone : currentPhone;

    try {
      const result = await resendOTP(email, isEditingPhone ? tempPhone : undefined); 
      setSuccessMessage(result.message || 'A new OTP has been sent to your WhatsApp');
      
      if (isEditingPhone) {
        setCurrentPhone(tempPhone);
        setIsEditingPhone(false);
      }
      setTimer(30);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  // Handle auto-resend
  useEffect(() => {
    if (location.state?.triggerAutoResend) {
      console.log('🔄 Triggering auto-resend of OTP...');
      // Force resend regardless of initial timer
      handleResendOTP(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {verificationSuccess ? (
              <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            ) : (
              <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {verificationSuccess ? 'Verification Successful!' : 'Verify Your Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {verificationSuccess ? (
              mode === 'register'
                ? 'Your phone number has been verified successfully'
                : 'WhatsApp OTP verified! Redirecting to reset password...'
            ) : (
              <div className="space-y-2">
                <p>We've sent a 6-digit OTP to your WhatsApp</p>
                {isEditingPhone ? (
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <input
                      type="text"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-40 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-center font-medium text-gray-900"
                      placeholder="10 digit number"
                      maxLength="10"
                    />
                    <button
                      onClick={() => handleResendOTP(true)}
                      disabled={resending || tempPhone.length !== 10}
                      className="text-white px-3 py-1 rounded-md text-xs font-medium transition"
                      style={{ backgroundColor: '#FD5B00' }}
                    >
                      {resending ? 'Sending...' : 'Save & Resend'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPhone(false);
                        setTempPhone(currentPhone);
                      }}
                      className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium text-gray-900">{currentPhone || email}</span>
                    <button 
                      onClick={() => setIsEditingPhone(true)}
                      className="text-xs text-orange-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {!verificationSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="appearance-none w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              style={{ backgroundColor: '#FD5B00' }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#E54F00')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#FD5B00')}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending || !canResend}
                className="text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
                style={{ color: '#FD5B00' }}
              >
                {resending 
                  ? 'Sending...' 
                  : !canResend 
                    ? `Resend OTP in ${timer}s` 
                    : "Didn't receive OTP? Resend"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              <Link to={mode === 'forgot-password' ? '/forgot-password' : '/login'} className="font-medium hover:opacity-80 transition" style={{ color: '#FD5B00' }}>
                Back
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
