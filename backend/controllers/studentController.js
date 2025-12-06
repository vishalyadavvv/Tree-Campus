import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Certificate from '../models/Certificate.js';
import LiveClass from '../models/LiveClass.js';

// @desc    Get student dashboard analytics
// @route   GET /api/students/dashboard
// @access  Private/Student
export const getStudentDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate('enrolledCourses.courseId', 'title thumbnail category instructor duration')
      .populate('certificates', 'courseId issuedAt')
      .select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Calculate overall statistics
    const totalEnrolledCourses = student.enrolledCourses.length;
    const totalCompletedLessons = student.completedLessons.length;
    const totalCertificates = student.certificates.length;

    // Calculate overall progress
    let totalProgress = 0;
    if (totalEnrolledCourses > 0) {
      const progressSum = student.enrolledCourses.reduce((sum, enrollment) => sum + enrollment.progress, 0);
      totalProgress = Math.round(progressSum / totalEnrolledCourses);
    }

    // Get recent activity (last 5 completed lessons)
    const recentCompletions = await Promise.all(
      student.completedLessons
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 5)
        .map(async (completion) => {
          const lesson = await Lesson.findById(completion.lessonId)
            .populate('courseId', 'title');
          return {
            lessonId: completion.lessonId,
            lessonTitle: lesson?.title || 'Unknown Lesson',
            courseTitle: lesson?.courseId?.title || 'Unknown Course',
            completedAt: completion.completedAt
          };
        })
    );

    // Get detailed course progress
    const courseProgress = await Promise.all(
      student.enrolledCourses.map(async (enrollment) => {
        const course = enrollment.courseId;
        const totalLessons = await Lesson.countDocuments({ courseId: course._id });
        const completedLessons = await Lesson.countDocuments({
          _id: { $in: student.completedLessons.map(c => c.lessonId) },
          courseId: course._id
        });

        return {
          courseId: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          category: course.category,
          instructor: course.instructor,
          duration: course.duration,
          progress: enrollment.progress,
          totalLessons,
          completedLessons,
          enrolledAt: enrollment.enrolledAt
        };
      })
    );

    // Get upcoming live classes
    const upcomingLiveClasses = await LiveClass.find({
      scheduledAt: { $gte: new Date() },
      status: 'scheduled'
    })
      .populate('courseId', 'title')
      .sort('scheduledAt')
      .limit(5);

    // Get recommended courses
    let recommendedCourses = [];
    
    if (student.enrolledCourses.length > 0) {
      // If student has enrolled courses, recommend courses in same categories
      const enrolledCategories = [...new Set(student.enrolledCourses.map(e => e.courseId?.category).filter(Boolean))];
      
      if (enrolledCategories.length > 0) {
        recommendedCourses = await Course.find({
          category: { $in: enrolledCategories },
          _id: { $nin: student.enrolledCourses.map(e => e.courseId._id) }
        })
          .select('title thumbnail category rating enrollmentCount')
          .sort('-rating')
          .limit(4);
      }
    }
    
    // If no recommendations yet (new student or no matching categories), get popular courses
    if (recommendedCourses.length === 0) {
      recommendedCourses = await Course.find({})
        .select('title thumbnail category rating enrollmentCount')
        .sort('-enrollmentCount')
        .limit(4);
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEnrolledCourses,
          totalCompletedLessons,
          totalCertificates,
          totalProgress
        },
        recentActivity: recentCompletions,
        courseProgress,
        upcomingLiveClasses,
        recommendedCourses,
        studentInfo: {
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          joinedAt: student.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate('enrolledCourses.courseId', 'title thumbnail')
      .select('-password')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin
export const getStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .populate('enrolledCourses.courseId')
      .populate('certificates')
      .select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
