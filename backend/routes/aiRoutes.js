import express from 'express';
const router = express.Router();
import {
  askQuestion,
  getChatHistory,
  getConversation,
  deleteConversation,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

// All routes are protected
router.post('/ask', protect, [
  body('question').notEmpty().withMessage('Question is required'),
  validate,
], askQuestion);

router.get('/history', protect, getChatHistory);
router.get('/conversation/:id', protect, getConversation);
router.delete('/conversation/:id', protect, deleteConversation);

export default router;
