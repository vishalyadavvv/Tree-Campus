const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Certificate = require('../models/Certificate');
const { generateCertificateData } = require('../utils/generateCertificate');

/**
 * @desc    Mark lesson as completed
 * @route   POST /api/progress/lesson/:lessonId/complete
 * @access  Private (Student)
 */
const markLessonComplete = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    let progress = await Progress.findOne({
      user: req.user._id,
      course: lesson.course,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: lesson.course,
      });
    }

    // Check if already completed
    const alreadyCompleted = progress.completedLessons.some(
      cl => cl.lesson.toString() === lesson._id.toString()
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({
        lesson: lesson._id,
        completedAt: Date.now(),
      });

      // Update last accessed
      progress.lastAccessedAt = Date.now();

      await progress.save();

      // Calculate progress
      await progress.calculateProgress();
    }

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      data: {
        progress: progress.overallProgress,
        completedLessons: progress.completedLessons.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get progress for a course
 * @route   GET /api/progress/course/:courseId
 * @access  Private (Student)
 */
const getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    })
      .populate('completedLessons.lesson')
      .populate('quizScores.lesson')
      .populate('quizScores.quiz');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found for this course',
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user analytics (all courses)
 * @route   GET /api/progress/analytics
 * @access  Private (Student)
 */
const getUserAnalytics = async (req, res, next) => {
  try {
    const progressRecords = await Progress.find({ user: req.user._id })
      .populate('course', 'title thumbnail category');

    const analytics = {
      totalCourses: progressRecords.length,
      completedCourses: progressRecords.filter(p => p.overallProgress === 100).length,
      inProgressCourses: progressRecords.filter(p => p.overallProgress > 0 && p.overallProgress < 100).length,
      certificatesEarned: progressRecords.filter(p => p.certificateIssued).length,
      totalLessonsCompleted: progressRecords.reduce((sum, p) => sum + p.completedLessons.length, 0),
      averageProgress: progressRecords.length > 0
        ? Math.round(progressRecords.reduce((sum, p) => sum + p.overallProgress, 0) / progressRecords.length)
        : 0,
      courses: progressRecords.map(p => ({
        course: p.course,
        progress: p.overallProgress,
        completedLessons: p.completedLessons.length,
        certificateIssued: p.certificateIssued,
        lastAccessed: p.lastAccessedAt,
      })),
    };

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Issue certificate
 * @route   POST /api/progress/course/:courseId/certificate
 * @access  Private (Student)
 */
const issueCertificate = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found for this course',
      });
    }

    // Check if course is 100% complete
    if (progress.overallProgress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course must be 100% complete to receive certificate',
        currentProgress: progress.overallProgress,
      });
    }

    // Check if certificate already issued
    if (progress.certificateIssued) {
      const existingCertificate = await Certificate.findOne({
        user: req.user._id,
        course: req.params.courseId,
      });

      return res.status(200).json({
        success: true,
        message: 'Certificate already issued',
        data: existingCertificate,
      });
    }

    // Get course and user details
    const course = await Course.findById(req.params.courseId).populate('instructor', 'name');
    const user = req.user;

    // Generate certificate
    const certificateData = generateCertificateData({
      userName: user.name,
      courseName: course.title,
      certificateId: '', // Will be auto-generated
      completionDate: Date.now(),
      instructorName: course.instructor.name,
    });

    // Create certificate record
    const certificate = await Certificate.create({
      user: user._id,
      course: course._id,
      certificateUrl: `https://treecampus.com/certificates/${certificateData.certificateId}`, // Placeholder
      completionDate: Date.now(),
    });

    // Update progress
    progress.certificateIssued = true;
    progress.certificateUrl = certificate.certificateUrl;
    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: {
        certificate,
        certificateData, // For frontend to generate PDF
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user certificates
 * @route   GET /api/progress/certificates
 * @access  Private (Student)
 */
const getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('course', 'title thumbnail category')
      .sort({ issuedDate: -1 });

    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markLessonComplete,
  getCourseProgress,
  getUserAnalytics,
  issueCertificate,
  getUserCertificates,
};
