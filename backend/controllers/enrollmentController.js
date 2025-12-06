// server/controllers/enrollmentController.js
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

/**
 * @desc    Check if user is enrolled in a course
 * @route   GET /api/enrollments/check/:courseId
 * @access  Private
 */
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check enrollment status',
      error: error.message
    });
  }
};

/**
 * @desc    Enroll user in a course
 * @route   POST /api/enrollments
 * @access  Private
 */
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // ❗ Only students can enroll
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can enroll in courses"
      });
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    // Update user's enrolledCourses array
    await User.findByIdAndUpdate(userId, {
      $push: {
        enrolledCourses: {
          courseId: courseId,
          progress: 0
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      enrollment
    });

  } catch (error) {
    console.error('Enrollment error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};



/**
 * @desc    Get all enrollments for current user
 * @route   GET /api/enrollments/my-courses
 * @access  Private
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate('course', 'title description thumbnail instructor category level duration')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
};

/**
 * @desc    Get single enrollment details
 * @route   GET /api/enrollments/:id
 * @access  Private
 */
export const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Verify user owns this enrollment
    if (enrollment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this enrollment'
      });
    }

    res.status(200).json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment',
      error: error.message
    });
  }
};

/**
 * @desc    Update enrollment progress
 * @route   PUT /api/enrollments/:id/progress
 * @access  Private
 */
export const updateProgress = async (req, res) => {
  try {
    const { progress, lessonId } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Verify user owns this enrollment
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }

    // Update progress
    if (progress !== undefined) {
      enrollment.progress = Math.min(100, Math.max(0, progress));
    }

    // Add completed lesson if provided
    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      enrollment
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

/**
 * @desc    Delete enrollment (unenroll from course)
 * @route   DELETE /api/enrollments/:id
 * @access  Private
 */
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Verify user owns this enrollment
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this enrollment'
      });
    }

    await enrollment.deleteOne();

    // Decrease course enrollment count
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { enrollmentCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unenroll from course',
      error: error.message
    });
  }
};