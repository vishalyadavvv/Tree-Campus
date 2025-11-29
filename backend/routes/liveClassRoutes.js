const express = require('express');
const router = express.Router();
const {
  createLiveClass,
  getLiveClasses,
  getLiveClassById,
  updateLiveClass,
  deleteLiveClass,
  joinLiveClass,
  getInstructorLiveClasses,
} = require('../controllers/liveClassController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

// Public/Student routes
router.get('/', protect, getLiveClasses);
router.get('/:id', protect, getLiveClassById);
router.post('/:id/join', protect, joinLiveClass);

// Instructor/Admin routes
router.post('/', protect, authorize('instructor', 'admin'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('scheduledTime').isISO8601().withMessage('Valid scheduled time is required'),
  body('platform').isIn(['Zoom', 'YouTube', 'Other']).withMessage('Valid platform is required'),
  body('meetingLink').isURL().withMessage('Valid meeting link is required'),
  validate,
], createLiveClass);

router.put('/:id', protect, authorize('instructor', 'admin'), updateLiveClass);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLiveClass);
router.get('/instructor/my-classes', protect, authorize('instructor', 'admin'), getInstructorLiveClasses);

module.exports = router;
