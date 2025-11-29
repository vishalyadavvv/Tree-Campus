const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, uploadVideo } = require('../middleware/upload');
const { validateCourse, validateLesson, validateObjectId } = require('../middleware/validate');

// Public routes
router.get('/', getCourses);
router.get('/:id', validateObjectId, getCourseById);

// Protected routes - Student
router.post('/:id/enroll', protect, enrollCourse);
router.get('/enrolled/my-courses', protect, getEnrolledCourses);

// Protected routes - Instructor/Admin
router.post('/', protect, authorize('instructor', 'admin'), validateCourse, createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), validateObjectId, updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), validateObjectId, deleteCourse);
router.post('/:id/thumbnail', protect, authorize('instructor', 'admin'), uploadImage.single('thumbnail'), uploadThumbnail);
router.get('/instructor/my-courses', protect, authorize('instructor', 'admin'), getInstructorCourses);

// Lesson routes
router.post('/:id/lessons', protect, authorize('instructor', 'admin'), validateLesson, createLesson);
router.put('/lessons/:lessonId', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/lessons/:lessonId', protect, authorize('instructor', 'admin'), deleteLesson);
router.post('/lessons/:lessonId/video', protect, authorize('instructor', 'admin'), uploadVideo.single('video'), uploadLessonVideo);

module.exports = router;
