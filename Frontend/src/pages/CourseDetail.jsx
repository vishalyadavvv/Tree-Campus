import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SyllabusSidebar from './SyllabusSidebar';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status (replace with your actual auth check)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token && !!user);
  }, []);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setCourse({
        _id: id,
        title: 'Spoken English Basics',
        description: 'Complete course to learn spoken English confidently in 90 days with live classes and daily practice sessions',
        thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
        level: 'Beginner',
        duration: '90 days',
        lessons: 45,
        rating: 4.8,
        totalEnrollments: 15234,
        price: 'Free',
        instructor: { 
          name: 'Sarah Johnson', 
          image: 'https://i.pravatar.cc/150?img=1',
          bio: 'Certified English teacher with 8+ years of experience',
          students: '25,000+'
        },
        features: [
          'Live Interactive Classes',
          'Daily Practice Sessions',
          'AI Speaking Partner',
          'Progress Tracking',
          'Free Certificate',
          '24/7 Access'
        ],
        syllabus: [
          { 
            title: 'Introduction to English Speaking', 
            lessons: 8,
            description: 'Build foundation and overcome speaking anxiety'
          },
          { 
            title: 'Basic Grammar & Vocabulary', 
            lessons: 12,
            description: 'Essential grammar rules and daily use vocabulary'
          },
          { 
            title: 'Daily Conversations', 
            lessons: 15,
            description: 'Real-life conversation practice and scenarios'
          },
          { 
            title: 'Advanced Speaking Skills', 
            lessons: 10,
            description: 'Fluency development and accent improvement'
          }
        ],
        requirements: [
          'Basic understanding of English alphabet',
          'Smartphone or computer with internet',
          'Dedication to practice daily'
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      navigate('/login', { 
        state: { 
          from: `/courses/${id}`,
          message: 'Please login to enroll in this course'
        }
      });
    } else {
      // Redirect to course videos/lessons page
      navigate(`/learn/${id}/lessons`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FD5A00] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#FD5A00] to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {course.level}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {course.duration}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {course.lessons} Lessons
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-orange-100 mb-6 max-w-3xl">
                {course.description}
              </p>
              <div className="flex items-center space-x-6 text-orange-100">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{course.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-300">⭐</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎓</span>
                  <span>{course.totalEnrollments.toLocaleString()} students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'syllabus', 'requirements'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-[#FD5A00] text-[#FD5A00]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Course Overview</h3>
                    <p className="text-gray-600 leading-relaxed">
                      This comprehensive spoken English course is designed for beginners who want to 
                      speak English confidently in daily life. Through interactive lessons, live classes, 
                      and practical exercises, you'll build a strong foundation in English communication.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'syllabus' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Course Syllabus</h3>
                    <div className="space-y-4">
                      {course.syllabus.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-[#FD5A00] transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                            <span className="px-3 py-1 bg-orange-100 text-[#FD5A00] rounded-full text-sm font-medium">
                              {section.lessons} lessons
                            </span>
                          </div>
                          <p className="text-gray-600">{section.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
                    <ul className="space-y-3">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#FD5A00] rounded-full"></div>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white rounded-2xl ">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[#FD5A00] mb-2">{course.price}</div>
                <div className="text-gray-600">Lifetime access</div>
              </div>

              {!isAuthenticated && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Login required to enroll</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleEnrollClick}
                className="w-full py-4 bg-gradient-to-r from-[#FD5A00] to-orange-500 text-white rounded-xl hover:from-orange-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg mb-4 transform hover:scale-105"
              >
                {isAuthenticated ? 'Start Learning' : 'Enroll Now'}
              </button>

              {isAuthenticated ? (
                <p className="text-center text-sm text-gray-600 mb-4">
                  Access all {course.lessons} lessons immediately
                </p>
              ) : (
                <p className="text-center text-sm text-gray-600 mb-4">
                  Create free account to start learning
                </p>
              )}

              <Link 
                to="/courses" 
                className="block w-full py-3 bg-gray-100 text-gray-700 text-center rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold mb-6"
              >
                Back to Courses
              </Link>

              {/* Instructor Info */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Instructor</h4>
                <div className="flex items-center space-x-4">
                  <img src={course.instructor.image} alt={course.instructor.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900">{course.instructor.name}</p>
                    <p className="text-sm text-gray-600">{course.instructor.bio}</p>
                    <p className="text-sm text-[#FD5A00] font-medium">{course.instructor.students} students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Course Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Level</span>
                  <span className="font-semibold text-gray-900">{course.level}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-semibold text-gray-900">{course.lessons}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Enrollments</span>
                  <span className="font-semibold text-gray-900">{course.totalEnrollments.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;