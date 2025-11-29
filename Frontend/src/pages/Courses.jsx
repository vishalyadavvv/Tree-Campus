import React, { useState, useEffect } from 'react';
import CourseList from '../components/courses/CourseList';
import CourseFilter from '../components/courses/CourseFilter';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    search: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [visibleStats, setVisibleStats] = useState([]);

  useEffect(() => {
    // Trigger animations
    setIsVisible(true);
    
    // Stagger stats animations
    [0, 1, 2, 3].forEach((index) => {
      setTimeout(() => {
        setVisibleStats(prev => [...prev, index]);
      }, 300 + (index * 150));
    });

    // Mock data - replace with API call
    const mockCourses = [
      {
        _id: '1',
        title: 'Spoken English Basics',
        description: 'Learn to speak English confidently in 90 days with our comprehensive beginner course',
        thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
        level: 'beginner',
        category: 'spoken-english',
        duration: '90 days',
        totalEnrollments: 15234,
        rating: 4.8,
        lessons: 45,
        price: 'Free',
        instructor: 'Sarah Johnson',
        features: ['Live Classes', 'Daily Practice', 'Certificate']
      },
      {
        _id: '2',
        title: 'Grammar Mastery',
        description: 'Master English grammar rules and improve your writing skills with expert guidance',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        level: 'intermediate',
        category: 'grammar',
        duration: '60 days',
        totalEnrollments: 12456,
        rating: 4.7,
        lessons: 30,
        price: 'Free',
        instructor: 'Michael Brown',
        features: ['Interactive Exercises', 'Quizzes', 'Progress Tracking']
      },
      {
        _id: '3',
        title: 'Business English',
        description: 'Professional English for workplace communication, meetings, and presentations',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
        level: 'advanced',
        category: 'business-english',
        duration: '45 days',
        totalEnrollments: 8934,
        rating: 4.9,
        lessons: 25,
        price: 'Free',
        instructor: 'Emily Davis',
        features: ['Role Plays', 'Case Studies', 'Industry Vocabulary']
      },
      {
        _id: '4',
        title: 'Vocabulary Building',
        description: 'Expand your English vocabulary with 1000+ essential words and phrases',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        level: 'beginner',
        category: 'vocabulary',
        duration: '30 days',
        totalEnrollments: 18500,
        rating: 4.6,
        lessons: 35,
        price: 'Free',
        instructor: 'David Wilson',
        features: ['Flashcards', 'Memory Games', 'Daily Challenges']
      },
      {
        _id: '5',
        title: 'Pronunciation & Accent',
        description: 'Improve your pronunciation and reduce accent with speech recognition technology',
        thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400',
        level: 'intermediate',
        category: 'pronunciation',
        duration: '40 days',
        totalEnrollments: 9678,
        rating: 4.8,
        lessons: 28,
        price: 'Free',
        instructor: 'Lisa Anderson',
        features: ['Voice Analysis', 'Tongue Twisters', 'Native Speaker Audio']
      },
      {
        _id: '6',
        title: 'Conversation Practice',
        description: 'Build confidence in real-life conversations with our AI speaking partner',
        thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
        level: 'intermediate',
        category: 'conversation',
        duration: '50 days',
        totalEnrollments: 11234,
        rating: 4.7,
        lessons: 32,
        price: 'Free',
        instructor: 'Robert Garcia',
        features: ['AI Partner', 'Real Scenarios', 'Instant Feedback']
      }
    ];

    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterCourses();
  }, [filters, courses]);

  const filterCourses = () => {
    let filtered = [...courses];

    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="min-h-screen ">
      {/* Header with Background Image */}
      <div 
        className="relative bg-cover bg-center py-20 md:py-28 px-4 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D')`,
        }}
      >
        {/* Dark Overlay for better text readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#FD5A00]/25 "></div> */}
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
          <div className={`absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
          <div className={`absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-lg transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Explore Our Courses
          </h1>
          <p className={`text-xl md:text-2xl text-white font-extrabold max-w-3xl mx-auto leading-relaxed drop-shadow-md transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Choose the right course for your goals and start your English learning journey today
          </p>
          <div className={`mt-8 flex justify-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30 shadow-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <p className="text-white font-semibold">
                🎓 50,000+ Students Already Learning
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Wave at Bottom */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 -translate-y-10'}`}>
          <svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { number: '50K+', text: 'Active Students' },
            { number: '25+', text: 'Expert Teachers' },
            { number: '15K+', text: 'Certificates Issued' },
            { number: '100%', text: 'Free Courses' }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                visibleStats.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + (index * 150)}ms` }}
            >
              <div className="text-3xl font-bold text-[#FD5A00] mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.text}</div>
            </div>
          ))}
        </div>

        {/* Course Filter with Animation */}
        <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CourseFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Course List with Animation */}
        <div className={`transition-all duration-700 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CourseList courses={filteredCourses} loading={loading} />
        </div>

        {/* No Results Message */}
        {!loading && filteredCourses.length === 0 && (
          <div className={`text-center py-12 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}

        {/* Call to Action Section */}
        <div className={`mt-16 bg-gradient-to-r from-[#FD5A00] to-orange-600 rounded-2xl p-8 text-center text-white shadow-2xl transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
          <p className="text-lg text-orange-100 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their English skills with our free courses
          </p>
          <button className="px-8 py-3 bg-white text-[#FD5A00] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105">
            Browse All Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;