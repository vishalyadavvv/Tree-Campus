import User from '../models/User.js';
import Course from '../models/Course.js';
import Blog from '../models/Blog.js';
import LiveClass from '../models/LiveClass.js';

// @desc    Get dashboard overview
// @route   GET /api/analytics/overview
// @access  Private/Admin
export const getOverview = async (req, res) => {
  try {
    // --- Real counts (ALL data, no filters that hide records) ---
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalLiveClasses = await LiveClass.countDocuments();

    // Published vs draft counts for extra info
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const draftCourses = totalCourses - publishedCourses;
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = totalBlogs - publishedBlogs;

    // --- Real growth: students joined this month vs last month ---
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const studentsThisMonth = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: startOfThisMonth }
    });
    const studentsLastMonth = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
    });

    // Courses created this month vs last
    const coursesThisMonth = await Course.countDocuments({
      createdAt: { $gte: startOfThisMonth }
    });
    const coursesLastMonth = await Course.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
    });

    // Blogs this month vs last
    const blogsThisMonth = await Blog.countDocuments({
      createdAt: { $gte: startOfThisMonth }
    });
    const blogsLastMonth = await Blog.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
    });

    // Live classes this month vs last
    const liveClassesThisMonth = await LiveClass.countDocuments({
      createdAt: { $gte: startOfThisMonth }
    });
    const liveClassesLastMonth = await LiveClass.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
    });

    // Helper: calculate real percentage growth
    const calcGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const pct = Math.round(((current - previous) / previous) * 100);
      return pct >= 0 ? `+${pct}%` : `${pct}%`;
    };

    // --- ALL students (no limit) ---
    const allStudents = await User.find({ role: 'student' })
      .sort('-createdAt')
      .limit(50)
      .select('name email phone createdAt profilePicture enrolledCourses');

    // --- ALL courses (no limit, no isPublished filter) ---
    const allCourses = await Course.find()
      .sort('-enrollmentCount')
      .select('title enrollmentCount rating instructor isPublished category thumbnail');

    // --- Total enrollments across all students ---
    const enrollmentAgg = await User.aggregate([
      { $match: { role: 'student' } },
      { $project: { enrolledCount: { $size: { $ifNull: ['$enrolledCourses', []] } } } },
      { $group: { _id: null, total: { $sum: '$enrolledCount' } } }
    ]);
    const totalEnrollments = enrollmentAgg.length > 0 ? enrollmentAgg[0].total : 0;

    // --- Enrollments this month ---
    const enrollmentsThisMonth = await User.aggregate([
      { $match: { role: 'student' } },
      { $unwind: '$enrolledCourses' },
      { $match: { 'enrolledCourses.enrolledAt': { $gte: startOfThisMonth } } },
      { $count: 'count' }
    ]);
    const enrollThisMonth = enrollmentsThisMonth.length > 0 ? enrollmentsThisMonth[0].count : 0;

    const enrollmentsLastMonth = await User.aggregate([
      { $match: { role: 'student' } },
      { $unwind: '$enrolledCourses' },
      { $match: { 'enrolledCourses.enrolledAt': { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
      { $count: 'count' }
    ]);
    const enrollLastMonth = enrollmentsLastMonth.length > 0 ? enrollmentsLastMonth[0].count : 0;

    // --- Average course rating ---
    const ratingAgg = await Course.aggregate([
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const avgRating = ratingAgg.length > 0 ? parseFloat(ratingAgg[0].avg.toFixed(1)) : 0;

    // --- Categories count ---
    const categories = await Course.distinct('category');
    const categoriesCount = categories.length;

    // --- Live classes breakdown ---
    const scheduledClasses = await LiveClass.countDocuments({ status: 'scheduled' });
    const liveNow = await LiveClass.countDocuments({ status: 'live' });
    const completedClasses = await LiveClass.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalCourses,
          publishedCourses,
          draftCourses,
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          totalLiveClasses,
          scheduledClasses,
          liveNow,
          completedClasses,
          totalEnrollments,
          avgRating,
          categoriesCount
        },
        growth: {
          students: calcGrowth(studentsThisMonth, studentsLastMonth),
          courses: calcGrowth(coursesThisMonth, coursesLastMonth),
          blogs: calcGrowth(blogsThisMonth, blogsLastMonth),
          liveClasses: calcGrowth(liveClassesThisMonth, liveClassesLastMonth),
          enrollments: calcGrowth(enrollThisMonth, enrollLastMonth),
          studentsThisMonth,
          coursesThisMonth,
          blogsThisMonth,
          liveClassesThisMonth,
          enrollThisMonth
        },
        recentStudents: allStudents,
        allCourses: allCourses
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
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
    const courseStats = await Course.find()
      .select('title enrollmentCount rating category')
      .sort('-enrollmentCount');

    res.status(200).json({
      success: true,
      data: courseStats
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
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

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
