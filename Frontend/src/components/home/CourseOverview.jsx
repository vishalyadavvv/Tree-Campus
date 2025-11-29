import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, index, isVisible }) => {
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
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform border border-gray-100 overflow-hidden"
      style={{
        transitionDelay: `${index * 150}ms`,
        transition: 'all 0.6s ease-out',
        transform: isInView ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
        opacity: isInView ? 1 : 0
      }}
    >
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-48 object-cover transition duration-500"
          style={{
            transform: isInView ? 'scale(1)' : 'scale(1.1)'
          }}
        />
        <div 
          className="absolute top-4 right-4 transition-all duration-500"
          style={{
            transitionDelay: `${index * 150 + 300}ms`,
            transform: isInView ? 'translateX(0)' : 'translateX(20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          <span className="px-3 py-1 bg-[#FD5A00] text-white rounded-full text-sm font-semibold shadow-lg">
            {course.level}
          </span>
        </div>
        <div 
          className="absolute bottom-4 left-4 transition-all duration-500"
          style={{
            transitionDelay: `${index * 150 + 400}ms`,
            transform: isInView ? 'translateX(0)' : 'translateX(-20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg text-sm font-semibold">
            {course.duration}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 
          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FD5A00] transition-colors duration-300"
          style={{
            transitionDelay: `${index * 150 + 200}ms`,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          {course.title}
        </h3>
        
        <p 
          className="text-gray-600 mb-4 leading-relaxed transition-all duration-500"
          style={{
            transitionDelay: `${index * 150 + 300}ms`,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          {course.description}
        </p>

        {/* Features List */}
        <div 
          className="flex flex-wrap gap-2 mb-4 transition-all duration-500"
          style={{
            transitionDelay: `${index * 150 + 400}ms`,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          {course.features.map((feature, featureIndex) => (
            <span 
              key={featureIndex}
              className="px-2 py-1 bg-orange-50 text-[#FD5A00] rounded-lg text-xs font-medium border border-orange-100 transition-all duration-300 hover:scale-105"
              style={{
                transitionDelay: `${index * 150 + 400 + (featureIndex * 50)}ms`
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Course Stats */}
        <div 
          className="flex items-center justify-between mb-4 transition-all duration-500"
          style={{
            transitionDelay: `${index * 150 + 500}ms`,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              <span>{course.students} students</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span>{course.lessons} lessons</span>
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          to="/courses" 
          className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#FD5A00] to-orange-500 text-white rounded-xl hover:from-orange-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          style={{
            transitionDelay: `${index * 150 + 600}ms`,
            transform: isInView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            opacity: isInView ? 1 : 0
          }}
        >
          Start Learning Free
        </Link>
      </div>
    </div>
  );
};

const CourseOverview = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const headerRef = useRef(null);
  const ctaRef = useRef(null);

  const courses = [
    {
      title: 'Spoken English Basics',
      description: 'Learn to speak English confidently in 90 days with daily practice and live sessions',
      lessons: 45,
      duration: '90 days',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
      level: 'Beginner',
      features: ['Live Classes', 'Daily Practice', 'Certificate', 'AI Speaking Partner'],
      students: '15,234'
    },
    {
      title: 'Grammar Mastery',
      description: 'Master English grammar rules and improve your writing with interactive exercises',
      lessons: 30,
      duration: '60 days',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
      level: 'Intermediate',
      features: ['Interactive Exercises', 'Quizzes', 'Progress Tracking', 'Expert Feedback'],
      students: '12,456'
    },
    {
      title: 'Business English',
      description: 'Professional English for workplace communication, meetings, and presentations',
      lessons: 25,
      duration: '45 days',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      level: 'Advanced',
      features: ['Role Plays', 'Case Studies', 'Industry Vocabulary', 'Real Scenarios'],
      students: '8,934'
    },
  ];

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
          } else {
            setHeaderVisible(false);
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCtaVisible(true);
          } else {
            setCtaVisible(false);
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    if (ctaRef.current) {
      ctaObserver.observe(ctaRef.current);
    }

    return () => {
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current);
      }
      if (ctaRef.current) {
        ctaObserver.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className="text-center mb-16 transition-all duration-1000 ease-out"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(50px)'
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-[#FD5A00] to-orange-600 bg-clip-text text-transparent">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Start your English learning journey with our most popular courses. All courses are completely free with certificates.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <CourseCard 
              key={index} 
              course={course} 
              index={index} 
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          ref={ctaRef}
          className="text-center transition-all duration-1000 ease-out"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(50px)'
          }}
        >
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your English?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join 50,000+ students who have improved their English skills with our free courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/courses" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FD5A00] to-orange-500 text-white rounded-xl hover:from-orange-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg transform hover:scale-105"
              >
                Explore All Courses
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-300 hover:border-[#FD5A00] hover:text-[#FD5A00] transition-all duration-300 font-semibold text-lg transform hover:scale-105"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseOverview;