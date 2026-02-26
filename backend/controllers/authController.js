import User from '../models/User.js';
import { generateTokens, generateResetToken } from '../utils/generateToken.js';
import { sendOTPEmail, sendPasswordResetEmail } from '../utils/sendEmail.js';
import * as messageCentral from '../utils/messageCentral.js';
import { verifyRefreshToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone: req.body.phone,

      password,
     role: role?.toLowerCase() || 'student',

    });

    // Generate OTP and Send via WhatsApp
    let otpSent = true;
    let otpError = null;

    try {
      const mcResponse = await messageCentral.sendWhatsAppOTP(req.body.phone);
      if (mcResponse.success) {
        user.verificationId = mcResponse.verificationId;
        await user.save();
      }
    } catch (err) {
      console.error('❌ Failed to send WhatsApp OTP during signup:', err.message);
      otpSent = false;
      otpError = err.message;
    }

    res.status(201).json({
      success: true,
      message: otpSent 
        ? 'User registered successfully. Please verify your phone with the OTP sent on WhatsApp.'
        : `User registered, but WhatsApp OTP failed: ${otpError}. Please try resending OTP from the verification page.`,
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        otpSent
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry +verificationId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    // Validate OTP using Message Central
    try {
      await messageCentral.validateOTP(user.verificationId, otp);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.verificationId = undefined;
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
        },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
const resendOTP = async (req, res, next) => {
  try {
    const { email, newPhone } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    // If new phone number is provided, update it
    if (newPhone) {
      // Validate phone number
      if (newPhone.length !== 10) {
        return res.status(400).json({ success: false, message: 'Phone number must be 10 digits' });
      }

      // Check if phone number is already in use by another user
      const existingPhone = await User.findOne({ phone: newPhone, _id: { $ne: user._id } });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'Phone number already registered to another account' });
      }

      user.phone = newPhone;
      await user.save();
    }

    if (!user.phone) {
      return res.status(400).json({ success: false, message: 'Phone number not found for this user. Please contact support.' });
    }

    try {
      const mcResponse = await messageCentral.sendWhatsAppOTP(user.phone);
      if (mcResponse.success) {
        user.verificationId = mcResponse.verificationId;
        await user.save();
      }
    } catch (err) {
      console.error('❌ Failed to resend WhatsApp OTP:', err.message);
      
      // ✅ Handle "REQUEST_ALREADY_EXISTS" as success (OTP is already active)
      if (err.message && err.message.includes('REQUEST_ALREADY_EXISTS')) {
        return res.status(200).json({ 
          success: true, 
          message: 'OTP already sent to your WhatsApp. Please check your messages.' 
        });
      }

      return res.status(500).json({ 
        success: false, 
        message: err.message || 'WhatsApp service error. Please try again later.' 
      });
    }

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // ⭐ POPULATE ALL USER DATA INCLUDING COURSES AND LESSONS
    const user = await User.findOne({ email })
      .select('+password')
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'title thumbnail category'
      })
      .populate({
        path: 'completedLessons.lessonId',
        select: 'title'
      })
      .populate('certificates');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    console.log('🔍 DEBUG LOGIN:', {
      email: user.email,
      isVerified: user.isVerified,
      hasPassword: !!user.password,
      passPrefix: user.password ? user.password.substring(0, 10) : 'NO PASSWORD',
      role: user.role,
      inputRole: role
    });
    
    // ⭐ CHECK ROLE MATCH (Only if role is provided from frontend)
    if (role) {
      console.log(`🔍 Checking role match for ${email}: input_role=${role}, db_role=${user.role}`);
      if (user.role.toLowerCase() !== role.toLowerCase()) {
        console.warn(`⚠️ Role mismatch for ${email}: expected ${user.role}, got ${role}`);
        return res.status(403).json({ 
          success: false, 
          message: `You are registered as ${user.role}, not as ${role}. Please select the correct role.` 
        });
      }
    } else {
      console.log(`🔍 No role provided in request for ${email}, using db_role=${user.role}`);
    }

    const isPasswordMatch = await user.comparePassword(password);
    console.log('🔍 Password match result:', isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // ✅ COMMENT OUT OR REMOVE THIS AUTO-UPGRADE SECTION
    // if (
    //   user.password &&
    //   (user.password.startsWith("$P$") ||
    //    user.password.startsWith("$H$") ||
    //    user.password.startsWith("$2y$") ||
    //    user.password.startsWith("$wp$2y$") ||
    //    !user.password.startsWith("$"))
    // ) {
    //   console.log("🔄 Upgrading legacy/plain password → bcrypt for", user.email);
    //   user.password = password;
    //   await user.save();
    // }

    if (!user.isVerified) {
      console.warn(`⚠️ User not verified: ${email}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your phone first',
        phone: user.phone
      });
    }

    user.role = user.role.toLowerCase();
    const tokens = generateTokens(user._id);

    // Remove sensitive fields
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.otp;
    delete userObject.otpExpiry;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpiry;

    console.log('✅ Login successful');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: userObject._id,
          name: userObject.name,
          email: userObject.email,
          role: userObject.role,
          isVerified: userObject.isVerified,
          phone: userObject.phone,
          createdAt: userObject.createdAt,
          updatedAt: userObject.updatedAt,
          profilePicture: userObject.profilePicture || '',
          enrolledCourses: userObject.enrolledCourses || [],
          completedLessons: userObject.completedLessons || [],
          certificates: userObject.certificates || [],
        },
        ...tokens,
      },
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};


/**
 * @desc    Forgot password - Send OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found with this email' 
      });
    }

    // Generate OTP and send via WhatsApp
    try {
      const mcResponse = await messageCentral.sendWhatsAppOTP(user.phone);
      if (mcResponse.success) {
        user.verificationId = mcResponse.verificationId;
        await user.save();
      }
    } catch (err) {
      console.error('❌ Failed to send WhatsApp OTP for password reset:', err.message);
      return res.status(500).json({ 
        success: false, 
        message: err.message || 'Failed to send OTP via WhatsApp. Please ensure your phone number is correct.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent to your WhatsApp successfully' 
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    next(error);
  }
};


/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
 const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and select necessary fields
    const user = await User.findOne({ email }).select("+otp +otpExpiry +password +verificationId");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Validate OTP using Message Central
    try {
      await messageCentral.validateOTP(user.verificationId, req.body.otp);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Invalid OTP' });
    }

    // Clear OTP fields
    user.password = password;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.verificationId = undefined;

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Password reset successful. You can now login with your new password." 
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    next(error);
  }
};



/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token is required' 
      });
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired refresh token' 
      });
    }

    // Generate new tokens
    const tokens = generateTokens(decoded.id);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */

const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    console.log('🔍 Fetching profile for user:', req.user.id);

    const user = await User.findById(req.user.id)
      .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'title thumbnail category'
      })
      .populate({
        path: 'completedLessons.lessonId',
        select: 'title'
      })
      .populate('certificates')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ Profile data found:', {
      id: user._id,
      email: user.email,
      enrolledCoursesCount: user.enrolledCourses?.length || 0,
      completedLessonsCount: user.completedLessons?.length || 0
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        enrolledCourses: user.enrolledCourses || [],
        completedLessons: user.completedLessons || [],
        certificates: user.certificates || [],
      },
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    next(error);
  }
};

/**
 * @desc    Complete Google user profile (phone + password)
 * @route   POST /api/auth/complete-google-profile
 * @access  Private (only for Google OAuth users)
 */
const completeGoogleProfile = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId).select('+password +googleId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Only allow for Google users
    if (!user.googleId) {
      return res.status(400).json({
        success: false,
        message: 'This endpoint is only for Google signup users'
      });
    }

    // Check if profile already complete
    if (user.phone && user.password) {
      return res.status(400).json({
        success: false,
        message: 'Profile already complete'
      });
    }

    // Validate phone number
    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10 digits'
      });
    }

    // Check if phone number is already in use
    const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered to another account'
      });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Update user with phone and password
    user.phone = phone;
    user.password = password; // Will be hashed by pre-save hook
    user.isVerified = false; // Need to verify phone via OTP

    // Send OTP for phone verification
    let otpSent = true;
    let otpError = null;

    try {
      const mcResponse = await messageCentral.sendWhatsAppOTP(phone);
      if (mcResponse.success) {
        user.verificationId = mcResponse.verificationId;
      }
    } catch (err) {
      console.error('❌ Failed to send WhatsApp OTP for Google profile completion:', err.message);
      otpSent = false;
      otpError = err.message;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: otpSent
        ? 'Profile updated. Please verify your phone with the OTP sent on WhatsApp.'
        : `Profile updated, but WhatsApp OTP failed: ${otpError}. Please try resending OTP.`,
      data: {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        otpSent,
        needsPhoneVerification: true
      }
    });

  } catch (error) {
    console.error('❌ Complete Google Profile Error:', error);
    next(error);
  }
};

export {
  signup,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
  getProfile,
  completeGoogleProfile,
};
