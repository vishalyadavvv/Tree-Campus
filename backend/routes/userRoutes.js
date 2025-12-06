import express from 'express';
const router = express.Router();
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate, validateObjectId } from '../middleware/validate.js';

// Protected routes - All users
router.get('/profile', protect, getProfile);

// Update profile route (removed duplicate)
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('preferredLanguage').optional().isIn(['english', 'hindi']).withMessage('Valid language is required'),
  validate,
], updateProfile);

router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate,
], changePassword);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), validateObjectId, getUserById);
router.put('/:id/role', protect, authorize('admin'), [
  body('role').isIn(['student', 'admin']).withMessage('Valid role is required'),
  validate,
], updateUserRole);
router.delete('/:id', protect, authorize('admin'), validateObjectId, deleteUser);

export default router;