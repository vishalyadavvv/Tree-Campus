import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseSections,
  createSection,
  getSectionLessons,
  createLesson,
  enrollCourse,
  checkEnrollmentStatus,
  getCourseStructure,
  updateSection,
  deleteSection,
  updateLesson,
  deleteLesson,
  uploadCourseThumbnail,  // ✅ Add this import
  upload  // ✅ Add this import
} from '../controllers/courseController.js';
import {
  createQuiz,
  getQuiz,
  getSectionQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz
} from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, adminOnly, createCourse);

router.route('/:id')
  .get(getCourse)
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

// ✅ Add this BEFORE /:id/structure to avoid route conflicts
router.route('/:id/thumbnail')
  .post(protect, adminOnly, upload.single('thumbnail'), uploadCourseThumbnail);

router.route('/:id/structure')
  .get(getCourseStructure);

router.route('/:id/sections')
  .get(getCourseSections)
  .post(protect, adminOnly, createSection);

router.route('/:id/enroll')
  .post(protect, enrollCourse);

router.route('/:id/enrollment-status')
  .get(protect, checkEnrollmentStatus);

router.route('/sections/:id')
  .put(protect, adminOnly, updateSection)
  .delete(protect, adminOnly, deleteSection);

router.route('/sections/:id/lessons')
  .get(getSectionLessons)
  .post(protect, adminOnly, createLesson);

router.route('/sections/:id/quiz')
  .get(getSectionQuiz)
  .post(protect, adminOnly, createQuiz);

router.route('/lessons/:id')
  .put(protect, adminOnly, updateLesson)
  .delete(protect, adminOnly, deleteLesson);

router.route('/quiz/:id')
  .get(getQuiz)
  .put(protect, adminOnly, updateQuiz)
  .delete(protect, adminOnly, deleteQuiz);

router.route('/quiz/:id/submit')
  .post(protect, submitQuiz);

export default router;