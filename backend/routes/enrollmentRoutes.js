// server/routes/enrollmentRoutes.js
import express from 'express';
import {
  checkEnrollment,
  enrollInCourse,
  getMyEnrollments,
  getEnrollment,
  updateProgress,
  deleteEnrollment
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Check enrollment status for a specific course
router.get('/check/:courseId', checkEnrollment);

// Get all enrollments for current user
router.get('/my-courses', getMyEnrollments);

// Enroll in a course
router.post('/', enrollInCourse);

// Get, update, or delete specific enrollment
router.route('/:id')
  .get(getEnrollment)
  .delete(deleteEnrollment);

// Update enrollment progress
router.put('/:id/progress', updateProgress);

export default router;