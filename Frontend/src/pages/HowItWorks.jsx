import React, { useState, useEffect } from 'react';
import { Download, Users, GamepadIcon, MessageCircle, BookOpen, Video } from 'lucide-react';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [visibleSections, setVisibleSections] = useState([]);
  const [animatedHeader, setAnimatedHeader] = useState(false);
  const [animatedIntro, setAnimatedIntro] = useState(false);

  const processes = [
    {
      id: 1,
      title: 'Treecampus App पर रजिस्टर व एनरोल करने की प्रक्रिया',
      description: 'Learn how to register and enroll in the Treecampus app to start your English learning journey',
      videoUrl: 'https://www.youtube.com/watch?v=xIcgAkKmMNs',
      youtubeId: 'xIcgAkKmMNs',
      icon: Download,
      steps: [
        'Download the Treecampus App from Play Store',
        'Complete quick registration process',
        'Choose your English level and goals',
        'Get immediate access to all courses'
      ],
      color: 'from-[#FD5A00] to-orange-600'
    },
    {
      id: 2,
      title: 'Lock & Key game खेलने की प्रक्रिया',
      description: 'Master vocabulary with our engaging Lock & Key matching game',
      videoUrl: 'https://www.youtube.com/watch?v=iII3Ffp6QJ4',
      youtubeId: 'iII3Ffp6QJ4',
      icon: GamepadIcon,
      steps: [
        'Match words with their correct meanings',
        'Unlock levels by completing challenges',
        'Earn points for correct matches',
        'Track your progress and improve vocabulary'
      ],
      color: 'from-[#FD5A00] to-orange-500'
    },
    {
      id: 3,
      title: 'Bird Saver game खेलने की प्रक्रिया',
      description: 'Save birds while learning English phrases and sentences',
      videoUrl: 'https://www.youtube.com/watch?v=49NZy6WLmbc',
      youtubeId: '49NZy6WLmbc',
      icon: Users,
      steps: [
        'Protect birds by answering English questions',
        'Learn common phrases and expressions',
        'Increase difficulty as you progress',
        'Fun way to practice daily English'
      ],
      color: 'from-[#FD5A00] to-orange-400'
    },
    {
      id: 4,
      title: 'Conversation Game प्रयोग करने की प्रक्रिया',
      description: 'Practice real-life conversations with AI-powered scenarios',
      videoUrl: 'https://www.youtube.com/watch?v=JAN_Stq95Jw',
      youtubeId: 'JAN_Stq95Jw',
      icon: MessageCircle,
      steps: [
        'Choose from various conversation scenarios',
        'Speak or type your responses',
        'Get instant feedback on your English',
        'Improve pronunciation and fluency'
      ],
      color: 'from-[#FD5A00] to-orange-600'
    },
    {
      id: 5,
      title: 'Vocabulary Game खेलने की प्रक्रिया',
      description: 'Expand your vocabulary with interactive word games',
      videoUrl: 'https://www.youtube.com/watch?v=7KpPBwCB6aE',
      youtubeId: '7KpPBwCB6aE',
      icon: BookOpen,
      steps: [
        'Learn new words with visual aids',
        'Practice spelling and pronunciation',
        'Complete word puzzles and challenges',
        'Build your vocabulary daily'
      ],
      color: 'from-[#FD5A00] to-orange-500'
    },
    {
      id: 6,
      title: 'Treecampus App से Live Class लेने की प्रक्रिया',
      description: 'Join live classes with expert teachers through the app',
      videoUrl: 'https://www.youtube.com/watch?v=mB4DxY4O9oE',
      youtubeId: 'mB4DxY4O9oE',
      icon: Video,
      steps: [
        'Check the live class schedule in app',
        'Join classes with one click',
        'Interact with teachers in real-time',
        'Access class recordings later'
      ],
      color: 'from-[#FD5A00] to-orange-600'
    }
  ];

  useEffect(() => {
    // Trigger main page animation
    setIsVisible(true);
    
    // Header animation with delay
    setTimeout(() => setAnimatedHeader(true), 300);
    
    // Intro animation
    setTimeout(() => setAnimatedIntro(true), 600);
    
    // Stagger section animations
    processes.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSections(prev => [...prev, index]);
      }, 800 + (index * 200));
    });
  }, []);

  const openVideo = (youtubeId) => {
    setActiveVideo(youtubeId);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const getYouTubeThumbnail = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header Section with Background Image */}
      <div 
        className="relative bg-cover bg-center py-20 md:py-28 px-4 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl transition-all duration-1000 ${
            animatedHeader ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}></div>
          <div className={`absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl transition-all duration-1000 delay-300 ${
            animatedHeader ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}></div>
          <div className={`absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-lg transition-all duration-1000 delay-500 ${
            animatedHeader ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Title with Typing Effect */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-1000 ${
            animatedHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}>
            How It Works
          </h1>
          
          {/* Subtitle with Staggered Animation */}
          <p className={`text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            animatedHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}>
            Step-by-step guides to master Treecampus app features
          </p>
          <p className={`text-lg text-white mt-2 transition-all duration-1000 delay-400 ${
            animatedHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}>
            Accelerate your English learning journey
          </p>

          {/* Animated Counter */}
          <div className={`mt-8 flex justify-center transition-all duration-1000 delay-600 ${
            animatedHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30 shadow-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <p className="text-white font-semibold flex items-center space-x-2">
                <span>🎓</span>
                <span>6 Comprehensive Guides Available</span>
              </p>
            </div>
          </div>
        </div>

        {/* Animated Wave Decoration */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 delay-800 ${
          animatedHeader ? 'opacity-100 translate-y-0' : 'opacity-100 -translate-y-10'
        }`}>
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#F9FAFB" 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction with Enhanced Animation */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          animatedIntro ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        }`}>
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-[#FD5A00] to-orange-500 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Master Treecampus in Simple Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these detailed guides to make the most of Treecampus app features and enhance your English learning experience
          </p>
        </div>

        {/* Process Sections with Enhanced Animations */}
        <div className="space-y-12">
          {processes.map((process, index) => {
            const IconComponent = process.icon;
            return (
              <div
                key={process.id}
                className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-700 transform ${
                  visibleSections.includes(index) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-20 scale-95'
                } hover:shadow-2xl hover:-translate-y-1`}
                style={{ transitionDelay: `${800 + (index * 200)}ms` }}
              >
                {/* Section Header with Gradient Animation */}
                <div className={`bg-gradient-to-r ${process.color} p-8 relative overflow-hidden`}>
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                  </div>
                  
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-white/20 p-3 rounded-xl backdrop-blur-sm transition-all duration-500 ${
                        visibleSections.includes(index) ? 'scale-100 rotate-0' : 'scale-50 rotate-45'
                      }`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          {process.title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-base">
                          {process.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps and Content with Staggered Animation */}
                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Steps List with Staggered Items */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Process:</h4>
                      <ul className="space-y-3">
                        {process.steps.map((step, stepIndex) => (
                          <li 
                            key={stepIndex}
                            className={`flex items-start space-x-3 text-gray-700 transition-all duration-500 ${
                              visibleSections.includes(index) 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 -translate-x-4'
                            }`}
                            style={{ transitionDelay: `${1000 + (index * 200) + (stepIndex * 100)}ms` }}
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-[#FD5A00] text-white rounded-full text-sm flex items-center justify-center font-bold mt-0.5 transition-all duration-300 hover:scale-110">
                              {stepIndex + 1}
                            </span>
                            <span className="transition-all duration-300 hover:text-gray-900">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Video Thumbnail with Play Button */}
                    <div 
                      className={`relative group cursor-pointer transition-all duration-500 ${
                        visibleSections.includes(index) 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-95'
                      }`}
                      onClick={() => openVideo(process.youtubeId)}
                    >
                      <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                        <img
                          src={getYouTubeThumbnail(process.youtubeId)}
                          alt={process.title}
                          className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${process.youtubeId}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-[#FD5A00] rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-gray-600 mt-3 text-sm font-medium">
                        Click to watch tutorial
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section with Enhanced Animation */}
        <div className={`mt-16 bg-gradient-to-r from-[#FD5A00] to-orange-600 rounded-2xl p-8 text-center text-white shadow-2xl transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'
        } hover:shadow-3xl hover:-translate-y-1`}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 transition-all duration-300 hover:scale-105">
              Ready to Start Learning?
            </h3>
            <p className="text-lg text-orange-100 mb-6 transition-all duration-300 hover:text-orange-50">
              Download the Treecampus app now and begin your English learning journey with our interactive games and live classes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-[#FD5A00] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl">
                Download App Now
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Explore All Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={closeVideo}
        >
          <div 
            className="relative w-full max-w-4xl transform transition-all duration-500 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-all duration-300 transform hover:scale-110 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="How It Works Tutorial"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowItWorks;