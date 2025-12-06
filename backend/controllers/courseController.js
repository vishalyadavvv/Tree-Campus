import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete all sections and lessons
    const sections = await Section.find({ courseId: req.params.id });
    for (const section of sections) {
      await Lesson.deleteMany({ sectionId: section._id });
    }
    await Section.deleteMany({ courseId: req.params.id });

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course sections
// @route   GET /api/courses/:id/sections
// @access  Public
export const getCourseSections = async (req, res) => {
  try {
    const sections = await Section.find({ courseId: req.params.id }).sort('order');

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create section
// @route   POST /api/courses/:id/sections
// @access  Private/Admin
export const createSection = async (req, res) => {
  try {
    const section = await Section.create({
      ...req.body,
      courseId: req.params.id
    });

    // Update course total sections count
    const totalSections = await Section.countDocuments({ courseId: req.params.id });
    await Course.findByIdAndUpdate(req.params.id, { totalSections });

    res.status(201).json({
      success: true,
      data: section
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get section lessons
// @route   GET /api/sections/:id/lessons
// @access  Public
export const getSectionLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ sectionId: req.params.id }).sort('order');

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create lesson
// @route   POST /api/sections/:id/lessons
// @access  Private/Admin
export const createLesson = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const lesson = await Lesson.create({
      ...req.body,
      sectionId: req.params.id,
      courseId: section.courseId
    });

    // Update course total lessons count
    const totalLessons = await Lesson.countDocuments({ courseId: section.courseId });
    await Course.findByIdAndUpdate(section.courseId, { totalLessons });

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === req.params.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add to enrolled courses
    user.enrolledCourses.push({
      courseId: req.params.id,
      enrolledAt: new Date(),
      progress: 0
    });

    await user.save();

    // Increment enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: user.enrolledCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check enrollment status
// @route   GET /api/courses/:id/enrollment-status
// @access  Private
export const checkEnrollmentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is enrolled in this course
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === req.params.id
    );

    // Get enrollment details if enrolled
    const enrollmentDetails = isEnrolled 
      ? user.enrolledCourses.find(
          enrollment => enrollment.courseId.toString() === req.params.id
        )
      : null;

    res.status(200).json({
      success: true,
      data: {
        isEnrolled,
        enrollmentDetails
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get complete course structure
// @route   GET /api/courses/:id/structure
// @access  Public
export const getCourseStructure = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const sections = await Section.find({ courseId: req.params.id }).sort('order');
    
    // Get lessons and quizzes for each section
    const sectionsWithContent = await Promise.all(
      sections.map(async (section) => {
        const lessons = await Lesson.find({ sectionId: section._id }).sort('order');
        const Quiz = (await import('../models/Quiz.js')).default;
        const quiz = await Quiz.findOne({ sectionId: section._id });
        
        return {
          ...section.toObject(),
          lessons,
          quiz
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        course,
        sections: sectionsWithContent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update section
// @route   PUT /api/courses/sections/:id
// @access  Private/Admin
export const updateSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete section
// @route   DELETE /api/courses/sections/:id
// @access  Private/Admin
export const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const courseId = section.courseId;

    // Delete all lessons in this section
    await Lesson.deleteMany({ sectionId: req.params.id });

    // Delete quiz for this section
    const Quiz = (await import('../models/Quiz.js')).default;
    await Quiz.deleteMany({ sectionId: req.params.id });

    // Delete the section
    await section.deleteOne();

    // Update course counts
    const totalSections = await Section.countDocuments({ courseId });
    const totalLessons = await Lesson.countDocuments({ courseId });
    const totalQuizzes = await Quiz.countDocuments({ courseId });
    
    await Course.findByIdAndUpdate(courseId, { 
      totalSections, 
      totalLessons,
      totalQuizzes 
    });

    res.status(200).json({
      success: true,
      message: 'Section and its content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/lessons/:id
// @access  Private/Admin
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/lessons/:id
// @access  Private/Admin
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const courseId = lesson.courseId;
    await lesson.deleteOne();

    // Update course total lessons count
    const totalLessons = await Lesson.countDocuments({ courseId });
    await Course.findByIdAndUpdate(courseId, { totalLessons });

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

