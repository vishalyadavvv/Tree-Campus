import React, { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Refs for scroll animations
  const sectionRef = useRef(null);
  const trustBadgeRef = useRef(null);
  const headingRef = useRef(null);
  const contentCardRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const imageRef = useRef(null);
  const floatingBadgesRef = useRef(null);

  // Scroll animation states
  const [visibleElements, setVisibleElements] = useState({
    trustBadge: false,
    heading: false,
    contentCard: false,
    cta: false,
    stats: false,
    image: false,
    floatingBadges: false
  });

  // Parallax scroll position
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Handle scroll for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const elementName = entry.target.dataset.animate;
        if (elementName) {
          setVisibleElements((prev) => ({
            ...prev,
            [elementName]: entry.isIntersecting
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all animated elements
    const refs = [
      { ref: trustBadgeRef, name: 'trustBadge' },
      { ref: headingRef, name: 'heading' },
      { ref: contentCardRef, name: 'contentCard' },
      { ref: ctaRef, name: 'cta' },
      { ref: statsRef, name: 'stats' },
      { ref: imageRef, name: 'image' },
      { ref: floatingBadgesRef, name: 'floatingBadges' }
    ];

    refs.forEach(({ ref, name }) => {
      if (ref.current) {
        ref.current.dataset.animate = name;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveSection((prev) => (prev + 1) % 3);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const content = {
    sections: [
      {
        title: "Learn Spoken English for FREE",
        subtitle: "Master English in 90 Days",
        description: "Comprehensive course with live classes, video content, and assessment quizzes to master English speaking",
        features: [
          "Learn with Live Classes",
          "Practice with Assessment Quizzes",
          "Text and Video Course Material"
        ],
        image: "https://res.cloudinary.com/dtcaankcx/image/upload/v1763973292/English_Slider_egvmx7.png",
        icon: "🎓"
      },
      {
        title: "Learn English with Fun - Gamification",
        subtitle: "Interactive Games for Learning",
        description: "Engaging games that make learning English enjoyable and effective",
        features: [
          "Bird Saver Game - Learn English Translation",
          "Lock & Key Game - Learn Synonyms & Antonyms",
          "Vocabulary Game - Build English Vocabulary"
        ],
        image: "https://res.cloudinary.com/dtcaankcx/image/upload/v1763973362/Game_Slider_apzczk.png",
        icon: "🎮"
      },
      {
        title: "English Conversation Practice",
        subtitle: "Virtual Companion - Spokee",
        description: "Meet your conversational assistant. Converse with your Tree Campus Virtual Spokee to bring your learning into action.",
        features: [
          "AI-Powered Conversational Assistant",
          "Real-time Speech Practice",
          "Instant Feedback and Correction"
        ],
        image: "http://treecampus.in/wp-content/uploads/2021/11/slider-2.png",
        icon: "🤖"
      }
    ],
    ctaPrimary: "Start Learning Free",
    ctaSecondary: "Download App",
  };

  const activeContent = content.sections[activeSection];

  // Animation class generator
  const getAnimationClass = (elementName, direction = 'up', delay = 0) => {
    const isVisible = visibleElements[elementName];
    const baseClasses = 'transition-all duration-700 ease-out';
    
    const directions = {
      up: {
        hidden: 'opacity-0 translate-y-12',
        visible: 'opacity-100 translate-y-0'
      },
      down: {
        hidden: 'opacity-0 -translate-y-12',
        visible: 'opacity-100 translate-y-0'
      },
      left: {
        hidden: 'opacity-0 translate-x-12',
        visible: 'opacity-100 translate-x-0'
      },
      right: {
        hidden: 'opacity-0 -translate-x-12',
        visible: 'opacity-100 translate-x-0'
      },
      scale: {
        hidden: 'opacity-0 scale-90',
        visible: 'opacity-100 scale-100'
      },
      rotate: {
        hidden: 'opacity-0 rotate-6 scale-95',
        visible: 'opacity-100 rotate-0 scale-100'
      }
    };

    const delayClass = delay ? `delay-[${delay}ms]` : '';
    
    return `${baseClasses} ${delayClass} ${isVisible ? directions[direction].visible : directions[direction].hidden}`;
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-50 via-white to-orange-50/30 overflow-hidden min-h-screen lg:min-h-[90vh]"
    >
      {/* Subtle Background Pattern with Parallax */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #FD5A00 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Animated Background Orbs with Parallax */}
      <div 
        className="hidden sm:block absolute top-10 right-5 lg:top-20 lg:right-10 w-32 sm:w-48 lg:w-64 xl:w-80 h-32 sm:h-48 lg:h-64 xl:h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />
      <div 
        className="hidden sm:block absolute bottom-10 left-5 lg:bottom-20 lg:left-10 w-40 sm:w-56 lg:w-72 xl:w-96 h-40 sm:h-56 lg:h-72 xl:h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 order-2 lg:order-1">

            {/* Trust Badge */}
            <div 
              ref={trustBadgeRef}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py- bg-white rounded-full shadow-sm border border-orange-100/80 hover:shadow-md hover:scale-105 transition-all duration-300 ${getAnimationClass('trustBadge', 'down')}`}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-full w-full bg-orange-500" />
                </span>
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  50,000+ Students Learning Now
                </span>
              </div>
            </div>

  {/* Main Heading */}
<div 
  ref={headingRef}
  className={`space-y-1 sm:space-y-1.5 lg:space-y-2 ${getAnimationClass('heading', 'up')}`}
>
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-[1.2] tracking-tight animate-text-shimmer py-1">
    इंग्लिश बोलना सीखे
  </h1>
  <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold bg-gradient-to-r from-[#FD5A00] via-orange-500 to-orange-600 bg-clip-text text-transparent bg-size-200 animate-gradient leading-[1.2] py-1">
    दुनिया का सबसे आसान तरीका
  </p>
  <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-[#FD5A00] to-orange-600 rounded-full animate-width-expand" />
</div>

            {/* Active Section Content Card */}
            <div 
              ref={contentCardRef}
              className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:border-orange-200/50 transition-all duration-500 ${getAnimationClass('contentCard', 'left')}`}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FD5A00] to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 transform hover:scale-110 hover:rotate-3 transition-all duration-300 animate-bounce-subtle">
                  <span className="text-xl sm:text-2xl">{activeContent.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    {activeContent.title}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {activeContent.description}
                  </p>
                </div>
              </div>

              {/* Features List with Staggered Animation */}
              <div className="space-y-2 sm:space-y-3">
                {activeContent.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2 sm:gap-3 group transform transition-all duration-500 hover:translate-x-2 ${
                      visibleElements.contentCard 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 bg-orange-100 rounded-md flex items-center justify-center group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-200 flex-shrink-0">
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FD5A00]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed group-hover:text-[#FD5A00] transition-colors duration-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div 
              ref={ctaRef}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 ${getAnimationClass('cta', 'up')}`}
            >
              <a
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-[#FD5A00] to-orange-600 text-white rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">{content.ctaPrimary}</span>
                <svg
                  className="relative w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>

              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-white text-gray-700 rounded-lg sm:rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#FD5A00] hover:text-[#FD5A00] transition-all duration-300 shadow-sm hover:shadow-lg font-semibold text-sm sm:text-base"
              >
                {/* Border animation */}
                <span className="absolute inset-0 border-2 border-transparent group-hover:border-[#FD5A00] rounded-lg sm:rounded-xl transition-all duration-300 scale-105 opacity-0 group-hover:scale-100 group-hover:opacity-100" />
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span>{content.ctaSecondary}</span>
              </a>
            </div>

            {/* Stats - Responsive Grid with Counter Animation */}
            <div 
              ref={statsRef}
              className={`grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-6 ${getAnimationClass('stats', 'up')}`}
            >
              {[
                { value: '50K+', label: 'Active Students' },
                { value: '4.8★', label: 'App Rating' },
                { value: '100%', label: 'Free Access' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center group cursor-default ${index === 1 ? 'border-x border-gray-200' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-[#FD5A00] transition-colors duration-300 group-hover:scale-110 transform">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 group-hover:text-gray-900 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT - IMAGE DISPLAY */}
          <div 
            ref={imageRef}
            className={`relative order-1 lg:order-2 ${getAnimationClass('image', 'right')}`}
          >
            <div className="relative flex items-center justify-center">

              {/* Main Image Container */}
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">

                {/* Decorative Background Circle with Pulse */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20 blur-3xl transform scale-110 animate-pulse-slow" />

                {/* Rotating Border Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-200/30 animate-spin-slow" />

                {/* Image with transition */}
                <div 
                  className="relative z-10"
                  style={{ transform: `translateY(${scrollY * -0.05}px)` }}
                >
                  <img
                    src={activeContent.image}
                    alt={activeContent.title}
                    className="w-full h-48 sm:h-64 md:h-72 lg:h-96 xl:h-[450px] 2xl:h-[500px] object-contain transform transition-all duration-700 ease-out drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl animate-float-image"
                    loading="eager"
                  />
                </div>

                {/* Floating Badges Container */}
                <div ref={floatingBadgesRef}>
                  {/* Floating Badge - Bottom Left */}
                  <div 
                    className={`hidden xs:block absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-md p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100/80 z-20 hover:scale-105 transition-transform duration-300 ${
                      visibleElements.floatingBadges 
                        ? 'animate-slide-in-left' 
                        : 'opacity-0 -translate-x-full'
                    }`}
                    style={{ 
                      transform: `translateY(${scrollY * 0.08}px)`,
                      animationDelay: '200ms'
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FD5A00] to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-bounce-subtle">
                        <span className="text-sm sm:text-lg">{activeContent.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-[100px] sm:max-w-[140px]">
                          {activeContent.subtitle}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600">Tree Campus Learning</div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Badge - Top Right */}
                  <div 
                    className={`absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-br from-[#FD5A00] to-orange-600 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl z-20 hover:scale-105 transition-transform duration-300 ${
                      visibleElements.floatingBadges 
                        ? 'animate-slide-in-right' 
                        : 'opacity-0 translate-x-full'
                    }`}
                    style={{ 
                      transform: `translateY(${scrollY * -0.06}px)`,
                      animationDelay: '400ms'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xs sm:text-sm lg:text-base font-bold animate-pulse">100% FREE</div>
                      <div className="text-[8px] sm:text-[10px] lg:text-xs opacity-90">Certificate Included</div>
                    </div>
                  </div>

                  {/* Live Students Badge - Top Left */}
                  <div 
                    className={`absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/95 backdrop-blur-md px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border border-gray-100/80 z-20 hover:scale-105 transition-transform duration-300 ${
                      visibleElements.floatingBadges 
                        ? 'animate-slide-in-down' 
                        : 'opacity-0 -translate-y-full'
                    }`}
                    style={{ 
                      transform: `translateY(${scrollY * 0.04}px)`,
                      animationDelay: '300ms'
                    }}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="flex -space-x-1.5 sm:-space-x-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white animate-pulse" style={{ animationDelay: '200ms' }} />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white animate-pulse" style={{ animationDelay: '400ms' }} />
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700 whitespace-nowrap">
                        2.5k+ online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
              <div className="bg-white/95 backdrop-blur-md px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full shadow-lg border border-gray-100/80 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex gap-1.5 sm:gap-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSection(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 transform hover:scale-110 ${
                          activeSection === index
                            ? 'w-6 sm:w-8 bg-[#FD5A00] shadow-md'
                            : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="w-px h-3 sm:h-4 bg-gray-300" />
                  <button
                    onClick={toggleAutoPlay}
                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:text-[#FD5A00] transition-all duration-300 rounded-full hover:bg-orange-50 hover:scale-110"
                    title={isAutoPlaying ? "Pause" : "Play"}
                    aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                  >
                    {isAutoPlaying ? (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-xs text-gray-500 font-medium">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#FD5A00] rounded-full animate-scroll-indicator" />
        </div>
      </div>

      {/* Bottom Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      {/* Enhanced Animation Styles */}
      <style jsx>{`
        /* Base Animations */
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Slide In Animations */
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-down {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Float Animations */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes float-image {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.01);
          }
        }
        
        /* Bounce Animations */
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Special Effects */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1.1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.15);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes width-expand {
          from {
            width: 0;
          }
          to {
            width: 5rem;
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes text-shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        @keyframes scroll-indicator {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(12px);
          }
        }
        
        /* Animation Classes */
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }
        
        .animate-slide-in-down {
          animation: slide-in-down 0.6s ease-out forwards;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 0.5s;
        }
        
        .animate-float-image {
          animation: float-image 6s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-width-expand {
          animation: width-expand 1s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .animate-text-shimmer {
          background: linear-gradient(90deg, #1f2937 0%, #1f2937 40%, #FD5A00 50%, #1f2937 60%, #1f2937 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer 4s linear infinite;
        }
        
        .animate-scroll-indicator {
          animation: scroll-indicator 1.5s ease-out infinite;
        }
        
        /* Background Size Utility */
        .bg-size-200 {
          background-size: 200% auto;
        }
        
        /* Custom xs breakpoint for very small devices */
        @media (min-width: 375px) {
          .xs\\:block {
            display: block;
          }
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-fade-in-down,
          .animate-fade-in-left,
          .animate-fade-in-right,
          .animate-slide-in-left,
          .animate-slide-in-right,
          .animate-slide-in-down,
          .animate-slide-in-up,
          .animate-float,
          .animate-float-delayed,
          .animate-float-image,
          .animate-bounce-subtle,
          .animate-bounce-slow,
          .animate-pulse-slow,
          .animate-spin-slow,
          .animate-width-expand,
          .animate-gradient,
          .animate-text-shimmer,
          .animate-scroll-indicator,
          .animate-ping,
          .animate-pulse {
            animation: none !important;
          }
          
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;