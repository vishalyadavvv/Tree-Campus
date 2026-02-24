import express from 'express';
import {
  createAssignment,
  getCourseAssignments,
  getAssignment,
  checkAssignmentEligibility,
  submitAssignment,
  getSubmission,
  getCourseAssignmentsAdmin,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/course/:courseId/admin', protect, authorize('admin'), getCourseAssignmentsAdmin);
router.post('/course/:courseId', protect, authorize('admin'), createAssignment);
router.put('/:assignmentId', protect, authorize('admin'), updateAssignment);
router.delete('/:assignmentId', protect, authorize('admin'), deleteAssignment);

// Public/Private routes
router.get('/course/:courseId', getCourseAssignments);
router.get('/:assignmentId', protect, getAssignment);
router.get('/:assignmentId/check-eligibility', protect, checkAssignmentEligibility);

// Student submission routes
router.post('/:assignmentId/submit', protect, submitAssignment);
router.get('/:assignmentId/submission', protect, getSubmission);

export default router;
