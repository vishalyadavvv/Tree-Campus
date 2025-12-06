import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Email & mode (register or forgot-password)
  const email = location.state?.email;
  const name = location.state?.name || '';
  const mode = location.state?.mode || 'register'; // default is registration

  const { verifyOTP, resendOTP } = useContext(AuthContext);

  useEffect(() => {
    if (!email) {
      navigate(mode === 'forgot-password' ? '/forgot-password' : '/register');
    }
  }, [email, navigate, mode]);

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
          ? 'Email verified successfully! Redirecting to login...'
          : 'OTP verified! Redirecting to reset password...'
      );

      setTimeout(() => {
        if (mode === 'register') {
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

  const handleResendOTP = async () => {
    setError('');
    setSuccessMessage('');
    setResending(true);

    try {
      await resendOTP(email, mode); // optionally pass mode to backend
      setSuccessMessage('OTP has been resent to your email');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

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
              <svg className="w-16 h-16" style={{ color: '#FD5B00' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {verificationSuccess ? 'Verification Successful!' : 'Verify Your Email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {verificationSuccess ? (
              mode === 'register'
                ? 'Your email has been verified successfully'
                : 'OTP verified! Redirecting to reset password...'
            ) : (
              <>
                We've sent a 6-digit OTP to<br />
                <span className="font-medium text-gray-900">{email}</span>
              </>
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
                disabled={resending}
                className="text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
                style={{ color: '#FD5B00' }}
              >
                {resending ? 'Resending...' : "Didn't receive OTP? Resend"}
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
