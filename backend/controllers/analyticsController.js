import User from '../models/User.js';
import Course from '../models/Course.js';
import Blog from '../models/Blog.js';
import LiveClass from '../models/LiveClass.js';

// @desc    Get dashboard overview
// @route   GET /api/analytics/overview
// @access  Private/Admin
export const getOverview = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalBlogs = await Blog.countDocuments({ status: 'published' });
    const totalLiveClasses = await LiveClass.countDocuments();

    // Limit to top 10 most recent for performance
    const recentStudents = await User.find({ role: 'student' })
      .sort('-createdAt')
      .limit(10)
      .select('name email phone createdAt');

    const popularCourses = await Course.find()
      .sort('-enrollmentCount')
      .limit(5)
      .select('title enrollmentCount rating');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalCourses,
          totalBlogs,
          totalLiveClasses
        },
        recentStudents,
        popularCourses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ... (skipping getCourseAnalytics)

// @desc    Get enrollment analytics
// @route   GET /api/analytics/enrollments
// @access  Private/Admin
export const getEnrollmentAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Optimized aggregation directly in DB instead of loading all users into memory
    const enrollmentStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $unwind: '$enrolledCourses' },
      { $match: { 'enrolledCourses.enrolledAt': { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: '$enrolledCourses.enrolledAt' },
            year: { $year: '$enrolledCourses.enrolledAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const enrollmentData = enrollmentStats.map(stat => ({
      month: `${monthNames[stat._id.month - 1]} ${stat._id.year}`,
      enrollments: stat.count
    }));

    res.status(200).json({
      success: true,
      data: enrollmentData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
