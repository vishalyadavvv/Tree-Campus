import express from 'express';
const router = express.Router();
import {
  createQuiz,
  getSectionQuiz,
  getSectionQuizzes,
  updateQuiz,
  submitQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

// Protected routes - Student
router.get('/lesson/:lessonId', protect, getSectionQuiz);
router.get('/section/:id', protect, getSectionQuizzes);
router.post('/:id/submit', protect, [
  body('answers').isArray().withMessage('Answers must be an array'),
], submitQuiz);

// Protected routes - Instructor/Admin
router.post('/', protect, authorize('instructor', 'admin'), [
  body('lessonId').isMongoId().withMessage('Valid lesson ID is required'),
  body('title').notEmpty().withMessage('Quiz title is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  validate,
], createQuiz);

router.put('/:id', protect, authorize('instructor', 'admin'), updateQuiz);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteQuiz);

export default router;
