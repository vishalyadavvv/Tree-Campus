import { useState, useEffect,useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiChevronRight, FiPlay, FiChevronDown, FiChevronUp, FiClock, FiBook, FiAward, FiCheckCircle, FiUser, FiUsers, FiStar, FiLock, FiLogIn, FiAlertCircle, FiFileText } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext'; 
import toast from 'react-hot-toast';
import NoteModal from '../components/common/NoteModal';

const CourseOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login, logout, loading: authLoading } = useContext(AuthContext); // Get auth from your context
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState(null);
  const [firstLessonId, setFirstLessonId] = useState(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    fetchCourseData();
    if (isAuthenticated) {
      checkEnrollmentStatus();
    }
  }, [id, isAuthenticated]);

  const fetchCourseData = async () => {
    try {
      const response = await api.get(`/courses/${id}/structure`);
      setCourseData(response.data.data);
      
      // Expand first section by default
      if (response.data.data.sections.length > 0) {
        setExpandedSections({ [response.data.data.sections[0]._id]: true });
      }
      
      // Get first lesson ID for navigation
      if (response.data.data.sections[0]?.lessons?.[0]) {
        setFirstLessonId(response.data.data.sections[0].lessons[0]._id);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!isAuthenticated) {
      setIsEnrolled(false);
      return;
    }
    
    try {
      setCheckingEnrollment(true);
      // Adjust the endpoint based on your backend API
      const response = await api.get(`/courses/${id}/enrollment-status`);
      
      // Handle different response formats
      const enrollmentData = response.data.data || response.data;
      setIsEnrolled(enrollmentData.isEnrolled || false);
      
      // Fetch progress and assignments if enrolled
      if (enrollmentData.isEnrolled) {
        fetchCourseProgress();
        fetchAssignments();
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      
      // If endpoint doesn't exist yet, show as not enrolled
      if (error.response?.status === 404) {
        console.log('Enrollment endpoint not implemented yet');
        setIsEnrolled(false);
      } else {
        setIsEnrolled(false);
      }
    } finally {
      setCheckingEnrollment(false);
    }
  };

  const fetchCourseProgress = async () => {
    try {
      const res = await api.get(`/progress/course/${id}`);
      setCourseProgress(Number(res.data.data?.progress || 0));
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get(`/assignments/course/${id}`);
      setAssignments(res.data.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      // Show login modal or redirect to login
      if (window.confirm('You need to login to enroll in this course. Do you want to login now?')) {
        navigate('/login', { 
          state: { 
            from: `/courses/${id}`,
            message: 'Please login to enroll in the course'
          } 
        });
      }
      return;
    }
    
    setShowEnrollModal(true);
  };

  const handleEnrollConfirm = async () => {
    setEnrollLoading(true);
    setEnrollError(null);
    
    try {
      // Adjust the endpoint based on your backend API
      const response = await api.post(`/courses/${id}/enroll`);
      
      // Handle different response formats
      const responseData = response.data.data || response.data;
      
      if (responseData.success || response.status === 200) {
        setIsEnrolled(true);
        setShowEnrollModal(false);
        
        // Show success message
        toast.success('Successfully enrolled in the course!');
        
        // If there's a first lesson, navigate to it
        if (firstLessonId) {
          setTimeout(() => {
            navigate(`/courses/${id}/lesson/${firstLessonId}`);
          }, 1000);
        }
      } else {
        throw new Error(responseData.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setEnrollError('Your session has expired. Please login again.');
        // Optionally logout and redirect to login
        setTimeout(() => {
          navigate('/login', { 
            state: { from: `/courses/${id}` }
          });
        }, 2000);
      } else if (error.response?.status === 409) {
        setEnrollError('You are already enrolled in this course.');
        setIsEnrolled(true); // Update local state
      } else {
        setEnrollError(error.response?.data?.message || 'Failed to enroll. Please try again.');
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleContinueLearning = () => {
    if (isEnrolled && firstLessonId) {
      navigate(`/courses/${id}/lesson/${firstLessonId}`);
    } else if (isEnrolled) {
      // If no first lesson, go to course page
      navigate(`/courses/${id}`);
    }
  };

  const handleOpenNote = (note) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        from: `/courses/${id}`,
        message: 'Login to enroll in this course'
      } 
    });
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC5A00]"></div>
      </div>
    );
  }

  const { course, sections } = courseData;
  const totalLessons = sections.reduce((sum, section) => sum + (section.lessons?.length || 0), 0);
  const totalQuizzes = sections.filter(section => section.quiz).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enrollment Confirmation Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FC5A00]/10 flex items-center justify-center">
                <FiCheckCircle className="text-[#FC5A00]" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Confirm Enrollment</h3>
                <p className="text-sm text-gray-500">Ready to start learning?</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              You are about to enroll in <span className="font-bold text-[#FC5A00]">{course?.title}</span>. 
              This will give you lifetime access to all course materials.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-blue-500 mt-0.5" size={18} />
                <div>
                  <p className="text-blue-800 text-sm font-semibold mb-1">What you'll get:</p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Full course access with lifetime updates</li>
                    <li>• Downloadable resources and exercises</li>
                    <li>• Certificate of completion</li>
                    <li>• Community support access</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {enrollError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{enrollError}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                disabled={enrollLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollConfirm}
                className="flex-1 py-3 px-4 bg-[#FC5A00] hover:bg-[#FF6B1A] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={enrollLoading}
              >
                {enrollLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Enrolling...
                  </>
                ) : (
                  'Enroll Now'
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By enrolling, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}

      {/* Course Header */}
      <div 
        className="relative overflow-hidden bg-cover bg-center py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.50)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/courses" 
            className="inline-flex items-center text-white hover:text-[#FC5A00] transition-colors duration-200 mb-6 font-bold"
          >
            <FiChevronRight className="rotate-180 mr-2" />
            Back to Courses
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-sm border border-white/30">
                  {course?.category}
                </span>
                <span className="px-4 py-2 bg-[#FC5A00]/30 backdrop-blur-sm rounded-full text-white font-bold text-sm border border-[#FC5A00]/50">
                  {course?.level}
                </span>
                {isAuthenticated && isEnrolled && (
                  <span className="px-4 py-2 bg-green-500/30 backdrop-blur-sm rounded-full text-white font-bold text-sm border border-green-500/50 flex items-center gap-2">
                    <FiCheckCircle size={14} />
                    Enrolled
                  </span>
                )}
                {isAuthenticated && checkingEnrollment && (
                  <span className="px-4 py-2 bg-blue-500/30 backdrop-blur-sm rounded-full text-white font-bold text-sm border border-blue-500/50 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                    Checking...
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {course?.title}
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed font-bold max-w-3xl">
                {course?.description}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-3 text-white font-bold">
                  <FiBook size={22} className="text-[#FC5A00]" />
                  <span>{sections?.length || 0} Sections</span>
                </div>
                <div className="flex items-center gap-3 text-white font-bold">
                  <FiPlay size={22} className="text-[#FC5A00]" />
                  <span>{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center gap-3 text-white font-bold">
                  <FiAward size={22} className="text-[#FC5A00]" />
                  <span>{totalQuizzes} Quizzes</span>
                </div>
                <div className="flex items-center gap-3 text-white font-bold">
                  <FiClock size={22} className="text-[#FC5A00]" />
                  <span>{course?.duration}</span>
                </div>
              </div>

              {/* Dynamic Button based on enrollment status */}
              {isAuthenticated && isEnrolled ? (
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-green-600/20 hover:shadow-green-600/30 flex items-center gap-3"
                  onClick={handleContinueLearning}
                >
                  <FiPlay size={22} />
                  Continue Learning
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    className="bg-[#FC5A00] hover:bg-[#FF6B1A] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-[#FC5A00]/20 hover:shadow-[#FC5A00]/30 flex items-center gap-3"
                    onClick={handleEnrollClick}
                    disabled={checkingEnrollment}
                  >
                    {isAuthenticated ? (
                      <>
                        <FiCheckCircle size={22} />
                        {checkingEnrollment ? 'Checking...' : 'Enroll Now'}
                      </>
                    ) : (
                      <>
                        <FiLogIn size={22} />
                        Login to Enroll
                      </>
                    )}
                  </button>
                  
                  {isAuthenticated && !isEnrolled && (
                    <button 
                      className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-gray-800/20 hover:shadow-gray-800/30 flex items-center gap-3"
                      onClick={() => navigate('/courses')}
                    >
                      <FiChevronRight className="rotate-180" size={22} />
                      Browse More Courses
                    </button>
                  )}
                </div>
              )}

              {/* Enrollment CTA info */}
              {isAuthenticated && !isEnrolled && (
                <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-w-lg">
                  <p className="text-white font-bold text-sm flex items-center gap-2 mb-2">
                    <FiCheckCircle size={16} />
                    What you'll get when you enroll:
                  </p>
                  <ul className="space-y-1 text-white/90 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#FC5A00] rounded-full"></div>
                      Full course access with lifetime updates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#FC5A00] rounded-full"></div>
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#FC5A00] rounded-full"></div>
                      Downloadable resources and exercises
                    </li>
                  </ul>
                </div>
              )}
              
              {!isAuthenticated && (
                <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-w-lg">
                  <p className="text-white font-bold text-sm flex items-center gap-2 mb-2">
                    <FiLock size={16} />
                    Login required to enroll
                  </p>
                  <p className="text-white/80 text-sm mb-3">
                    You need to be logged in to enroll in this course.
                  </p>
                  <button
                    onClick={handleLoginRedirect}
                    className="text-white hover:text-[#FC5A00] font-bold text-sm flex items-center gap-1 transition-colors duration-200"
                  >
                    Click here to login <FiChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Stats Card - BLUR BG */}
            <div className="w-full lg:w-96">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FiAward className="text-white" />
                  Course Statistics
                </h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-white/30">
                    <div className="flex items-center gap-3">
                      <FiUser className="text-white" size={20} />
                      <span className="text-white font-bold">Instructor</span>
                    </div>
                    <span className="text-white font-bold">{course?.instructor}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-white/30">
                    <div className="flex items-center gap-3">
                      <FiUsers className="text-white" size={20} />
                      <span className="text-white font-bold">Students</span>
                    </div>
                    <span className="text-white font-bold">
                      {isEnrolled ? (course?.enrollmentCount || 0) + 1 : course?.enrollmentCount || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FiStar className="text-yellow-300" size={20} />
                      <span className="text-white font-bold">Rating</span>
                    </div>
                    <span className="text-white font-bold">⭐ {course?.rating || '4.8'}/5.0</span>
                  </div>
                </div>
                
                {/* Enrolled Users Count */}
                {isAuthenticated && isEnrolled && (
                  <div className="mt-6 pt-6 border-t border-white/30">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-bold">Your Status</span>
                      <span className="bg-green-500/30 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                        Active Student
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      Enrolled as: <span className="font-bold">{user?.name || user?.email}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content - WHITE BG SECTION */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Course Curriculum</h2>
            <p className="text-gray-600 font-bold text-lg">
              {sections?.length} sections • {totalLessons} lessons • {totalQuizzes} quizzes
              {isAuthenticated && !isEnrolled && (
                <span className="ml-3 text-sm bg-[#FC5A00]/10 text-[#FC5A00] px-3 py-1 rounded-full font-bold">
                  Enroll to access content
                </span>
              )}
              {!isAuthenticated && (
                <span className="ml-3 text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold">
                  Login to enroll
                </span>
              )}
            </p>
          </div>
          
          <div className="space-y-4">
            {sections?.map((section, sectionIndex) => (
              <div key={section._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#FC5A00]/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                {/* Section Header */}
                <div 
                  className={`flex justify-between items-center p-5 lg:p-6 cursor-pointer transition-all duration-300 ${
                    expandedSections[section._id] ? 'bg-gray-50' : 'bg-white'
                  }`}
                  onClick={() => toggleSection(section._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-[#FC5A00]/10 text-[#FC5A00] font-bold text-sm rounded-lg">
                        Section {sectionIndex + 1}
                      </span>
                      {isAuthenticated && !isEnrolled && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg flex items-center gap-1">
                          <FiLock size={10} />
                          Locked
                        </span>
                      )}
                      {!isAuthenticated && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg flex items-center gap-1">
                          <FiLock size={10} />
                          Login Required
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 font-bold">
                      {section.lessons?.length || 0} lessons
                      {section.quiz && ' • 1 quiz'}
                    </p>
                  </div>
                  <button className="flex-shrink-0 ml-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    {expandedSections[section._id] ? 
                      <FiChevronUp size={24} className="text-[#FC5A00]" /> : 
                      <FiChevronDown size={24} className="text-[#FC5A00]" />
                    }
                  </button>
                </div>

                {/* Section Content */}
                {expandedSections[section._id] && (
                  <div className="px-5 lg:px-6 pb-6 pt-4 border-t border-gray-100">
                    {/* Lessons */}
                    {section.lessons && section.lessons.length > 0 && (
                      <div className="space-y-3 mt-4">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson._id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${
                              isAuthenticated && isEnrolled 
                                ? 'bg-gray-50 hover:bg-[#FC5A00]/5 border-gray-200 hover:border-[#FC5A00] cursor-pointer hover:translate-x-2'
                                : 'bg-gray-50/50 border-gray-200 cursor-not-allowed'
                            } ${(!isAuthenticated || !isEnrolled) && 'opacity-75'}`}
                            onClick={() => {
                              if (isAuthenticated && isEnrolled) {
                                navigate(`/courses/${id}/lesson/${lesson._id}`);
                              } else if (!isAuthenticated) {
                                handleEnrollClick();
                              }
                            }}
                          >
                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                isAuthenticated && isEnrolled 
                                  ? 'bg-[#FC5A00]/10 group-hover:bg-[#FC5A00]'
                                  : 'bg-gray-300'
                              }`}>
                                {isAuthenticated && isEnrolled ? (
                                  <>
                                    <span className="text-gray-900 font-bold text-sm group-hover:text-white">
                                      {lessonIndex + 1}
                                    </span>
                                    <FiPlay className="text-[#FC5A00] group-hover:text-white ml-1" size={16} />
                                  </>
                                ) : (
                                  <FiLock className="text-gray-500" size={16} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className={`font-bold text-lg mb-1 truncate ${
                                  isAuthenticated && isEnrolled ? 'text-gray-900 group-hover:text-[#FC5A00]' : 'text-gray-500'
                                }`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 font-bold">
                                  <FiClock size={16} className={isAuthenticated && isEnrolled ? "text-[#FC5A00]" : "text-gray-400"} />
                                  <span className={isAuthenticated && isEnrolled ? "text-gray-600" : "text-gray-400"}>{lesson.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              {(!isAuthenticated || !isEnrolled) && (
                                <span className="text-sm text-gray-500 font-bold">
                                  {!isAuthenticated ? 'Login to access' : 'Enroll to access'}
                                </span>
                              )}
                              <FiChevronRight className={
                                isAuthenticated && isEnrolled 
                                  ? "text-gray-400 group-hover:text-[#FC5A00] transform group-hover:translate-x-1 transition-all duration-300"
                                  : "text-gray-300"
                              } size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Section Notes */}
                    {((section.notes && section.notes.length > 0) || section.note) && (
                      <div className="space-y-3 mt-4">
                        {section.notes && section.notes.map((note, noteIdx) => (
                          <div
                            key={`note-${noteIdx}`}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${
                              isAuthenticated && isEnrolled 
                                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-400 cursor-pointer hover:translate-x-2'
                                : 'bg-gray-50/50 border-gray-200 cursor-not-allowed opacity-75'
                            }`}
                            onClick={() => {
                              if (isAuthenticated && isEnrolled) {
                                handleOpenNote(note);
                              } else if (!isAuthenticated) {
                                handleEnrollClick();
                              }
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                isAuthenticated && isEnrolled 
                                  ? 'bg-amber-100 group-hover:bg-amber-500'
                                  : 'bg-gray-300'
                              }`}>
                                <FiFileText className={isAuthenticated && isEnrolled ? "text-amber-600 group-hover:text-white" : "text-gray-500"} size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className={`font-bold text-lg mb-1 truncate ${
                                  isAuthenticated && isEnrolled ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {note.heading}
                                </p>
                                <div className="flex items-center gap-2 font-bold text-amber-700">
                                  <span className="text-xs uppercase tracking-wider">Study Note</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 sm:mt-0">
                              <span className="text-sm text-amber-600 font-bold hidden sm:block">View Full Note</span>
                              <FiChevronRight className={
                                isAuthenticated && isEnrolled 
                                  ? "text-amber-400 group-hover:text-amber-600 transform group-hover:translate-x-1 transition-all duration-300"
                                  : "text-gray-300"
                              } size={20} />
                            </div>
                          </div>
                        ))}

                        {section.note && (
                          <div
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${
                              isAuthenticated && isEnrolled 
                                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-400 cursor-pointer hover:translate-x-2'
                                : 'bg-gray-50/50 border-gray-200 cursor-not-allowed opacity-75'
                            }`}
                            onClick={() => {
                              if (isAuthenticated && isEnrolled) {
                                handleOpenNote({ heading: 'Section Note', content: section.note });
                              } else if (!isAuthenticated) {
                                handleEnrollClick();
                              }
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                isAuthenticated && isEnrolled 
                                  ? 'bg-amber-100 group-hover:bg-amber-500'
                                  : 'bg-gray-300'
                              }`}>
                                <FiFileText className={isAuthenticated && isEnrolled ? "text-amber-600 group-hover:text-white" : "text-gray-500"} size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className={`font-bold text-lg mb-1 truncate ${
                                  isAuthenticated && isEnrolled ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  General Section Note
                                </p>
                                <div className="flex items-center gap-2 font-bold text-amber-700">
                                  <span className="text-xs uppercase tracking-wider">Reading Material</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 sm:mt-0">
                              <span className="text-sm text-amber-600 font-bold hidden sm:block">View Details</span>
                              <FiChevronRight className={
                                isAuthenticated && isEnrolled 
                                  ? "text-amber-400 group-hover:text-amber-600 transform group-hover:translate-x-1 transition-all duration-300"
                                  : "text-gray-300"
                              } size={20} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quiz */}
                    {section.quiz && (
                      <div
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-all duration-300 group mt-4 ${
                          isAuthenticated && isEnrolled 
                            ? 'bg-gradient-to-r from-[#FC5A00]/5 to-orange-50 hover:from-[#FC5A00]/10 hover:to-orange-100 border-[#FC5A00]/30 hover:border-[#FC5A00] cursor-pointer hover:translate-x-2'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300 cursor-not-allowed'
                        } ${(!isAuthenticated || !isEnrolled) && 'opacity-75'}`}
                        onClick={() => {
                          if (isAuthenticated && isEnrolled) {
                            navigate(`/courses/${id}/section/${section._id}/quiz`);
                          } else if (!isAuthenticated) {
                            handleEnrollClick();
                          }
                        }}
                      >
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            isAuthenticated && isEnrolled 
                              ? 'bg-[#FC5A00]/10 group-hover:bg-[#FC5A00]'
                              : 'bg-gray-300'
                          }`}>
                            <FiAward className={isAuthenticated && isEnrolled ? "text-[#FC5A00] group-hover:text-white" : "text-gray-500"} size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className={`font-bold text-lg mb-1 ${
                              isAuthenticated && isEnrolled ? 'text-gray-900 group-hover:text-[#FC5A00]' : 'text-gray-500'
                            }`}>
                              Section Quiz: {section.quiz.title}
                            </p>
                            <div className="flex flex-wrap gap-4 font-bold">
                              <span className={`flex items-center gap-2 ${
                                isAuthenticated && isEnrolled ? "text-gray-600" : "text-gray-400"
                              }`}>
                                <FiAward size={16} className={isAuthenticated && isEnrolled ? "text-[#FC5A00]" : "text-gray-400"} />
                                {section.quiz.questions?.length || 0} questions
                              </span>
                              <span className={isAuthenticated && isEnrolled ? "text-gray-600" : "text-gray-400"}>•</span>
                              <span className={`flex items-center gap-2 ${
                                isAuthenticated && isEnrolled ? "text-gray-600" : "text-gray-400"
                              }`}>
                                <FiCheckCircle size={16} className={isAuthenticated && isEnrolled ? "text-[#FC5A00]" : "text-gray-400"} />
                                Passing score: {section.quiz.passingScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          {(!isAuthenticated || !isEnrolled) && (
                            <span className="text-sm text-gray-500 font-bold">
                              {!isAuthenticated ? 'Login to access' : 'Enroll to access'}
                            </span>
                          )}
                          <FiChevronRight className={
                            isAuthenticated && isEnrolled 
                              ? "text-gray-400 group-hover:text-[#FC5A00] transform group-hover:translate-x-1 transition-all duration-300"
                              : "text-gray-300"
                          } size={20} />
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Assignments / Certifications Section */}
          {assignments.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiAward className="text-[#FC5A00]" />
                  Final Assessment & Certification
                </h2>
                <p className="text-gray-600 mt-1">Complete these assessments to earn your certificate.</p>
              </div>

              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${
                            isAuthenticated && isEnrolled 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <FiAward size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{assignment.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FiBook size={14} />
                                {assignment.questions.length} Questions
                              </span>
                              <span className="flex items-center gap-1">
                                <FiClock size={14} />
                                {assignment.timeLimit} mins
                              </span>
                              <span className="flex items-center gap-1">
                                <FiCheckCircle size={14} />
                                Pass: {assignment.passingScore}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {isAuthenticated && isEnrolled ? (
                            courseProgress >= 90 ? (
                              <button
                                onClick={() => navigate(`/courses/${id}/assignment/${assignment._id}`)}
                                className="bg-[#FC5A00] hover:bg-[#FF6B1A] text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2"
                              >
                                Start Assessment
                                <FiChevronRight />
                              </button>
                            ) : (
                              <div className="text-right">
                                <span className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                                  <FiLock size={14} />
                                  Locked
                                </span>
                                <p className="text-xs text-orange-600 font-semibold mt-1">
                                  Current Progress: {Math.round(courseProgress)}% <br/>
                                  Complete {Math.max(0, Math.ceil(90 - courseProgress))}% more to unlock
                                </p>
                              </div>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-bold text-sm">
                              <FiLock size={14} />
                              Enroll to Access
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar for Locked State */}
                      {isAuthenticated && isEnrolled && courseProgress < 90 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-gray-500">Unlock Progress</span>
                            <span className="font-bold text-[#FC5A00]">{Math.round(courseProgress)}% / 90%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-[#FC5A00] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(courseProgress, 90)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {sections?.length === 0 && (
            <div className="text-center py-16 lg:py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6 border-2 border-[#FC5A00]/30">
                <FiBook className="text-[#FC5A00]" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Content Coming Soon</h3>
              <p className="text-gray-600 font-bold max-w-md mx-auto">
                Our team is working hard to prepare amazing content for this course. Check back soon!
              </p>
            </div>
          )}

          {/* Enrollment CTA at Bottom */}
          {(!isAuthenticated || !isEnrolled) && (
            <div className="mt-12 bg-gradient-to-r from-[#FC5A00]/10 to-orange-50 border border-[#FC5A00]/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {!isAuthenticated ? 'Login to Start Learning' : 'Ready to Start Learning?'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {!isAuthenticated 
                  ? 'Join thousands of students who are already learning with us. Login now to enroll in this course and start your learning journey today!'
                  : `Join ${course?.enrollmentCount || 0}+ students who have already enrolled in this course. Get lifetime access to all materials!`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isAuthenticated ? (
                  <>
                    <button 
                      className="bg-[#FC5A00] hover:bg-[#FF6B1A] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-[#FC5A00]/20 hover:shadow-[#FC5A00]/30"
                      onClick={handleLoginRedirect}
                    >
                      Login Now
                    </button>
                    <button 
                      className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-gray-800/20 hover:shadow-gray-800/30"
                      onClick={() => navigate('/register')}
                    >
                      Create Account
                    </button>
                  </>
                ) : (
                  <button 
                    className="bg-[#FC5A00] hover:bg-[#FF6B1A] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-[#FC5A00]/20 hover:shadow-[#FC5A00]/30"
                    onClick={handleEnrollClick}
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note Modal */}
      <NoteModal 
        isOpen={isNoteModalOpen} 
        onClose={() => setIsNoteModalOpen(false)} 
        note={selectedNote} 
      />
    </div>
  );
};

export default CourseOverview;