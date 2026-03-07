import React, { useState, useEffect, useRef } from 'react';

const FeatureCard = ({ feature, index, isVisible }) => {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { 
        threshold: 0.2, 
        rootMargin: '50px' 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform border border-gray-100 overflow-hidden"
      style={{
        transitionDelay: `${index * 100}ms`,
        transition: 'all 0.6s ease-out',
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        opacity: isInView ? 1 : 0
      }}
    >
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-teal-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Icon Container */}
      <div 
        className="relative inline-flex p-2.5 sm:p-3 lg:p-4 rounded-xl bg-gradient-to-br from-[#14B8A6] to-teal-600 text-white mb-3 sm:mb-4 lg:mb-6 transition-transform duration-300 shadow-lg"
        style={{
          transform: isInView ? 'scale(1)' : 'scale(0.8)',
          transitionDelay: `${index * 100 + 200}ms`
        }}
      >
        {feature.icon}
      </div>
      
      {/* Content */}
      <h3 
        className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 group-hover:text-gray-800 transition-colors duration-300 relative z-10"
        style={{
          transform: isInView ? 'translateX(0)' : 'translateX(-20px)',
          opacity: isInView ? 1 : 0,
          transitionDelay: `${index * 100 + 300}ms`
        }}
      >
        {feature.title}
      </h3>
      
      <p 
        className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed relative z-10"
        style={{
          transform: isInView ? 'translateX(0)' : 'translateX(-20px)',
          opacity: isInView ? 1 : 0,
          transitionDelay: `${index * 100 + 400}ms`
        }}
      >
        {feature.description}
      </p>
      
      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#14B8A6] to-teal-600 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

const EnglishFeatureCard = ({ feature, index, isVisible }) => {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { 
        threshold: 0.2, 
        rootMargin: '50px' 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform cursor-pointer relative overflow-hidden"
      style={{
        transitionDelay: `${index * 150}ms`,
        transition: 'all 0.6s ease-out',
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        opacity: isInView ? 1 : 0
      }}
    >
      {/* Background overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-teal-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Image Container */}
        <div 
          className="w-full flex justify-center mb-4 sm:mb-5 lg:mb-6"
          style={{
            transform: isInView ? 'scale(1)' : 'scale(0.8)',
            transitionDelay: `${index * 150 + 200}ms`
          }}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl flex items-center justify-center transition-transform duration-300">
            <img
              src={feature.img}
              alt={feature.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Title */}
        <h3 
          className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 text-center mb-3 sm:mb-4 group-hover:text-[#14B8A6] transition-colors duration-300 leading-snug px-1 sm:px-2"
          style={{
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0,
            transitionDelay: `${index * 150 + 300}ms`
          }}
        >
          {feature.title}
        </h3>
        
        {/* Underline */}
        <div 
          className="w-12 sm:w-14 h-1 bg-gradient-to-r from-[#14B8A6] to-teal-600 mx-auto mb-3 sm:mb-4 transition-all duration-300"
          style={{
            transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
            transitionDelay: `${index * 150 + 400}ms`
          }}
        ></div>
        
        {/* Description */}
        <p 
          className="text-xs sm:text-sm lg:text-base text-gray-600 text-center leading-relaxed px-1 sm:px-2"
          style={{
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0,
            transitionDelay: `${index * 150 + 500}ms`
          }}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
};

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const englishHeaderRef = useRef(null);
  const ctaRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [englishHeaderVisible, setEnglishHeaderVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const features = {
    title: 'Why Choose Tree Campus?',
    subtitle: 'Transform your English learning experience with cutting-edge technology and proven methods',
    items: [
      {
        icon: (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
        ),
        title: 'Live Interactive Classes',
        description: 'Join real-time sessions with certified teachers. Interactive whiteboard, breakout rooms, and instant feedback.',
      },
      {
        icon: (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
        ),
        title: 'Gamified Learning',
        description: 'Master English through engaging games. Earn points, unlock levels, and compete with friends.',
      },
      {
        icon: (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
          </svg>
        ),
        title: 'HD Video Library',
        description: 'Access 1000+ hours of premium video content. Download for offline learning anytime.',
      },
      {
        icon: (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        ),
        title: 'Verified Certificates',
        description: 'Earn industry-recognized certificates. Boost your career and academic prospects.',
      },
      {
        icon: (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
        ),
        title: 'Smart Assessments',
        description: 'AI-powered quizzes adapt to your level. Detailed analytics and personalized feedback.',
      },
      {
        icon: (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
          </svg>
        ),
        title: 'AI Speaking Partner',
        description: 'Practice conversations 24/7 with our AI assistant. Perfect your pronunciation and fluency.',
      }
    ]
  };

  const englishFeatures = [
    {
      title: "अंग्रेज़ी बोलने और लिखने का पाठ्यक्रम",
      description: "अंग्रेजी में परेशानी (पढ़ना, लिखना और बोलना) या नियमित जीवन में दिन-प्रतिदिन संचार में आत्मविश्वास की कमी?",
      img: "https://res.cloudinary.com/dtcaankcx/image/upload/v1763973292/English_Slider_egvmx7.png",
    },
    {
      title: "सार्वजनिक बोलने और इंटरव्यू स्किल",
      description: "एक प्रोफेशनल की तरह इंग्लिश बोलना सीखें, एक बेहतर नौकरी पाएं; अपनी बिक्री बढ़ाएं और अपने लक्षित दर्शकों को आसानी से प्रभावित करें।",
      img: "https://res.cloudinary.com/dtcaankcx/image/upload/v1763973292/English_Slider_egvmx7.png",
    },
    {
      title: "शब्दावली और व्याकरण सीखें",
      description: "Tree Campus पाठ्यक्रम स्टेप बाय स्टेप आपकी वोकैबुलरी और ग्रामर सीखने में सहायता करेंगे।",
      img: "https://res.cloudinary.com/dtcaankcx/image/upload/v1763973292/English_Slider_egvmx7.png",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observers = [
      { ref: headerRef, setter: setHeaderVisible },
      { ref: englishHeaderRef, setter: setEnglishHeaderVisible },
      { ref: ctaRef, setter: setCtaVisible }
    ];

    const observerInstances = observers.map(({ ref, setter }) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setter(true);
            } else {
              setter(false);
            }
          });
        },
        { 
          threshold: 0.3, 
          rootMargin: '0px 0px -50px 0px'
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return { observer, ref };
    });

    return () => {
      observerInstances.forEach(({ observer, ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main Features Header */}
        <div 
          ref={headerRef}
          className="text-center mb-10 sm:mb-16 lg:mb-20 transition-all duration-1000 ease-out"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-[#14B8A6] to-teal-600 bg-clip-text text-transparent leading-tight px-2 sm:px-4">
            {features.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
            {features.subtitle}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-20">
          {features.items.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              index={index} 
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* English Features Section */}
        <div className="mb-16 sm:mb-20">
          <div 
            ref={englishHeaderRef}
            className="text-center mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 ease-out"
            style={{
              opacity: englishHeaderVisible ? 1 : 0,
              transform: englishHeaderVisible ? 'scale(1)' : 'scale(0.9)'
            }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-[#14B8A6] to-teal-600 bg-clip-text text-transparent leading-tight px-2 sm:px-4">
              English Speaking Course Online Free
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
              स्पीक इंग्लिश प्रोफेशनली – अपनी कम्युनिकेशन स्किल को सुधारें
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {englishFeatures.map((feature, index) => (
              <EnglishFeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div 
          ref={ctaRef}
          className="text-center transition-all duration-1000 ease-out"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 font-medium px-2 sm:px-4">
            Join 50,000+ students who transformed their English skills
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-3 sm:px-4 max-w-lg mx-auto sm:max-w-none">
            <a
              href="/courses"
              className="inline-block px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-[#14B8A6] to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base lg:text-lg transform hover:scale-105 active:scale-95"
            >
              Start Free Trial →
            </a>
            <a
              href="/courses"
              className="inline-block px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all duration-300 font-semibold text-sm sm:text-base lg:text-lg active:scale-95"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;