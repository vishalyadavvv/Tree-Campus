// client/src/pages/Dashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Your axios instance
import { 
  BookOpenIcon, 
  TrophyIcon, 
  FireIcon, 
  ClockIcon,
  AcademicCapIcon,
  SparklesIcon, 
  CalendarIcon,
  BellIcon,
  PlayIcon,
  ChartBarIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('');

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fetch dashboard data from backend
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard");     // ✔ correct request

      // Mock data fallback ONLY if API fails
      const mockData = {
        enrolledCourses: [
          {
            _id: "1",
            title: "Spoken English Basics",
            progress: 65,
            totalLessons: 30,
            completedLessons: 19,
            instructor: { name: "Dr. Sarah Johnson" },
            thumbnail: "/images/courses/spoken-english.jpg",
            nextLesson: { _id: "l20", title: "Lesson 20: Phone Conversations" },
            category: "Speaking",
            slug: "spoken-english-basics",
          },
          {
            _id: "2",
            title: "Grammar Mastery",
            progress: 40,
            totalLessons: 25,
            completedLessons: 10,
            instructor: { name: "Prof. Michael Brown" },
            thumbnail: "/images/courses/grammar.jpg",
            nextLesson: { _id: "l11", title: "Lesson 11: Past Perfect Tense" },
            category: "Grammar",
            slug: "grammar-mastery",
          },
          {
            _id: "3",
            title: "Business Communication",
            progress: 20,
            totalLessons: 20,
            completedLessons: 4,
            instructor: { name: "Ms. Emily Davis" },
            thumbnail: "/images/courses/business.jpg",
            nextLesson: { _id: "l5", title: "Lesson 5: Email Writing" },
            category: "Professional",
            slug: "business-communication",
          },
        ],
        recentActivity: [
          {
            _id: "1",
            type: "lesson",
            title: "Lesson 19: Daily Conversations",
            date: "2 hours ago",
            link: "/courses/spoken-english-basics/lesson/19",
          },
          {
            _id: "2",
            type: "quiz",
            title: "Quiz: Present Tense",
            score: 85,
            date: "Yesterday",
            link: "/quiz/results/q123",
          },
          {
            _id: "3",
            type: "game",
            title: "Word Builder Game",
            score: 120,
            date: "2 days ago",
            link: "/games/word-builder",
          },
          {
            _id: "4",
            type: "achievement",
            title: "Earned 'Fast Learner' Badge",
            date: "3 days ago",
            link: "/profile/achievements",
          },
        ],
        weeklyProgress: [65, 70, 75, 80, 72, 85, 90],
        stats: {
          totalXP: 2450,
          currentStreak: 7,
          lessonsCompleted: 33,
          hoursLearned: 24,
          quizzesPassed: 12,
          rank: "Gold Learner",
        },
        upcomingTasks: [
          {
            _id: "1",
            title: "Complete Grammar Quiz",
            dueDate: "Today",
            priority: "high",
            link: "/quiz/grammar-quiz-1",
          },
          {
            _id: "2",
            title: "Watch Video: Idioms",
            dueDate: "Tomorrow",
            priority: "medium",
            link: "/courses/spoken-english-basics/lesson/21",
          },
          {
            _id: "3",
            title: "Speaking Practice Session",
            dueDate: "In 2 days",
            priority: "low",
            link: "/practice/speaking",
          },
        ],
        notifications: [
          { _id: "1", message: "New course available: IELTS Preparation", isRead: false },
          { _id: "2", message: "You achieved a 7-day streak!", isRead: false },
        ],
      };

      setDashboardData(response?.data || mockData);  // ✔ working fallback
      setLoading(false);                              // ✔ correct
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard. Please try again.");
      setLoading(false);
    }
  };

  fetchDashboardData();


 // Auto-refresh every 30 seconds
  const intervalId = setInterval(() => {
    fetchDashboardData();
  }, 30000); // 30 seconds

  // Cleanup on unmount
  return () => clearInterval(intervalId);
},
[]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#FD5B00] via-orange-500 to-amber-500 text-white"
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-orange-100 text-sm md:text-base mb-1">
                {greeting} 👋
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.name || 'Learner'}!
              </h1>
              <p className="text-orange-100 text-sm md:text-base">
                Continue your learning journey today
              </p>
            </motion.div>

            {/* Quick Stats & Profile */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 md:gap-4"
            >
              <QuickStatBadge 
                icon={FireIcon} 
                value={dashboardData.stats.currentStreak} 
                label="Day Streak" 
              />
              <QuickStatBadge 
                icon={TrophyIcon} 
                value={dashboardData.stats.totalXP} 
                label="Total XP" 
              />
              
              {/* Profile & Settings Links */}
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                  </motion.div>
                </Link>
                <Link to="/settings">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
                  >
                    <Cog6ToothIcon className="w-6 h-6" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8"
      >
        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <StatsGrid stats={dashboardData.stats} />
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
          {/* Progress Chart - Takes 2 columns on large screens */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <ProgressChartCard weeklyData={dashboardData.weeklyProgress} />
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <RecentActivityCard activities={dashboardData.recentActivity} />
          </motion.div>
        </div>

        {/* Enrolled Courses Section */}
        <motion.div variants={itemVariants} className="mt-6 md:mt-8">
          <EnrolledCoursesSection courses={dashboardData.enrolledCourses} />
        </motion.div>

        {/* Bottom Grid - Tasks and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
          <motion.div variants={itemVariants}>
            <UpcomingTasksCard tasks={dashboardData.upcomingTasks} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <QuickActionsCard />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== SUB COMPONENTS ====================

// Loading Screen Component
const LoadingScreen = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-orange-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 border-4 border-orange-200 border-t-[#FD5B00] rounded-full"
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-4 text-gray-600 font-medium"
    >
      Loading your dashboard...
    </motion.p>
  </div>
);

// Error Screen Component
const ErrorScreen = ({ message, onRetry }) => (
  <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-orange-50">
    <div className="text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-6 py-2 bg-[#FD5B00] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
      >
        Try Again
      </motion.button>
    </div>
  </div>
);

// Quick Stat Badge Component
const QuickStatBadge = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-sm">
    <Icon className="w-5 h-5" />
    <div className="text-left">
      <p className="font-bold text-lg">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  </div>
);

// Stats Grid Component
const StatsGrid = ({ stats }) => {
  const statItems = [
    { 
      icon: BookOpenIcon, 
      value: stats.lessonsCompleted, 
      label: 'Lessons Completed',
      color: 'from-[#FD5B00] to-orange-500',
      bgColor: 'bg-orange-50',
      link: '/my-learning/lessons'
    },
    { 
      icon: ClockIcon, 
      value: `${stats.hoursLearned}h`, 
      label: 'Hours Learned',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      link: '/my-learning/progress'
    },
    { 
      icon: AcademicCapIcon, 
      value: stats.quizzesPassed, 
      label: 'Quizzes Passed',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      link: '/my-learning/quizzes'
    },
    { 
      icon: FireIcon, 
      value: stats.currentStreak, 
      label: 'Day Streak',
      color: 'from-amber-500 to-red-500',
      bgColor: 'bg-amber-50',
      link: '/profile/achievements'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {statItems.map((stat, index) => (
        <Link to={stat.link} key={stat.label}>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`${stat.bgColor} rounded-2xl p-4 md:p-6 cursor-pointer transition-shadow hover:shadow-lg`}
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

// Progress Chart Card Component
const ProgressChartCard = ({ weeklyData }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxValue = Math.max(...weeklyData);

  return (
    <motion.div 
      whileHover={{ boxShadow: '0 10px 40px rgba(253, 91, 0, 0.1)' }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Weekly Progress</h2>
          <p className="text-gray-500 text-sm">Your learning activity this week</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD5B00]">
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
          </select>
          <Link to="/my-learning/progress">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-[#FD5B00] text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1"
            >
              <ChartBarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">View All</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 md:gap-4 h-48 md:h-64">
        {weeklyData.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-gray-600">{value}%</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(value / maxValue) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
              className={`w-full rounded-t-lg cursor-pointer transition-all hover:opacity-80 ${
                index === weeklyData.length - 1 
                  ? 'bg-gradient-to-t from-[#FD5B00] to-orange-400' 
                  : 'bg-gradient-to-t from-orange-200 to-orange-100'
              }`}
            />
            <span className="text-xs md:text-sm text-gray-500 font-medium">{days[index]}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FD5B00]" />
            <span className="text-sm text-gray-600">Current: {weeklyData[weeklyData.length - 1]}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-200" />
            <span className="text-sm text-gray-600">Average: {Math.round(weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length)}%</span>
          </div>
        </div>
        <Link to="/my-learning/analytics" className="text-sm text-[#FD5B00] font-medium hover:text-orange-700 flex items-center gap-1">
          Detailed Analytics <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

// Recent Activity Card Component
const RecentActivityCard = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      lesson: BookOpenIcon,
      quiz: AcademicCapIcon,
      game: TrophyIcon,
      achievement: SparklesIcon,
    };
    return icons[type] || BookOpenIcon;
  };

  const getActivityColor = (type) => {
    const colors = {
      lesson: 'bg-blue-100 text-blue-600',
      quiz: 'bg-purple-100 text-purple-600',
      game: 'bg-orange-100 text-[#FD5B00]',
      achievement: 'bg-yellow-100 text-yellow-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <motion.div 
      whileHover={{ boxShadow: '0 10px 40px rgba(253, 91, 0, 0.1)' }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Recent Activity</h2>
        <Link to="/notifications">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative cursor-pointer"
          >
            <BellIcon className="w-5 h-5 text-gray-400 hover:text-[#FD5B00] transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FD5B00] rounded-full" />
          </motion.div>
        </Link>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <Link to={activity.link} key={activity._id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5, backgroundColor: '#FFF7ED' }}
                className="flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.date}</span>
                    {activity.score && (
                      <span className="text-xs bg-[#FD5B00]/10 text-[#FD5B00] px-2 py-0.5 rounded-full font-medium">
                        Score: {activity.score}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </motion.div>
            </Link>
          );
        })}
      </div>

      <Link to="/my-learning/activity">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#FFF7ED' }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2 text-sm text-[#FD5B00] font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          View All Activity <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      </Link>
    </motion.div>
  );
};

// Enrolled Courses Section Component
const EnrolledCoursesSection = ({ courses }) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800">My Courses</h2>
          <p className="text-gray-500 text-sm">Continue where you left off</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/my-learning">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-[#FD5B00] text-[#FD5B00] text-sm font-medium rounded-xl hover:bg-orange-50 transition-colors"
            >
              My Learning
            </motion.button>
          </Link>
          <Link to="/courses">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-[#FD5B00] text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
            >
              Browse All Courses
            </motion.button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {courses.map((course, index) => (
          <CourseCard key={course._id} course={course} index={index} />
        ))}
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, index }) => {
  const categoryColors = {
    Speaking: 'bg-blue-100 text-blue-600',
    Grammar: 'bg-purple-100 text-purple-600',
    Professional: 'bg-amber-100 text-amber-600',
    Vocabulary: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(253, 91, 0, 0.15)' }}
      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
    >
      {/* Course Image */}
      <div className="w-full h-32 bg-gradient-to-br from-[#FD5B00] to-orange-400 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpenIcon className="w-12 h-12 text-white/80" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Category Badge */}
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[course.category] || 'bg-gray-100 text-gray-600'}`}>
        {course.category}
      </span>

      {/* Course Title */}
      <h3 className="font-bold text-gray-800 mt-2 mb-1 line-clamp-1">{course.title}</h3>
      <p className="text-gray-500 text-sm mb-3">{course.instructor?.name}</p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-[#FD5B00]">{course.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            className="h-full bg-gradient-to-r from-[#FD5B00] to-orange-400 rounded-full"
          />
        </div>
      </div>

      {/* Lessons Count & Continue Button */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">
          {course.completedLessons}/{course.totalLessons} lessons
        </span>
        <Link to={`/courses/${course.slug || course._id}/lesson/${course.nextLesson?._id}`}>
          <motion.button
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 text-[#FD5B00] font-medium hover:text-orange-700 text-sm"
          >
            Continue <PlayIcon className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>

      {/* Next Lesson Info */}
      {course.nextLesson && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Next: {course.nextLesson.title}</p>
        </div>
      )}
    </motion.div>
  );
};

// Upcoming Tasks Card Component
const UpcomingTasksCard = ({ tasks }) => {
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-amber-500 bg-amber-50',
    low: 'border-l-emerald-500 bg-emerald-50',
  };

  const priorityLabels = {
    high: { text: 'High', color: 'bg-red-100 text-red-600' },
    medium: { text: 'Medium', color: 'bg-amber-100 text-amber-600' },
    low: { text: 'Low', color: 'bg-emerald-100 text-emerald-600' },
  };

  return (
    <motion.div 
      whileHover={{ boxShadow: '0 10px 40px rgba(253, 91, 0, 0.1)' }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#FD5B00]" />
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Upcoming Tasks</h2>
        </div>
        <Link to="/my-learning/tasks">
          <span className="text-sm text-[#FD5B00] font-medium hover:text-orange-700">View All</span>
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <Link to={task.link} key={task._id}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`p-4 rounded-xl border-l-4 ${priorityColors[task.priority]} cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityLabels[task.priority].color}`}>
                      {priorityLabels[task.priority].text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming tasks! 🎉</p>
        </div>
      )}
    </motion.div>
  );
};

// Quick Actions Card Component
const QuickActionsCard = () => {
  const actions = [
    { icon: BookOpenIcon, label: 'Start Lesson', color: 'from-[#FD5B00] to-orange-500', link: '/courses' },
    { icon: AcademicCapIcon, label: 'Take Quiz', color: 'from-purple-500 to-purple-600', link: '/quizzes' },
    { icon: TrophyIcon, label: 'Play Game', color: 'from-amber-500 to-yellow-500', link: '/games' },
    { icon: SparklesIcon, label: 'Practice', color: 'from-emerald-500 to-teal-500', link: '/practice' },
  ];

  return (
    <motion.div 
      whileHover={{ boxShadow: '0 10px 40px rgba(253, 91, 0, 0.1)' }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link to={action.link} key={action.label}>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`w-full p-4 rounded-xl bg-gradient-to-r ${action.color} text-white flex flex-col items-center gap-2 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          </Link>
        ))}
      </div>

      {/* Additional Links */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
        <Link to="/leaderboard">
          <motion.div 
            whileHover={{ backgroundColor: '#FFF7ED' }}
            className="p-3 rounded-lg text-center cursor-pointer transition-colors"
          >
            <span className="text-sm text-gray-600 hover:text-[#FD5B00]">🏆 Leaderboard</span>
          </motion.div>
        </Link>
        <Link to="/achievements">
          <motion.div 
            whileHover={{ backgroundColor: '#FFF7ED' }}
            className="p-3 rounded-lg text-center cursor-pointer transition-colors"
          >
            <span className="text-sm text-gray-600 hover:text-[#FD5B00]">🎖️ Achievements</span>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default Dashboard;