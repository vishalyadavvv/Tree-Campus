const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Quiz = require('../models/Quiz');

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Fetch user's enrolled courses with progress
    const enrolledCourses = await Course.find({
      _id: { $in: req.user.enrolledCourses }
    })
    .populate('instructor', 'name')
    .lean();

    // Fetch user's progress data
    const progressData = await Progress.find({ user: userId })
      .populate('course', 'title')
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    // Calculate stats
    const stats = {
      totalXP: req.user.xp || 0,
      currentStreak: req.user.streak || 0,
      lessonsCompleted: progressData.filter(p => p.completed).length,
      hoursLearned: Math.floor(req.user.totalStudyTime / 60) || 0,
      quizzesPassed: await Quiz.countDocuments({ 
        user: userId, 
        passed: true 
      }),
      rank: req.user.rank || 'Beginner',
    };

    // Get weekly progress (last 7 days)
    const weeklyProgress = await getWeeklyProgress(userId);

    // Get recent activity
    const recentActivity = await getRecentActivity(userId);

    // Get upcoming tasks
    const upcomingTasks = await getUpcomingTasks(userId);

    // Format enrolled courses with progress
    const coursesWithProgress = enrolledCourses.map(course => {
      const progress = progressData.find(p => 
        p.course._id.toString() === course._id.toString()
      );
      
      return {
        ...course,
        progress: progress?.percentage || 0,
        completedLessons: progress?.completedLessons?.length || 0,
        nextLesson: progress?.nextLesson || null,
      };
    });

    res.json({
      enrolledCourses: coursesWithProgress,
      recentActivity,
      weeklyProgress,
      stats,
      upcomingTasks,
      notifications: req.user.notifications || [],
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Helper function to get weekly progress
const getWeeklyProgress = async (userId) => {
  const days = 7;
  const progress = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const dayProgress = await Progress.find({
      user: userId,
      updatedAt: { $gte: date, $lt: nextDay }
    });
    
    const percentage = dayProgress.length > 0
      ? Math.round(dayProgress.reduce((sum, p) => sum + p.percentage, 0) / dayProgress.length)
      : 0;
    
    progress.push(percentage);
  }
  
  return progress;
};

// Helper function to get recent activity
const getRecentActivity = async (userId) => {
  const activities = await Progress.find({ user: userId })
    .sort({ updatedAt: -1 })
    .limit(4)
    .populate('course', 'title slug')
    .lean();
  
  return activities.map(activity => ({
    _id: activity._id,
    type: 'lesson',
    title: activity.lastLesson?.title || 'Lesson completed',
    date: getRelativeTime(activity.updatedAt),
    link: `/courses/${activity.course.slug}/lesson/${activity.lastLesson?._id}`,
  }));
};

// Helper function to get upcoming tasks
const getUpcomingTasks = async (userId) => {
  // This would query your tasks/assignments collection
  // For now, return empty array
  return [];
};

// Helper function to format relative time
const getRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};