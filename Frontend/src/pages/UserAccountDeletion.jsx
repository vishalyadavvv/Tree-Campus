import React, { useState } from 'react';
import axios from 'axios';

const AccountDeletionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    confirmation: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.confirmation) {
      newErrors.confirmation = 'You must confirm understanding the deletion process';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post('/api/account-deletion-request', {
        ...formData,
        phone: formData.phone.replace(/\D/g, ''),
        submittedAt: new Date().toISOString(),
        status: 'pending_verification'
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          reason: '',
          confirmation: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Professional Header matching English Speaking Platform */}
      <header 
        className="relative bg-cover bg-center py-10 md:py-10 px-4 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
           url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')`
        }}
      >
        <div className="container mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
            Account Deletion Request
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            We're sorry to see you go. Please provide your details below to start the account deletion process.
          </p>
          
          {/* Process Timeline */}
          <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-lg">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Submit Request</h3>
                <p className="text-white/90 text-sm">Fill out the form below with your account details</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-lg">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Verification</h3>
                <p className="text-white/90 text-sm">Verify your request via email confirmation</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-lg">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">90-Day Processing</h3>
                <p className="text-white/90 text-sm">Complete deletion within 90 days after verification</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated floating elements */}
        <div className="absolute top-10 left-10 w-6 h-6 bg-white rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-white rounded-full opacity-50 animate-ping"></div>
        <div className="absolute bottom-16 left-1/4 w-8 h-8 bg-white rounded-full opacity-60 animate-pulse"></div>
      </header>

      {/* Main Form Content */}
      <main className="container mx-auto py-12 px-4 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Warning Alert */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Important: Read Before Proceeding</h3>
                <ul className="text-red-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>Once you submit this request, we'll send a verification email to confirm your identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>After verification, your account deletion will be processed within 90 days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>All your data, including progress, certificates, and personal information will be permanently deleted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>This action is irreversible and cannot be undone</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-primary to-orange-500 px-8 py-6">
              <h2 className="text-2xl font-bold text-black flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Account Information
              </h2>
            </div>
            
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name and Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your full name as registered"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your registered phone number"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your registered email address"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Reason Field */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                    Reason for Deletion (Optional)
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="4"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-gray-400"
                    placeholder="Please share your reason for deleting the account (optional)"
                  ></textarea>
                </div>

                {/* Confirmation Checkbox */}
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start">
                    <input
                      id="confirmation"
                      name="confirmation"
                      type="checkbox"
                      checked={formData.confirmation}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="confirmation" className="ml-3 block text-sm text-gray-700">
                      <span className="font-semibold text-lg">I understand and confirm that:</span>
                      <ul className="mt-3 text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          <span>I will receive a verification email to confirm this request</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          <span>After verification, it will take up to 90 days to process my request</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          <span>All my data will be permanently deleted and cannot be recovered</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          <span>This action is irreversible and cannot be undone</span>
                        </li>
                      </ul>
                    </label>
                  </div>
                  {errors.confirmation && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.confirmation}
                    </p>
                  )}
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <div>
                        <h4 className="text-lg font-semibold text-green-800">Request Submitted Successfully!</h4>
                        <p className="text-green-700 mt-1">
                          We've sent a verification email to your address. Please check your inbox and follow the instructions to confirm your account deletion request.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      </svg>
                      <div>
                        <h4 className="text-lg font-semibold text-red-800">Submission Failed</h4>
                        <p className="text-red-700 mt-1">
                          There was an error submitting your request. Please try again or contact our support team if the problem persists.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Your Request...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Submit Deletion Request
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      

      {/* Custom CSS for animations */}
      <style jsx>{`
        .bg-primary {
          background-color: #FD5A00;
        }
        
        .text-primary {
          color: #FD5A00;
        }
        
        .border-primary {
          border-color: #FD5A00;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default AccountDeletionForm;