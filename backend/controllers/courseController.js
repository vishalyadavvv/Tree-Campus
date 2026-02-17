import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { Readable } from 'stream'; 


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

import fs from 'fs';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    fs.appendFileSync('debug_hit.txt', `HIT AT ${new Date().toISOString()} query: ${JSON.stringify(req.query)}\n`);
    console.log('GET /api/courses - Query:', req.query);
    console.log('DB URI Length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 'MISSING');
    
    let query = {};
    if (req.query.adminView !== 'true') {
      query.isPublished = true;
    }

    const courses = await Course.find(query).sort('-createdAt');
    console.log(`Found ${courses.length} courses in DB with query:`, JSON.stringify(query));
    courses.forEach(c => console.log(`- ${c.title} (isPublished: ${c.isPublished})`));
    
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

    // If a file was uploaded via multer/uploadMiddleware
    const pdfUrl = req.file ? req.file.path : '';
    const pdfFileName = req.file ? req.file.originalname : '';

    const lesson = await Lesson.create({
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      duration: req.body.duration,
      content: req.body.content || '',
      textContent: req.body.textContent || '',
      pdfUrl,
      pdfFileName,
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

    // --- PROGRESS LOGIC START ---
    let userId = null;
    let userProgress = null;

    // Optional Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        userId = decoded.id;
        // Fetch progress for this specific user and course
        userProgress = await Progress.findOne({ user: userId, course: req.params.id });
      } catch (err) {
        console.warn("Invalid token in structure API - falling back to public view");
      }
    }

    const completedLessonIds = userProgress 
      ? userProgress.completedLessons.map(cl => cl.lesson.toString()) 
      : [];
    // --- PROGRESS LOGIC END ---

    const sections = await Section.find({ courseId: req.params.id }).sort('order');
    const sectionIds = sections.map(s => s._id);

    // Optimized: Fetch all lessons and quizzes for all sections at once
    const allLessons = await Lesson.find({ 
      courseId: req.params.id,
      sectionId: { $in: sectionIds }
    }).sort('order');

    const Quiz = (await import('../models/Quiz.js')).default;
    const allQuizzes = await Quiz.find({ 
      courseId: req.params.id,
      sectionId: { $in: sectionIds }
    });

    // Group lessons and quizzes by sectionId for O(1) retrieval
    const lessonsBySection = {};
    const quizzesBySection = {};

    allLessons.forEach(lesson => {
      const sid = lesson.sectionId.toString();
      if (!lessonsBySection[sid]) lessonsBySection[sid] = [];
      lessonsBySection[sid].push({
        ...lesson.toObject(),
        isCompleted: completedLessonIds.includes(lesson._id.toString())
      });
    });

    allQuizzes.forEach(quiz => {
      quizzesBySection[quiz.sectionId.toString()] = quiz;
    });
    
    // Assemble the final structure
    const sectionsWithContent = sections.map(section => {
      const sid = section._id.toString();
      return {
        ...section.toObject(),
        lessons: lessonsBySection[sid] || [],
        quiz: quizzesBySection[sid] || null
      };
    });

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
    let updateData = {
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      duration: req.body.duration,
      content: req.body.content || '',
      textContent: req.body.textContent || ''
    };

    // If a new file was uploaded via multer/uploadMiddleware
    if (req.file) {
      updateData.pdfUrl = req.file.path;
      updateData.pdfFileName = req.file.originalname;
    }

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// @desc    Reorder lessons within a section
// @route   PUT /api/courses/sections/:id/reorder-lessons
// @access  Private/Admin
export const reorderLessons = async (req, res) => {
  try {
    const { lessonOrder } = req.body; // [{id, order}, ...]

    if (!lessonOrder || !Array.isArray(lessonOrder)) {
      return res.status(400).json({
        success: false,
        message: 'lessonOrder array is required'
      });
    }

    const bulkOps = lessonOrder.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));

    await Lesson.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Lessons reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Upload course thumbnail
// @route   POST /api/courses/:id/thumbnail
// @access  Private/Admin
// @desc    Upload course thumbnail
// @route   POST /api/courses/:id/thumbnail
// @access  Private/Admin
export const uploadCourseThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // ✅ Delete old thumbnail from Cloudinary if it exists
    if (course.thumbnailPublicId) {
      try {
        await cloudinary.uploader.destroy(course.thumbnailPublicId);
      } catch (deleteError) {
        console.error('Error deleting old thumbnail:', deleteError);
      }
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'courses/thumbnails',
        resource_type: 'image',
        transformation: [
          { width: 800, height: 450, crop: 'fill' },
          { quality: 'auto' }
        ]
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Error uploading to Cloudinary'
          });
        }

        course.thumbnail = result.secure_url;
        course.thumbnailPublicId = result.public_id;
        await course.save();

        res.status(200).json({
          success: true,
          message: 'Thumbnail uploaded successfully',
          data: {
            thumbnail: result.secure_url
          }
        });
      }
    );

    const bufferStream = Readable.from(req.file.buffer);
    bufferStream.pipe(uploadStream);

  } catch (error) {
    console.error('Error in uploadCourseThumbnail:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export{upload}