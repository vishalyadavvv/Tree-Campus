import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  FiBook, 
  FiAward, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiClock,
  FiVideo,
  FiArrowRight,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw,
  FiUsers,
  FiZap,
  FiMessageCircle,
  FiMic,
  FiGlobe
} from 'react-icons/fi';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const response = await api.get('/students/dashboard');
      
      if (response.data.success) {
        setDashboardData(response.data.data);
        setError(null);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 animate-fadeIn">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 mb-4 last:mb-0">
                  <div className="h-20 w-20 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 mb-4 last:mb-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 w-56 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchDashboardData();
            }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FiAlertCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-6">Unable to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentActivity, courseProgress, upcomingLiveClasses, recommendedCourses, studentInfo } = dashboardData || {};

  // Provide default values if data is missing
  const safeStats = stats || { totalEnrolledCourses: 0, totalCompletedLessons: 0, totalCertificates: 0, totalProgress: 0 };
  const safeStudentInfo = studentInfo || { name: 'Student', email: '', joinedDate: new Date() };
  const safeCourseProgress = courseProgress || [];
  const safeRecentActivity = recentActivity || [];
  const safeUpcomingLiveClasses = upcomingLiveClasses || [];
  const safeRecommendedCourses = recommendedCourses || [];

  // Check if there are enrolled courses
  const hasCourses = safeCourseProgress && safeCourseProgress.length > 0;
  const hasRecentActivity = safeRecentActivity && safeRecentActivity.length > 0;
  const hasUpcomingClasses = safeUpcomingLiveClasses && safeUpcomingLiveClasses.length > 0;
  const hasRecommendedCourses = safeRecommendedCourses && safeRecommendedCourses.length > 0;

  // Filter out invalid courses where courseId is null or undefined
  const validCourses = (safeCourseProgress || []).filter(course => course && course.courseId);

  // Get courses to display (show first 3 by default, all if toggled)
  const displayedCourses = showAllCourses ? validCourses : validCourses.slice(0, 3);
  const hasMoreCourses = hasCourses && validCourses.length > 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-slideDown">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{safeStudentInfo.name}</span>! 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's your learning progress overview</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isRefreshing}
          className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          icon={<FiBook className="w-6 h-6" />}
          title="Enrolled Courses"
          value={safeStats.totalEnrolledCourses}
          subtext={hasCourses ? (() => {
            const earliest = validCourses.reduce((min, c) => {
              const d = new Date(c.enrolledAt);
              return d < min ? d : min;
            }, new Date());
            const days = Math.max(1, Math.ceil((new Date() - earliest) / (1000 * 60 * 60 * 24)));
            return `Learning for ${days} day${days > 1 ? 's' : ''} 🔥`;
          })() : null}
          color="indigo"
          delay="100"
        />
        <StatCard
          icon={<FiCheckCircle className="w-6 h-6" />}
          title="Completed Lessons"
          value={`${safeStats.totalCompletedLessons} / ${validCourses.reduce((sum, c) => sum + (c.totalLessons || 0), 0)}`}
          subtext={safeStats.totalCompletedLessons > 0 ? 'Lessons completed' : null}
          color="emerald"
          delay="200"
        />
        <StatCard
          icon={<FiAward className="w-6 h-6" />}
          title="Certificates Earned"
          value={safeStats.totalCertificates}
          color="amber"
          delay="300"
        />
        <StatCard
          icon={<FiTrendingUp className="w-6 h-6" />}
          title="Overall Progress"
          value={`${safeStats.totalProgress}%`}
          color="purple"
          delay="400"
        />
      </div>

      {/* Spokee AI Quick Access Card */}
      <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        <Link to="/spokee">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <div className="text-3xl">🤖</div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Spokee AI Assistant</h2>
                  <p className="text-blue-100 opacity-90">Your personal AI English learning companion</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-1 backdrop-blur-sm">
                      <FiMic className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium">Pronunciation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-1 backdrop-blur-sm">
                      <FiGlobe className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium">Grammar</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-1 backdrop-blur-sm">
                      <FiMessageCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium">Chat</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-3 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                  <span className="font-semibold">Start Chatting</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Course Progress */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {hasCourses 
                    ? `${safeStats.totalEnrolledCourses} enrolled courses` 
                    : 'No courses yet'}
                </p>
              </div>
              {hasMoreCourses && (
                <button
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-300 group"
                >
                  <span>{showAllCourses ? 'Show Less' : `View All (${safeStats.totalEnrolledCourses})`}</span>
                  <FiArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ${showAllCourses ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            
            {hasCourses ? (
              <div className="space-y-4">
                {/* Show courses based on toggle state */}
                {displayedCourses.map((course, index) => (
                  <CourseProgressCard 
                    key={course.courseId || course._id || index} 
                    course={course}
                    index={index}
                  />
                ))}
                
                {/* Show message when all courses are displayed */}
                {showAllCourses && hasMoreCourses && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      Showing all {safeStats.totalEnrolledCourses} enrolled courses
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FiBook className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No enrolled courses yet</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            {hasRecentActivity ? (
              <div className="space-y-4">
                {safeRecentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-4 p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {activity.lessonTitle || 'Completed Lesson'}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 truncate">
                        {activity.courseTitle || 'Course'}
                      </p>
                      <div className="flex items-center space-x-1 text-gray-500 text-xs mt-2">
                        <FiClock className="w-3 h-3" />
                        <span>{activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FiClock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>

          {/* Upcoming Live Classes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Classes</h2>
              <Link
                to="/live-classes"
                className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-300 text-sm"
              >
                <span>View All</span>
              </Link>
            </div>
            
            {hasUpcomingClasses ? (
              <div className="space-y-4">
                {upcomingLiveClasses.map((liveClass, index) => (
                  <div
                    key={liveClass._id || index}
                    className="group flex items-center space-x-4 p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FiVideo className="w-5 h-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {liveClass.title || 'Live Class'}
                      </p>
                      <div className="flex items-center space-x-1 text-gray-600 text-xs mt-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>{liveClass.scheduledAt ? new Date(liveClass.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Soon'}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full">
                        Join
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FiVideo className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No upcoming classes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Games & Recommended Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Games */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Learning Games</h2>
                <p className="text-gray-600 text-sm">Earn points while learning</p>
              </div>
            </div>
            <Link
              to="/games"
              className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-300 group text-sm"
            >
              <span>View All</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link to="/games/bird-saver" className="block group">
              <div className="flex items-center space-x-4 p-3 hover:bg-teal-50 rounded-xl transition-all duration-300 border border-transparent hover:border-teal-100">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-teal-100">
                    <img 
                      src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765432805/Gemini_Generated_Image_bxpnzobxpnzobxpn_zxgovl.png" 
                      alt="Bird Saver" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">Bird Saver</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">Translate fast to save the birds!</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Easy</span>
                    <span className="text-xs text-teal-600 font-medium">+50 XP</span>
                  </div>
                </div>
                <div className="p-2 bg-teal-100 text-teal-600 rounded-full group-hover:bg-[#0F766E] group-hover:text-white transition-all duration-300">
                  <FiZap className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link to="/games/lock-and-key" className="block group">
              <div className="flex items-center space-x-4 p-3 hover:bg-teal-50 rounded-xl transition-all duration-300 border border-transparent hover:border-teal-100">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-teal-100">
                    <img 
                      src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765432965/Gemini_Generated_Image_idif13idif13idif_pybkin.png" 
                      alt="Lock & Key" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">Lock & Key</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">Unlock treasure with vocabulary</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Medium</span>
                    <span className="text-xs text-teal-600 font-medium">+75 XP</span>
                  </div>
                </div>
                <div className="p-2 bg-teal-100 text-teal-600 rounded-full group-hover:bg-[#0F766E] group-hover:text-white transition-all duration-300">
                  <FiZap className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link to="/games/vocabulary-builder" className="block group">
              <div className="flex items-center space-x-4 p-3 hover:bg-teal-50 rounded-xl transition-all duration-300 border border-transparent hover:border-teal-100">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-teal-100">
                    <img 
                      src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765432978/Gemini_Generated_Image_4ijuit4ijuit4iju_vdpwqc.png" 
                      alt="Vocabulary Builder" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">Vocabulary Builder</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">Master words with fun puzzles</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">Hard</span>
                    <span className="text-xs text-teal-600 font-medium">+100 XP</span>
                  </div>
                </div>
                <div className="p-2 bg-teal-100 text-teal-600 rounded-full group-hover:bg-[#0F766E] group-hover:text-white transition-all duration-300">
                  <FiZap className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommended Courses */}
        {hasRecommendedCourses && (
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended for You</h2>
            <div className="space-y-4">
              {recommendedCourses.map((course, index) => (
                <Link
                  key={course._id || index}
                  to={`/courses/${course._id}`}
                  className="block group"
                >
                  <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {course.title || 'Course Title'}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-500 text-xs">⭐</span>
                          <span className="text-xs font-semibold">{course.rating || '4.5'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500 text-xs">
                          <FiUsers className="w-3 h-3" />
                          <span>{course.enrollmentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/courses"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View all recommendations
                <FiArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, subtext, color, delay }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const bgClasses = {
    indigo: 'bg-indigo-100',
    emerald: 'bg-emerald-100',
    amber: 'bg-amber-100',
    purple: 'bg-purple-100',
  };

  const textClasses = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
  };

  // Convert fraction value "X / Y" to percentage, or handle string with %
  let widthPercentage = '100%';
  if (typeof value === 'string') {
    if (value.includes('%')) {
      widthPercentage = value.replace('%', '') + '%';
    } else if (value.includes('/')) {
      const [num, den] = value.split('/').map(s => parseInt(s.trim()));
      widthPercentage = (den > 0) ? `${Math.round((num / den) * 100)}%` : '0%';
    }
  } else if (typeof value === 'number') {
    widthPercentage = value > 0 ? '100%' : '0%';
  }

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center space-x-4">
        <div className={`${bgClasses[color]} w-12 h-12 rounded-xl flex items-center justify-center ${textClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent mt-1`}>
            {value}
          </h3>
          {subtext && <p className="text-xs text-gray-500 mt-1 truncate">{subtext}</p>}
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-1000`}
            style={{ width: widthPercentage }}
          />
        </div>
      </div>
    </div>
  );
};

// Course Progress Card Component
const CourseProgressCard = ({ course, index }) => {
  const progress = course.progress || 0;
  
  // Handle both flattened shape (from studentController) and populated object shape
  const courseDetails = typeof course.courseId === 'object' && course.courseId !== null ? course.courseId : course;
  const courseId = typeof course.courseId === 'object' ? course.courseId._id : (course.courseId || course._id);
  const title = courseDetails.title || course.title || 'Course Title';
  const thumbnail = courseDetails.thumbnail || course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  
  const getProgressColor = (progress) => {
    if (progress < 30) return 'from-red-500 to-red-600';
    if (progress < 70) return 'from-amber-500 to-amber-600';
    return 'from-emerald-500 to-emerald-600';
  };

  return (
    <Link
      to={`/courses/${courseId}`}
      className="block group"
    >
      <div 
        className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex-shrink-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-300">
              {title}
            </h3>
            {course.currentDay && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 whitespace-nowrap">
                📅 {course.currentDayTitle || `Day ${course.currentDay}`}{course.totalDays ? ` / ${course.totalDays}` : ''}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {course.completedLessons || 0} / {course.totalLessons || 10} lessons completed
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-semibold">Progress</span>
              <span className={`font-bold bg-gradient-to-r ${getProgressColor(progress)} bg-clip-text text-transparent`}>
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all duration-1000`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudentDashboard;