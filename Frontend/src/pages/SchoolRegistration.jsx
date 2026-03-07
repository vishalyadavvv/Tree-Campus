import React, { useState } from 'react';
import axios from 'axios';


const SchoolRegistration = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolEmail: '',
    schoolAddress: '',
    schoolPhone: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    termsAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // School Name validation
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    } else if (formData.schoolName.trim().length < 3) {
      newErrors.schoolName = 'School name must be at least 3 characters long';
    }

    // School Email validation
    if (!formData.schoolEmail.trim()) {
      newErrors.schoolEmail = 'School email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.schoolEmail)) {
      newErrors.schoolEmail = 'Please enter a valid email address (e.g. school@example.com)';
    }

    // School Address validation
    if (!formData.schoolAddress.trim()) {
      newErrors.schoolAddress = 'School address is required';
    } else if (formData.schoolAddress.trim().length < 10) {
      newErrors.schoolAddress = `Address must be at least 10 characters long (currently ${formData.schoolAddress.trim().length})`;
    }

    // School Phone validation
    if (!formData.schoolPhone.trim()) {
      newErrors.schoolPhone = 'School phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.schoolPhone.replace(/\D/g, ''))) {
      newErrors.schoolPhone = 'Phone number must be 10-15 digits';
    }

    // Contact Person Name validation
    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = 'Contact person name is required';
    } else if (formData.contactPersonName.trim().length < 3) {
      newErrors.contactPersonName = 'Contact person name must be at least 3 characters long';
    }

    // Contact Person Phone validation
    if (!formData.contactPersonPhone.trim()) {
      newErrors.contactPersonPhone = 'Contact person phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.contactPersonPhone.replace(/\D/g, ''))) {
      newErrors.contactPersonPhone = 'Phone number must be 10-15 digits';
    }

    // Contact Person Email validation
    if (!formData.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = 'Contact person email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactPersonEmail)) {
      newErrors.contactPersonEmail = 'Please enter a valid email address (e.g. contact@example.com)';
    }

    // Terms acceptance validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions to proceed';
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
      const response = await axios.post(import.meta.env.VITE_API_URL + '/registerSchool', {
        ...formData,
        schoolPhone: formData.schoolPhone.replace(/\D/g, ''),
        contactPersonPhone: formData.contactPersonPhone.replace(/\D/g, ''),
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          schoolName: '',
          schoolEmail: '',
          schoolAddress: '',
          schoolPhone: '',
          contactPersonName: '',
          contactPersonPhone: '',
          contactPersonEmail: '',
          termsAccepted: false
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
    <div className="min-h-screen ">
      {/* Professional Header with Background Image */}
      <header 
        className="relative bg-cover bg-center py-10 md:py-10 px-4 text-white shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')`
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
            School Registration
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Join Tree Campus to provide world-class English education to your students
          </p>
          
          {/* Benefits Timeline */}
          <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Quality Curriculum</h3>
                <p className="text-white/90 text-sm">Comprehensive English learning materials</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Teacher Support</h3>
                <p className="text-white/90 text-sm">Dedicated support and training</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
                <p className="text-white/90 text-sm">Monitor student performance</p>
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
          {/* Information Alert */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Registration Information</h3>
                <ul className="text-teal-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>Please provide accurate school and contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>Our team will contact you within 24-48 hours to complete the onboarding process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>All fields marked with * are required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-teal-500 to-teal-500 px-8 py-6">
              <h2 className="text-2xl font-bold text-black flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                School Information
              </h2>
            </div>
            
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* School Name */}
                <div>
                  <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                    </svg>
                    School Name *
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                      errors.schoolName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your school's full name"
                  />
                  {errors.schoolName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.schoolName}
                    </p>
                  )}
                </div>

                {/* School Email and Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* School Email */}
                  <div>
                    <label htmlFor="schoolEmail" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      School Email *
                    </label>
                    <input
                      type="email"
                      id="schoolEmail"
                      name="schoolEmail"
                      value={formData.schoolEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                        errors.schoolEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="school@example.com"
                    />
                    {errors.schoolEmail && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {errors.schoolEmail}
                      </p>
                    )}
                  </div>

                  {/* School Phone */}
                  <div>
                    <label htmlFor="schoolPhone" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                      School Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="schoolPhone"
                      name="schoolPhone"
                      value={formData.schoolPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                        errors.schoolPhone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter school phone number"
                    />
                    {errors.schoolPhone && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {errors.schoolPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* School Address */}
                <div>
                  <label htmlFor="schoolAddress" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    School Address *
                  </label>
                  <textarea
                    id="schoolAddress"
                    name="schoolAddress"
                    rows="3"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                      errors.schoolAddress ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter complete school address"
                  ></textarea>
                  {errors.schoolAddress && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.schoolAddress}
                    </p>
                  )}
                </div>

                {/* Contact Person Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    Contact Person Information
                  </h3>

                  {/* Contact Person Name */}
                  <div className="mb-8">
                    <label htmlFor="contactPersonName" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      id="contactPersonName"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                        errors.contactPersonName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter contact person's full name"
                    />
                    {errors.contactPersonName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {errors.contactPersonName}
                      </p>
                    )}
                  </div>

                  {/* Contact Person Email and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Person Email */}
                    <div>
                      <label htmlFor="contactPersonEmail" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        Contact Person Email *
                      </label>
                      <input
                        type="email"
                        id="contactPersonEmail"
                        name="contactPersonEmail"
                        value={formData.contactPersonEmail}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                          errors.contactPersonEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="contact@example.com"
                      />
                      {errors.contactPersonEmail && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                          </svg>
                          {errors.contactPersonEmail}
                        </p>
                      )}
                    </div>

                    {/* Contact Person Phone */}
                    <div>
                      <label htmlFor="contactPersonPhone" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        Contact Person Phone *
                      </label>
                      <input
                        type="tel"
                        id="contactPersonPhone"
                        name="contactPersonPhone"
                        value={formData.contactPersonPhone}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                          errors.contactPersonPhone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter contact person phone number"
                      />
                      {errors.contactPersonPhone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                          </svg>
                          {errors.contactPersonPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="bg-teal-50 p-6 rounded-xl border-2 border-teal-200">
                  <div className="flex items-start">
                    <input
                      id="termsAccepted"
                      name="termsAccepted"
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="termsAccepted" className="ml-3 block text-sm text-gray-700">
                      <span className="font-semibold text-lg">I agree to the terms and conditions</span>
                      <ul className="mt-3 text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          <span>I confirm that all provided information is accurate</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          <span>I agree to receive communication regarding school registration</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          <span>I understand that this registration is subject to approval</span>
                        </li>
                      </ul>
                    </label>
                  </div>
                  {errors.termsAccepted && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.termsAccepted}
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
                        <h4 className="text-lg font-semibold text-green-800">Registration Submitted Successfully!</h4>
                        <p className="text-green-700 mt-1">
                          Thank you for registering your school. Our team will contact you within 24-48 hours to complete the onboarding process.
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
                        <h4 className="text-lg font-semibold text-red-800">Registration Failed</h4>
                        <p className="text-red-700 mt-1">
                          There was an error submitting your registration. Please try again or contact our support team if the problem persists.
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
                    className={`w-full py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-500 to-teal-500 hover:from-teal-600 hover:to-teal-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Registration...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                        </svg>
                        Register School
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 mt-16">
        <div className="container mx-auto text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="mailto:support@treecampus.com" className="text-gray-400 hover:text-white transition-colors">
              Contact Support
            </a>
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Tree Campus. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style>{`
        .bg-primary {
          background-color: #14B8A6;
        }
        
        .text-primary {
          color: #14B8A6;
        }
        
        .border-primary {
          border-color: #14B8A6;
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

export default SchoolRegistration;