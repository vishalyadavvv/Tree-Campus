const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const User = require('../models/User');

/**
 * @desc    Create live class
 * @route   POST /api/live-classes
 * @access  Private (Instructor/Admin)
 */
const createLiveClass = async (req, res, next) => {
  try {
    const {
      title,
      description,
      courseId,
      scheduledTime,
      duration,
      platform,
      meetingLink,
      meetingId,
      passcode,
    } = req.body;

    // Verify course if provided
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      // Check if instructor owns the course
      if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create live class for this course',
        });
      }
    }

    const liveClass = await LiveClass.create({
      title,
      description,
      course: courseId,
      instructor: req.user._id,
      scheduledTime,
      duration,
      platform,
      meetingLink,
      meetingId,
      passcode,
    });

    res.status(201).json({
      success: true,
      message: 'Live class created successfully',
      data: liveClass,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all live classes
 * @route   GET /api/live-classes
 * @access  Private
 */
const getLiveClasses = async (req, res, next) => {
  try {
    const { courseId, upcoming, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (courseId) {
      query.course = courseId;
    }

    if (upcoming === 'true') {
      query.scheduledTime = { $gte: new Date() };
    }

    const liveClasses = await LiveClass.find(query)
      .populate('instructor', 'name email')
      .populate('course', 'title')
      .sort({ scheduledTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await LiveClass.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        liveClasses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single live class
 * @route   GET /api/live-classes/:id
 * @access  Private
 */
const getLiveClassById = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate('instructor', 'name email profilePicture')
      .populate('course', 'title description')
      .populate('participants', 'name email');

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found',
      });
    }

    res.status(200).json({
      success: true,
      data: liveClass,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update live class
 * @route   PUT /api/live-classes/:id
 * @access  Private (Instructor/Admin)
 */
const updateLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found',
      });
    }

    // Check ownership
    if (liveClass.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this live class',
      });
    }

    const updatedLiveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Live class updated successfully',
      data: updatedLiveClass,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete live class
 * @route   DELETE /api/live-classes/:id
 * @access  Private (Instructor/Admin)
 */
const deleteLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found',
      });
    }

    // Check ownership
    if (liveClass.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this live class',
      });
    }

    await liveClass.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Live class deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Join live class (get meeting link)
 * @route   POST /api/live-classes/:id/join
 * @access  Private (Student)
 */
const joinLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found',
      });
    }

    // Check if class is active
    if (!liveClass.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This live class is no longer active',
      });
    }

    // Check if user is enrolled in the course (if course is specified)
    if (liveClass.course) {
      const user = await User.findById(req.user._id);
      if (!user.enrolledCourses.includes(liveClass.course) && req.user.role !== 'instructor' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in the course to join this live class',
        });
      }
    }

    // Add user to participants if not already added
    if (!liveClass.participants.includes(req.user._id)) {
      liveClass.participants.push(req.user._id);
      await liveClass.save();
    }

    res.status(200).json({
      success: true,
      message: 'Joined live class successfully',
      data: {
        title: liveClass.title,
        scheduledTime: liveClass.scheduledTime,
        duration: liveClass.duration,
        platform: liveClass.platform,
        meetingLink: liveClass.meetingLink,
        meetingId: liveClass.meetingId,
        passcode: liveClass.passcode,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get instructor's live classes
 * @route   GET /api/live-classes/instructor/my-classes
 * @access  Private (Instructor)
 */
const getInstructorLiveClasses = async (req, res, next) => {
  try {
    const liveClasses = await LiveClass.find({ instructor: req.user._id })
      .populate('course', 'title')
      .sort({ scheduledTime: -1 });

    res.status(200).json({
      success: true,
      data: liveClasses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLiveClass,
  getLiveClasses,
  getLiveClassById,
  updateLiveClass,
  deleteLiveClass,
  joinLiveClass,
  getInstructorLiveClasses,
};
