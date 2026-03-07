import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Section from '../models/Section.js';
import Certificate from '../models/Certificate.js';
import LiveClass from '../models/LiveClass.js';
import Enrollment from '../models/Enrollment.js';

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
          let currentDay = null;
          let currentDayTitle = null;
          let totalDays = 0;

          // Get all sections (days) for this course, ordered
          const sections = await Section.find({ courseId }).sort({ order: 1 });
          totalDays = sections.length;

          if (progressDoc) {
             completedCount = progressDoc.completedLessons.length;
             realProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

             // Figure out which day (section) the student is currently on
             const completedLessonIds = new Set(
               progressDoc.completedLessons.map(cl => cl.lesson.toString())
             );

             for (let i = 0; i < sections.length; i++) {
               const sectionLessons = await Lesson.find({ sectionId: sections[i]._id }).select('_id');
               const allCompleted = sectionLessons.length > 0 && 
                 sectionLessons.every(l => completedLessonIds.has(l._id.toString()));
               
               if (!allCompleted) {
                 currentDay = i + 1; // 1-indexed day number
                 currentDayTitle = sections[i].title;
                 break;
               }
             }

             // If all sections completed, mark as last day
             if (currentDay === null && sections.length > 0) {
               currentDay = sections.length;
               currentDayTitle = sections[sections.length - 1].title;
             }
          } else {
            // No progress yet, they are on Day 1
            if (sections.length > 0) {
              currentDay = 1;
              currentDayTitle = sections[0].title;
            }
          }

          return {
            ...enrollment.toObject(),
            progress: realProgress,
            totalLessons,
            completedLessons: completedCount,
            currentDay,
            currentDayTitle,
            totalDays
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
      currentDay: enrollment.currentDay,
      currentDayTitle: enrollment.currentDayTitle,
      totalDays: enrollment.totalDays,
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
    const status = req.query.status;

    // --- Use Enrollment collection as source of truth ---
    // Get enrollment counts per user from the Enrollment collection
    const enrollmentCountsByUser = await Enrollment.aggregate([
      { $group: { _id: '$user', enrollmentCount: { $sum: 1 } } }
    ]);
    const enrollmentMap = new Map(
      enrollmentCountsByUser.map(e => [e._id.toString(), e.enrollmentCount])
    );

    // Get list of user IDs who have at least 1 enrollment
    const activeUserIds = enrollmentCountsByUser
      .filter(e => e.enrollmentCount > 0)
      .map(e => e._id);

    // Build base query using $and to safely combine conditions
    const conditions = [{ role: 'student' }];

    if (searchTerm) {
      conditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    // Status filter using Enrollment collection data
    if (status === 'active') {
      conditions.push({ _id: { $in: activeUserIds } });
    } else if (status === 'inactive') {
      conditions.push({ _id: { $nin: activeUserIds } });
    }

    // Enrollment filter (All / Enrolled / Not Enrolled)
    const enrollment = req.query.enrollment;
    if (enrollment === 'enrolled') {
      // User is enrolled if they are in Enrollment collection OR have legacy enrolledCourses
      conditions.push({
        $or: [
          { _id: { $in: activeUserIds } },
          { enrolledCourses: { $exists: true, $not: { $size: 0 } } }
        ]
      });
    } else if (enrollment === 'not_enrolled') {
      // User is NOT enrolled if they are NOT in Enrollment collection AND have empty/no legacy enrolledCourses
      conditions.push({
        $and: [
          { _id: { $nin: activeUserIds } },
          { $or: [
            { enrolledCourses: { $exists: false } },
            { enrolledCourses: { $size: 0 } }
          ]}
        ]
      });
    }

    const query = conditions.length === 1 ? conditions[0] : { $and: conditions };

    const students = await User.find(query)
      .populate('enrolledCourses.courseId', 'title thumbnail')
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const totalStudents = await User.countDocuments(query);

    // --- Aggregate stats from Enrollment collection (source of truth) ---
    const activeStudentsCount = activeUserIds.length;
    const totalEnrollments = await Enrollment.countDocuments();
    const certificatesIssued = await Certificate.countDocuments();

    // Get enrollment counts for THIS page's students from Enrollment collection
    const studentIds = students.map(s => s._id);
    const perStudentEnrollments = await Enrollment.aggregate([
      { $match: { user: { $in: studentIds } } },
      { $group: { _id: '$user', enrollmentCount: { $sum: 1 } } }
    ]);
    const pageEnrollmentMap = new Map(
      perStudentEnrollments.map(e => [String(e._id), e.enrollmentCount])
    );

    // Attach real enrollment count and active status to each student
    const studentsWithRealEnrollments = students.map(student => {
      const s = student.toObject();
      const dbEnrollmentCount = pageEnrollmentMap.get(String(s._id)) || 0;
      const userEnrollmentCount = s.enrolledCourses?.length || 0;
      
      // Use the higher count of the two (handles legacy and new enrollment systems)
      s.realEnrollmentCount = Math.max(dbEnrollmentCount, userEnrollmentCount);
      
      // A student is active if they have at least one enrollment record
      s.isActive = s.realEnrollmentCount > 0;
      
      return s;
    });

    res.status(200).json({
      success: true,
      count: students.length,
      totalStudents,
      activeStudents: activeStudentsCount,
      totalEnrollments,
      certificatesIssued,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      data: studentsWithRealEnrollments
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
    const { name, email, phone, password, age, education } = req.body;
    
    let student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update fields if provided
    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (age) student.age = age;
    if (education) student.education = education;
    
    // If password is provided, it will be hashed by the User model's pre-save hook
    if (password) {
      student.password = password;
    }

    await student.save();

    res.status(200).json({
      success: true,
      data: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        role: student.role,
        isVerified: student.isVerified
      }
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