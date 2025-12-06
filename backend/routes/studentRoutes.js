import express from 'express';
import { getStudents, getStudent, updateStudent, deleteStudent, getStudentDashboard } from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Student dashboard route (accessible to all authenticated users)
router.get('/dashboard', protect, getStudentDashboard);

// Admin-only routes
router.use(protect, adminOnly);

router.route('/')
  .get(getStudents);

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent);

export default router;
