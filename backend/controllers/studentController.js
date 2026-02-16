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
    const studentId = req.user._id;

    // Get student with enrolled courses
    const student = await User.findById(studentId)
      .populate('enrolledCourses.courseId', 'title thumbnail category instructor duration')
      .select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // import Progress model dynamically if not imported at top, or assume it's available. 
    // Ideally add: import Progress from '../models/Progress.js'; at the top of file.
    // Since I am replacing the function, I should check imports first.
    // I will add the import in a separate edit or assume I can add it here if I replace the whole file? 
    // No, I am replacing a chunk. I should check if Progress is imported. It is NOT.
    // So I need to add the import as well. But I can't add it in this chunk easily if I only replace the function.
    // I will load it dynamically inside the function or file. 
    // Actually, I can use `await import('../models/Progress.js')` or just rely on a separate edit to add the import.
    // For safety, I will do a multi_replace including the import.
    
    // FETCH PROGRESS FOR ALL COURSES
    // We'll find all Progress documents for this user
    const Progress = (await import('../models/Progress.js')).default;
    const progressDocs = await Progress.find({ user: studentId });

    // Create a map of courseId -> processDoc for O(1) lookup
    const progressMap = {};
    progressDocs.forEach(doc => {
      progressMap[doc.course.toString()] = doc;
    });

    // FILTER OUT NULL COURSES AND ATTACH PROGRESS
    const validEnrollments = student.enrolledCourses.filter(enrollment => enrollment.courseId != null);

    const enrolledCoursesWithProgress = await Promise.all(
      validEnrollments.map(async (enrollment) => {
        try {
          const courseId = enrollment.courseId._id.toString();
          const progressDoc = progressMap[courseId]; // Get progress from Progress model

          // Count total lessons in course
          const totalLessons = await Lesson.countDocuments({ courseId });
          
          let completedCount = 0;
          let realProgress = 0;

          if (progressDoc) {
             completedCount = progressDoc.completedLessons.length;
             // Calculate percentage based on total lessons (consistency check)
             realProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
          }

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

    // Filter out errors
    const finalEnrollments = enrolledCoursesWithProgress.filter(e => e !== null);

    // Calculate overall statistics
    const totalEnrolledCourses = finalEnrollments.length;
    
    // Total Completed Lessons across all courses (sum of completed in each valid enrollment)
    const totalCompletedLessons = finalEnrollments.reduce((sum, e) => sum + e.completedLessons, 0);
    
    const totalCertificates = student.certificates.length;

    // Calculate overall progress
    let totalProgress = 0;
    if (totalEnrolledCourses > 0) {
      const progressSum = finalEnrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
      totalProgress = Math.round(progressSum / totalEnrolledCourses);
    }

    // GET RECENT ACTIVITY FROM PROGRESS DOCUMENTS
    // Aggregate all completed lessons from all progress docs
    let allCompletedLessons = [];
    progressDocs.forEach(doc => {
       if (doc.completedLessons && doc.completedLessons.length > 0) {
           doc.completedLessons.forEach(cl => {
               allCompletedLessons.push({
                   lessonId: cl.lesson,
                   completedAt: cl.completedAt,
                   courseId: doc.course
               });
           });
       }
    });

    // Sort by completedAt desc and take top 5
    const recentCompletionsData = allCompletedLessons
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);

    // Populate lesson details for recent activity
    const recentActivity = await Promise.all(recentCompletionsData.map(async (item) => {
        const lesson = await Lesson.findById(item.lessonId).select('title');
        const course = await Course.findById(item.courseId).select('title');
        
        if (!lesson || !course) return null;

        return {
            lessonId: item.lessonId,
            lessonTitle: lesson.title,
            courseTitle: course.title,
            completedAt: item.completedAt
        };
    }));

    const finalRecentActivity = recentActivity.filter(Boolean);


    // Course progress details for response
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
        recentActivity: finalRecentActivity,
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

// @desc    Get all students (Paginated & Searchable)
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || '';

    // Build query
    let query = { role: 'student' };
    
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .populate('enrolledCourses.courseId', 'title thumbnail')
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const totalStudents = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
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
      .populate('completedLessons.lessonId', 'title')
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