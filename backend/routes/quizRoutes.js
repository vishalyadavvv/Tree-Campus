const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizByLesson,
  updateQuiz,
  submitQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

// Protected routes - Student
router.get('/lesson/:lessonId', protect, getQuizByLesson);
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

module.exports = router;
