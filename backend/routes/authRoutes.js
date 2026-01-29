import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import passport from 'passport';
import { generateTokens } from '../utils/generateToken.js';

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

// Google OAuth Routes
router.get('/google', (req, res, next) => {
  const platform = req.query.platform || 'web'; // Default to 'web'
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: platform // Pass platform as state to retrieve later
  })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      // Successful authentication
      const tokens = generateTokens(req.user._id);
      const platform = req.query.state || 'web'; // Retrieve platform from state
      
      const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profilePicture: req.user.profilePicture,
        isVerified: req.user.isVerified
      };

      // Platform-specific redirect logic
      if (platform === 'mobile') {
        // Mobile app deep link redirect
        const mobileScheme = process.env.MOBILE_APP_SCHEME || 'treecampus';
        const redirectUrl = new URL(`${mobileScheme}://login-callback`);
        redirectUrl.searchParams.set('token', tokens.accessToken);
        redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
        redirectUrl.searchParams.set('user', JSON.stringify(user));
        
        res.redirect(redirectUrl.toString());
      } else {
        // Web frontend redirect (default behavior)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = new URL(`${frontendUrl}/login`);
        redirectUrl.searchParams.set('token', tokens.accessToken);
        redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
        redirectUrl.searchParams.set('user', JSON.stringify(user));
        
        res.redirect(redirectUrl.toString());
      }
    } catch (error) {
      console.error('Google Callback Error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

export default router;