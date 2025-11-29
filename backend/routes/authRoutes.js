const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  signup,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
} = require('../controllers/authController');

const { validateSignup, validateLogin, validateOTP, validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

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

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  validate
], forgotPassword);

// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], resetPassword);

// ----------------- Protected Routes -----------------

// Logout
router.post('/logout', protect, logout);

module.exports = router;
