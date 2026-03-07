import { useState, useEffect } from 'react';
// import Head from 'next/head';

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10-15 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters long';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please share your motivation for volunteering';
    } else if (formData.motivation.trim().length < 20) {
      newErrors.motivation = `Motivation must be at least 20 characters (currently ${formData.motivation.trim().length})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      const response = await fetch(import.meta.env.VITE_API_URL + '/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          motivation: ''
        });
        setErrors({});
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
    <>
      <title>Become a Volunteer – Tree Campus NGO</title>
      <meta name="description" content="Join Tree Campus NGO as a volunteer and help make English education accessible to all." />

      <div className="min-h-screen bg-white ">
        {/* Hero Section with Background Image */}
        <section className="relative py-12 lg:py-20 bg-gray-900 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            }}
          >
            {/* Dark Overlay for better text readability */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-teal-600/50"></div> */}
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`transform transition-all duration-1000 ${
              pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Volunteer Application
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white font-medium mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
                  Join Tree Campus NGO in Making Education Accessible
                </p>
                <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-white rounded-full mx-auto mb-8 sm:mb-12"></div>
                
                {/* Key Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12">
                  {[
                    { icon: '🌍', text: 'Global Impact' },
                    { icon: '📚', text: 'Education Focus' },
                    { icon: '🤝', text: 'Community Driven' }
                  ].map((item, index) => (
                    <div key={index} className="bg-red bg-opacity-15 backdrop-blur-sm rounded-lg p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20">
                      <div className="text-3xl sm:text-4xl mb-3">{item.icon}</div>
                      <p className="text-white text-base sm:text-lg font-semibold">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section - White Background */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 transform transition-all duration-1000 delay-300 ${
              pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Start Your Journey
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Complete the form below to join our mission of making quality English education accessible to everyone.
                </p>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 sm:mb-8 p-4 bg-green-50 border border-green-200 rounded-lg transform animate-scaleIn">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Application Submitted Successfully!
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Thank you for your interest in volunteering. We'll contact you soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 sm:mb-8 p-4 bg-red-50 border border-red-200 rounded-lg transform animate-scaleIn">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Submission Failed
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        Please try again. If the problem persists, contact us directly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Name Field */}
                  <div className="transform transition-all duration-500 delay-100 hover:scale-105">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name * <span className="text-gray-400 font-normal">(min 3 characters)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6] transition-all duration-300 text-sm sm:text-base ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="Enter your full name"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.name && <p className="mt-1.5 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="transform transition-all duration-500 delay-200 hover:scale-105">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6] transition-all duration-300 text-sm sm:text-base ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="Enter your email address"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    {errors.email && <p className="mt-1.5 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Phone Field */}
                  <div className="transform transition-all duration-500 delay-300 hover:scale-105">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number * <span className="text-gray-400 font-normal">(10-15 digits)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6] transition-all duration-300 text-sm sm:text-base ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="Enter your phone number"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                    </div>
                    {errors.phone && <p className="mt-1.5 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.phone}</p>}
                  </div>

                  {/* Address Field */}
                  <div className="transform transition-all duration-500 delay-400 hover:scale-105">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address * <span className="text-gray-400 font-normal">(min 10 characters)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6] transition-all duration-300 text-sm sm:text-base ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="Enter your complete address"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${errors.address ? 'text-red-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.address && <p className="mt-1.5 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.address}</p>}
                  </div>
                </div>

                {/* Motivation Field */}
                <div className="transform transition-all duration-500 delay-500 hover:scale-105">
                  <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer with us? * <span className="text-gray-400 font-normal">(min 20 characters)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="motivation"
                      name="motivation"
                      rows={5}
                      value={formData.motivation}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6] transition-all duration-300 resize-none text-sm sm:text-base ${errors.motivation ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                      placeholder="Share your motivation, relevant experience, and how you can contribute to our mission..."
                    />
                    <div className="absolute top-3 right-3 flex items-center pointer-events-none">
                      <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${errors.motivation ? 'text-red-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {errors.motivation ? <p className="text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.motivation}</p> : <span />}
                    <span className={`text-xs ${formData.motivation.trim().length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>{formData.motivation.trim().length}/20</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="transform transition-all duration-500 delay-700">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 sm:py-4 px-6 border border-transparent rounded-lg text-base sm:text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14B8A6] transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#14B8A6] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0F766E] shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm sm:text-base">Submitting...</span>
                      </div>
                    ) : (
                      'Submit Volunteer Application'
                    )}
                  </button>
                </div>

                <div className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                  <p>We respect your privacy and will never share your information with third parties.</p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Benefits Section - White Background */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Why Volunteer With Tree Campus?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Join a community dedicated to transforming lives through education
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Make Real Impact',
                  description: 'Directly contribute to making English education accessible to underprivileged communities worldwide.'
                },
                {
                  icon: '🌟',
                  title: 'Professional Growth',
                  description: 'Develop teaching, communication, and leadership skills in a supportive, professional environment.'
                },
                {
                  icon: '🤝',
                  title: 'Global Community',
                  description: 'Connect with like-minded professionals and educators passionate about social change and education.'
                }
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 transform transition-all duration-500 hover:scale-105 hover:shadow-xl text-center"
                >
                  <div className="text-3xl sm:text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}