import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CourseOverview= ({ course, index, isVisible }) => {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  if (!course) {
    return null; // or return a loading skeleton
  }


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
          src={course.thumbnail || course.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400'} 
          alt={course.title} 
          className="w-full h-48 object-cover transition duration-500"
          style={{
            transform: isInView ? 'scale(1)' : 'scale(1.1)'
          }}
        />
        {course.level && (
          <div 
            className="absolute top-4 right-4 transition-all duration-500"
            style={{
              transitionDelay: `${index * 150 + 300}ms`,
              transform: isInView ? 'translateX(0)' : 'translateX(20px)',
              opacity: isInView ? 1 : 0
            }}
          >
            <span className="px-3 py-1 bg-[#115E59] text-white rounded-full text-sm font-semibold shadow-lg capitalize">
              {course.level}
            </span>
          </div>
        )}
        {course.duration && (
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
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 
          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#14B8A6] transition-colors duration-300"
          style={{
            transitionDelay: `${index * 150 + 200}ms`,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          {course.title}
        </h3>
        
        <p 
          className="text-gray-600 mb-4 leading-relaxed transition-all duration-500 line-clamp-2"
          style={{
            transitionDelay: `${index * 150 + 300}ms`,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            opacity: isInView ? 1 : 0
          }}
        >
          {course.description}
        </p>

        {/* Features List */}
        {course.features && course.features.length > 0 && (
          <div 
            className="flex flex-wrap gap-2 mb-4 transition-all duration-500"
            style={{
              transitionDelay: `${index * 150 + 400}ms`,
              transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              opacity: isInView ? 1 : 0
            }}
          >
            {course.features.slice(0, 4).map((feature, featureIndex) => (
              <span 
                key={featureIndex}
                className="px-2 py-1 bg-teal-50 text-[#14B8A6] rounded-lg text-xs font-medium border border-teal-100 transition-all duration-300 hover:scale-105"
                style={{
                  transitionDelay: `${index * 150 + 400 + (featureIndex * 50)}ms`
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        )}

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
              <span>{(course.enrollmentCount || course.students || 0).toLocaleString()} students</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span>{course.totalLessons || course.lessons || 0} lessons</span>
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          to={`/courses/${course._id}`}
          className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-teal-500 text-white rounded-xl hover:from-teal-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
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



export default CourseOverview;