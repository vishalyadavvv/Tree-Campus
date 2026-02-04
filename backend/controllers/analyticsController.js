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

    const recentStudents = await User.find({ role: 'student' })
      .sort('-createdAt')
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

// @desc    Get course analytics
// @route   GET /api/analytics/courses
// @access  Private/Admin
export const getCourseAnalytics = async (req, res) => {
  try {
    const courses = await Course.find()
      .select('title enrollmentCount rating category createdAt')
      .sort('-enrollmentCount');

    // Group by category
    const categoryStats = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalEnrollments: { $sum: '$enrollmentCount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        courses,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get enrollment analytics
// @route   GET /api/analytics/enrollments
// @access  Private/Admin
export const getEnrollmentAnalytics = async (req, res) => {
  try {
    // Get enrollments by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const users = await User.find({ role: 'student' });
    
    const enrollmentsByMonth = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    users.forEach(user => {
      user.enrolledCourses.forEach(enrollment => {
        if (enrollment.enrolledAt >= sixMonthsAgo) {
          const month = monthNames[enrollment.enrolledAt.getMonth()];
          const year = enrollment.enrolledAt.getFullYear();
          const key = `${month} ${year}`;
          enrollmentsByMonth[key] = (enrollmentsByMonth[key] || 0) + 1;
        }
      });
    });

    const enrollmentData = Object.keys(enrollmentsByMonth).map(key => ({
      month: key,
      enrollments: enrollmentsByMonth[key]
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
