const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const Progress = require('../models/Progress');

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private (Instructor/Admin)
 */
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, tags } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      level,
      tags,
      instructor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
const getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .populate('lessons')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        courses,
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
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profilePicture')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } },
        populate: { path: 'quiz' },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private (Instructor/Admin)
 */
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private (Instructor/Admin)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    // Delete all lessons
    await Lesson.deleteMany({ course: req.params.id });

    // Delete course
    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload course thumbnail
 * @route   POST /api/courses/:id/thumbnail
 * @access  Private (Instructor/Admin)
 */
const uploadThumbnail = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    course.thumbnail = req.file.path;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        thumbnailUrl: course.thumbnail,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enroll in course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Student)
 */
const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    if (course.students.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
      });
    }

    // Add student to course
    course.students.push(req.user._id);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id },
    });

    // Create progress record
    await Progress.create({
      user: req.user._id,
      course: course._id,
    });

    res.status(200).json({
      success: true,
      message: 'Enrolled successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get instructor's courses
 * @route   GET /api/courses/instructor/my-courses
 * @access  Private (Instructor)
 */
const getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('lessons')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get enrolled courses
 * @route   GET /api/courses/enrolled
 * @access  Private (Student)
 */
const getEnrolledCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: {
        path: 'instructor',
        select: 'name email',
      },
    });

    res.status(200).json({
      success: true,
      data: user.enrolledCourses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create lesson
 * @route   POST /api/courses/:id/lessons
 * @access  Private (Instructor/Admin)
 */
const createLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course',
      });
    }

    const { title, description, duration, order, isFree } = req.body;

    const lesson = await Lesson.create({
      title,
      description,
      duration,
      order: order || course.lessons.length + 1,
      course: course._id,
      isFree,
    });

    // Add lesson to course
    course.lessons.push(lesson._id);
    course.duration = (course.duration || 0) + (duration || 0);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lesson
 * @route   PUT /api/courses/lessons/:lessonId
 * @access  Private (Instructor/Admin)
 */
const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate('course');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson',
      });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.lessonId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete lesson
 * @route   DELETE /api/courses/lessons/:lessonId
 * @access  Private (Instructor/Admin)
 */
const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate('course');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson',
      });
    }

    // Remove lesson from course
    await Course.findByIdAndUpdate(lesson.course._id, {
      $pull: { lessons: lesson._id },
    });

    await lesson.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload lesson video
 * @route   POST /api/courses/lessons/:lessonId/video
 * @access  Private (Instructor/Admin)
 */
const uploadLessonVideo = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate('course');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video',
      });
    }

    lesson.videoUrl = req.file.path;
    await lesson.save();

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        videoUrl: lesson.videoUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadThumbnail,
  enrollCourse,
  getInstructorCourses,
  getEnrolledCourses,
  createLesson,
  updateLesson,
  deleteLesson,
  uploadLessonVideo,
};
