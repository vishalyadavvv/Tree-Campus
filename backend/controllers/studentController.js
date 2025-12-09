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

    // ✅ FILTER OUT NULL COURSES FIRST
    const validEnrollments = student.enrolledCourses.filter(enrollment => enrollment.courseId != null);

    // ✅ RECALCULATE PROGRESS FOR EACH VALID COURSE
    const enrolledCoursesWithProgress = await Promise.all(
      validEnrollments.map(async (enrollment) => {
        try {
          const courseId = enrollment.courseId._id;
          
          // Count total lessons in course
          const totalLessons = await Lesson.countDocuments({ courseId });
          
          // Count completed lessons for this course
          const completedLessonIds = student.completedLessons.map(c => c.lessonId);
          const completedCount = await Lesson.countDocuments({
            _id: { $in: completedLessonIds },
            courseId: courseId
          });
          
          // Calculate real-time progress
          const realProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
          
          return {
            ...enrollment.toObject(),
            progress: realProgress,
            totalLessons,
            completedLessons: completedCount
          };
        } catch (err) {
          console.error('Error processing enrollment:', err);
          return null;
        }
      })
    );

    // Filter out any failed enrollments
    const finalEnrollments = enrolledCoursesWithProgress.filter(e => e !== null);

    // Calculate overall statistics
    const totalEnrolledCourses = finalEnrollments.length;
    const totalCompletedLessons = student.completedLessons.length;
    const totalCertificates = student.certificates.length;

    // Calculate overall progress from REAL-TIME data
    let totalProgress = 0;
    if (totalEnrolledCourses > 0) {
      const progressSum = finalEnrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
      totalProgress = Math.round(progressSum / totalEnrolledCourses);
    }

    console.log('📊 Dashboard Stats:', {
      totalCompletedLessons,
      totalProgress,
      enrolledCourses: finalEnrollments.map(e => ({
        title: e.courseId?.title || 'Unknown',
        progress: e.progress
      }))
    });

    // Get recent activity
    const recentCompletionsData = student.completedLessons
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);

    const recentLessonIds = recentCompletionsData.map(completion => completion.lessonId);

    const lessons = await Lesson.find({ _id: { $in: recentLessonIds } })
      .populate('courseId', 'title')
      .lean();

    const lessonMap = new Map();
    lessons.forEach(lesson => {
      lessonMap.set(lesson._id.toString(), lesson);
    });

    const recentActivity = recentCompletionsData
      .map(completion => {
        const lessonIdStr = completion.lessonId.toString();
        const lesson = lessonMap.get(lessonIdStr);
        
        if (!lesson || !lesson.courseId) {
          return null;
        }
        
        return {
          lessonId: completion.lessonId,
          lessonTitle: lesson.title,
          courseTitle: lesson.courseId.title,
          completedAt: completion.completedAt
        };
      })
      .filter(item => item !== null);

    // Course progress details
    const courseProgress = finalEnrollments.map(enrollment => ({
      courseId: enrollment.courseId._id,
      title: enrollment.courseId.title,
      thumbnail: enrollment.courseId.thumbnail,
      category: enrollment.courseId.category,
      instructor: enrollment.courseId.instructor,
      duration: enrollment.courseId.duration,
      progress: enrollment.progress,
      totalLessons: enrollment.totalLessons,
      completedLessons: enrollment.completedLessons,
      enrolledAt: enrollment.enrolledAt
    }));

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
    
    if (finalEnrollments.length > 0) {
      const enrolledCategories = [...new Set(
        finalEnrollments
          .map(e => e.courseId?.category)
          .filter(Boolean)
      )];
      
      const enrolledCourseIds = finalEnrollments
        .map(e => e.courseId?._id)
        .filter(Boolean);
      
      if (enrolledCategories.length > 0) {
        recommendedCourses = await Course.find({
          category: { $in: enrolledCategories },
          _id: { $nin: enrolledCourseIds },
          isPublished: true
        })
          .select('title thumbnail category rating enrollmentCount')
          .sort('-rating')
          .limit(4);
      }
    }
    
    if (recommendedCourses.length === 0) {
      recommendedCourses = await Course.find({ isPublished: true })
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
        recentActivity,
        courseProgress,
        upcomingLiveClasses,
        recommendedCourses,
        studentInfo: {
          name: student.name,
          email: student.email,
          profilePicture: student.profilePicture,
          joinedAt: student.createdAt
        }
      }
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error);
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