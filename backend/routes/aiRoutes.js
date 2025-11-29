const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getChatHistory,
  getConversation,
  deleteConversation,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

// All routes are protected
router.post('/ask', protect, [
  body('question').notEmpty().withMessage('Question is required'),
  validate,
], askQuestion);

router.get('/history', protect, getChatHistory);
router.get('/conversation/:id', protect, getConversation);
router.delete('/conversation/:id', protect, deleteConversation);

module.exports = router;
