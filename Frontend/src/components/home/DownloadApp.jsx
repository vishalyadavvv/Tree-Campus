import React, { useState, useEffect, useRef } from 'react';

const DownloadApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const downloadRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Reset for both scroll directions
            setIsVisible(false);
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (downloadRef.current) {
      observer.observe(downloadRef.current);
    }

    return () => {
      if (downloadRef.current) {
        observer.unobserve(downloadRef.current);
      }
    };
  }, []);

  return (
    <section ref={downloadRef} className="py-12 bg-[#FE8361] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-10 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>

          {/* LEFT SIDE - Animate from left */}
          <div className={`md:w-1/2 text-center md:text-left transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Download Mobile App
            </h2>

            <p className="text-lg mb-4 text-white/90">
              Learn English anywhere, anytime with our powerful mobile app.
            </p>

            {/* FEATURES */}
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {[
                'Offline lesson access',
                'Push notifications',
                'Progress tracking',
                'Daily reminders'
              ].map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-center space-x-2 transition-all duration-700 ease-out"
                  style={{
                    transitionDelay: `${index * 150 + 300}ms`,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isVisible ? 1 : 0
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE - Animate from right */}
          <div className={`md:w-1/2 flex flex-col md:flex-col lg:flex-row justify-center items-center gap-4 transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-10'
          }`}>

            {/* GOOGLE PLAY BUTTON */}
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-56 space-x-3 bg-black px-5 py-3 rounded-lg hover:bg-gray-900 transition transform hover:scale-105 duration-300"
              style={{
                transitionDelay: '500ms',
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                opacity: isVisible ? 1 : 0
              }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="white">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </a>

            {/* APP STORE BUTTON */}
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-56 space-x-3 bg-black px-5 py-3 rounded-lg hover:bg-gray-900 transition transform hover:scale-105 duration-300"
              style={{
                transitionDelay: '700ms',
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                opacity: isVisible ? 1 : 0
              }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="white">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.01 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;