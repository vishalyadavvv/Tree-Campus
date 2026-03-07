// client/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const primaryColor = '#14B8A6';
  const logoUrl = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';

  return (
    <footer className="bg-gray-900 text-white" style={{ borderTop: `4px solid ${primaryColor}` }}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logoUrl} alt="Tree Campus Logo" className="w-12 h-12 object-contain" />
              <div>
                <span className="text-xl font-bold text-white">Tree Campus</span>
                <p style={{ color: primaryColor }} className="text-sm font-medium">Learn English Free</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              सभी के लिए मुफ्त अंग्रेजी शिक्षा | Free English Education for All
            </p>
            <p className="text-gray-400 mb-6 text-sm">
              Empowering millions of learners with free English education through innovative technology and personalized learning experiences.
            </p>
            <div className="flex space-x-4">
              <a href="https://youtube.com/@treecampus?si=AOAr0U4a1ze-iiVr" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-lg"
                 style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', borderRadius: '8px' }}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.2)`}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.1)`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/groups/httpstreecampus.in/" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-lg"
                 style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.2)`}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.1)`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/treecampusfreelearningapp/?hl=en" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-lg"
                 style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.2)`}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.1)`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/Treecampus1" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-lg"
                 style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.2)`}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `rgba(20, 184, 166, 0.1)`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-white flex items-center" style={{ color: 'white' }}>
              <span style={{ width: '4px', height: '24px', backgroundColor: primaryColor, marginRight: '8px', borderRadius: '2px' }}></span>
              Courses
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Spoken English
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Grammar Basics
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Vocabulary Building
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Business English
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Interview Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-white flex items-center" style={{ color: 'white' }}>
              <span style={{ width: '4px', height: '24px', backgroundColor: primaryColor, marginRight: '8px', borderRadius: '2px' }}></span>
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/live-classes" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Live Classes
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Learning Games
                </Link>
              </li>
              <li>
                <Link to="/spokee" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Spokee AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/certificate" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Certificates
                </Link>
              </li>
              <li>
                <a
  href="https://play.google.com/store/apps/details?id=com.academy.tree_campus"
  target="_blank" // opens link in new tab
  rel="noopener noreferrer" // security best practice
  className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center"
>
  <span
    style={{
      width: '6px',
      height: '6px',
      backgroundColor: primaryColor,
      borderRadius: '50%',
      marginRight: '10px'
    }}
  ></span>
  Mobile App
</a>

              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-white flex items-center" style={{ color: 'white' }}>
              <span style={{ width: '4px', height: '24px', backgroundColor: primaryColor, marginRight: '8px', borderRadius: '2px' }}></span>
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-white flex items-center" style={{ color: 'white' }}>
              <span style={{ width: '4px', height: '24px', backgroundColor: primaryColor, marginRight: '8px', borderRadius: '2px' }}></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/become-teacher" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Become a Teacher
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/contest/schoolregistration" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Register School
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                  <span style={{ width: '6px', height: '6px', backgroundColor: primaryColor, borderRadius: '50%', marginRight: '10px' }}></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Download App Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-6 lg:mb-0 text-center lg:text-left">
              <h4 className="font-bold text-xl mb-2 text-white">Download Our App</h4>
              <p className="text-gray-400 max-w-md">
                Learn English anytime, anywhere with our mobile app. Practice speaking, listening, and grammar on the go!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.academy.tree_campus"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl flex items-center space-x-4 transition-all duration-300 hover:scale-105 hover:shadow-lg border"
                style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', borderColor: primaryColor }}
              >
                <svg className="w-10 h-10" style={{ color: primaryColor }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">GET IT ON</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.academy.tree_campus"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl flex items-center space-x-4 transition-all duration-300 hover:scale-105 hover:shadow-lg border"
                style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', borderColor: primaryColor }}
              >
                <svg className="w-10 h-10" style={{ color: primaryColor }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold text-white">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-5 h-5" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
               <a
  href="mailto:info@treecampus.in"
  className="text-sm text-white hover:text-green-400 transition-colors duration-300"
>
  info@treecampus.in
</a>

              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-5 h-5" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="text-sm text-white">India</span>
              </div>
            </div>
            {/* <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-5 h-5" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                </svg>
                <span className="text-sm text-white">+91 XXX XXX XXXX</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800 bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} Tree Campus. All rights reserved.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                Made with <span className="text-red-500">❤️</span> for English learners across India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;