import express from 'express';
const router = express.Router();
import { body } from 'express-validator';

import {
  signup,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getProfile, // ✅ Import getProfile
} from '../controllers/authController.js';

import { validateSignup, validateLogin, validateOTP, validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

// ----------------- Public Routes -----------------

// Signup
router.post('/signup', validateSignup, signup);

// Verify OTP
router.post('/verify-otp', validateOTP, verifyOTP);

// Resend OTP
router.post('/resend-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  validate
], resendOTP);

// Login
router.post('/login', validateLogin, login);

// Refresh token
router.post('/refresh-token', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  validate
], refreshToken);


// ✅ Forgot password - Clean route, logic in controller
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  validate
], forgotPassword);

// ✅ Reset password - Clean route, logic in controller  
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], resetPassword);



// ----------------- Protected Routes -----------------

// Get user profile
router.get('/profile', protect, getProfile); // ✅ Add this route

// Logout
router.post('/logout', protect, logout);

export default router;