import User from '../models/User.js';
import { generateTokens } from '../utils/generateToken.js';
import { verifyRefreshToken } from '../middleware/auth.js';
import * as messageCentral from '../utils/messageCentral.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mapPath = path.join(__dirname, '..', 'utils', 'phoneEmailMap.json');
const dupPath = path.join(__dirname, '..', 'utils', 'duplicatePhones.json');

let phoneEmailMap = {};
let duplicatePhones = [];

try {
    if (fs.existsSync(mapPath)) {
        phoneEmailMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    }
    if (fs.existsSync(dupPath)) {
        duplicatePhones = JSON.parse(fs.readFileSync(dupPath, 'utf8'));
    }
} catch (err) {
    console.error('❌ Failed to load phone mappings:', err.message);
}

// ─────────────────────────────────────────────
// Helper: is this a WP placeholder phone?
// ─────────────────────────────────────────────
const isPlaceholderPhone = (phone) => !phone || phone.startsWith('wp_');

// ─────────────────────────────────────────────
// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
// ─────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role?.toLowerCase() || 'student',
    });

    let otpSent = true;
    let otpError = null;

    user.generateOTP(); // Generates local OTP and logs it to terminal

    try {
      const mcResponse = await messageCentral.sendWhatsAppOTP(phone);
      if (mcResponse.success) {
        user.verificationId = mcResponse.verificationId;
      }
      await user.save();
    } catch (err) {
      console.error('❌ Failed to send WhatsApp OTP during signup:', err.message);
      otpSent = false;
      otpError = err.message;
    }

    res.status(201).json({
      success: true,
      message: otpSent
        ? 'User registered. Please verify your phone with the OTP sent on WhatsApp.'
        : `User registered, but WhatsApp OTP failed: ${otpError}. Please try resending OTP.`,
      data: { userId: user._id, email: user.email, name: user.name, phone: user.phone, otpSent },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry +verificationId');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'User already verified' });

    // Check expiry
    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Dual Verification Logic
    const isLocalValid = user.otp && user.otp === otp && user.otpExpiry > Date.now();
    
    if (isLocalValid) {
      console.log(`✅ [DEBUG] Local OTP verification successful for ${email}`);
    } else {
      console.log(`ℹ️ [DEBUG] Local OTP invalid or expired. Falling back to Message Central for ${email}`);
      try {
        await messageCentral.validateOTP(user.verificationId, otp);
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message || 'Invalid OTP' });
      }
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.verificationId = undefined;
    await user.save();

    const tokens = generateTokens(user._id);

    res.status(200).json({
      success: true,
      message: 'Phone verified successfully',
      data: {
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isVerified: user.isVerified },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// @desc    Login user (Hybrid: MongoDB → MySQL)
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find user in MongoDB
    let user = await User.findOne({ email })
      .select('+password')
      .populate({ path: 'enrolledCourses.courseId', select: 'title thumbnail category' })
      .populate({ path: 'completedLessons.lessonId', select: 'title' })
      .populate('certificates');

    let authenticatedUser = null;
    let loginSource = 'mongodb';

    // Step 2: Try MongoDB password
    if (user) {
      console.log(`🔍 Checking MongoDB password for ${email}...`);
      const isMatch = await user.comparePassword(password);
      if (isMatch) authenticatedUser = user;
    }

    // Step 4: Final result
    if (!authenticatedUser) {
      // ✅ Handle migrated user password expiry prompt
      // If the user exists in the DB but the password was incorrect, trigger the Expiry/OTP modal
      if (user) {
        return res.status(401).json({ 
          success: false, 
          errorCode: 'PASSWORD_EXPIRED',
          message: 'Your password has expired. Please change it or login with Phone OTP.' 
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    console.log(`✅ Login successful via [${loginSource}] for ${email}`);

    const tokens = generateTokens(authenticatedUser._id);
    const userRole = authenticatedUser.role?.toLowerCase() || 'student';

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: authenticatedUser._id,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          role: userRole,
          isVerified: authenticatedUser.isVerified,
          isWpMigrated: authenticatedUser.isWpMigrated || false,
          // ✅ Don't expose wp_ placeholder to frontend — send null instead
          phone: isPlaceholderPhone(authenticatedUser.phone) ? null : authenticatedUser.phone,
          createdAt: authenticatedUser.createdAt,
          profilePicture: authenticatedUser.profilePicture || '',
          enrolledCourses: authenticatedUser.enrolledCourses || [],
          completedLessons: authenticatedUser.completedLessons || [],
          certificates: authenticatedUser.certificates || [],
        },
        ...tokens,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Forgot password — Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    let user = null;

    // ✅ 1. Try direct lookup (email or phone)
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }
    if (!user && phone) {
      // ✅ NEW: Duplicate Phone Check for Forgot Password
      if (duplicatePhones.includes(phone) && !email) {
        return res.status(409).json({
          success: false,
          errorCode: 'MULTIPLE_ACCOUNTS',
          message: 'This phone number is registered to multiple accounts. Please provide your Email Address above to identify your account.'
        });
      }
      user = await User.findOne({ phone });
    }

    // ✅ 2. Check CSV Phone-Email Map (for users not yet linked)
    if (!user && phone && phoneEmailMap[phone]) {
      const emailFromMap = phoneEmailMap[phone];
      console.log(`🔗 ForgotPwd: Phone ${phone} mapped to email ${emailFromMap} via CSV.`);
      user = await User.findOne({ email: emailFromMap });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: `No account found. Please check your ${phone ? 'phone number' : 'email'} or try logging in with your email first.`,
      });
    }

    // ✅ 3. Determine which phone to send OTP to
    let targetPhone = user.phone;

    // If user's DB phone is placeholder or missing, use the provided phone
    if (!targetPhone || isPlaceholderPhone(targetPhone)) {
      if (phone) {
        targetPhone = phone;
        console.log(`🔗 ForgotPwd: Using provided phone ${phone} for user ${user.email}`);
      } else {
        return res.status(400).json({
          success: false,
          errorCode: 'MIGRATED_USER_PHONE_REQUIRED',
          message: 'Please provide your registered phone number to receive a WhatsApp OTP.',
        });
      }
    }
    
    try {
      const mcResponse = await messageCentral.sendWhatsAppOTP(targetPhone);
      if (mcResponse.success) {
        user.verificationId = mcResponse.verificationId;
        await user.save();
      }
    } catch (err) {
      console.error('❌ Failed to send OTP for password reset:', err.message);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to send OTP. Please check your phone number.',
      });
    }

    res.status(200).json({ success: true, message: 'OTP sent to your WhatsApp successfully' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
// ─────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { email, phone, otp, password } = req.body;

    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select('+otp +otpExpiry +password +verificationId');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // ✅ FIX 3: Check expiry first
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    try {
      await messageCentral.validateOTP(user.verificationId, otp);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Invalid OTP' });
    }

    user.password = password; // pre-save hook will hash this
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.verificationId = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now login.' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
// ─────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const tokens = generateTokens(decoded.id);
    res.status(200).json({ success: true, message: 'Token refreshed successfully', data: tokens });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
// ─────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
      .populate({ path: 'enrolledCourses.courseId', select: 'title thumbnail category' })
      .populate({ path: 'completedLessons.lessonId', select: 'title' })
      .populate('certificates')
      .lean();

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // ✅ Don't expose wp_ placeholder to frontend
        phone: isPlaceholderPhone(user.phone) ? null : user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isWpMigrated: user.isWpMigrated || false,
        profilePicture: user.profilePicture || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        enrolledCourses: user.enrolledCourses || [],
        completedLessons: user.completedLessons || [],
        certificates: user.certificates || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Complete Google user profile (phone + password)
// @route   POST /api/auth/complete-google-profile
// @access  Private
// ─────────────────────────────────────────────
const completeGoogleProfile = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).select('+password +googleId');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.googleId) {
      return res.status(400).json({ success: false, message: 'This endpoint is only for Google signup users' });
    }

    if (user.phone && !isPlaceholderPhone(user.phone) && user.password) {
      return res.status(400).json({ success: false, message: 'Profile already complete' });
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone number must be 10 digits' });
    }

    const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered to another account' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    user.phone = phone;
    user.password = password;
    user.isVerified = false;

    let otpSent = true;
    let otpError = null;

    try {
      const mcResponse = await messageCentral.sendWhatsAppOTP(phone);
      if (mcResponse.success) user.verificationId = mcResponse.verificationId;
    } catch (err) {
      otpSent = false;
      otpError = err.message;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: otpSent
        ? 'Profile updated. Please verify your phone with the OTP sent on WhatsApp.'
        : `Profile updated, but WhatsApp OTP failed: ${otpError}. Please try resending OTP.`,
      data: { userId: user._id, email: user.email, phone: user.phone, otpSent, needsPhoneVerification: true },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Request Login OTP
// @route   POST /api/auth/request-login-otp
// @access  Public
// ─────────────────────────────────────────────
const requestLoginOTP = async (req, res, next) => {
  try {
    const { phone, email } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone number must be 10 digits' });
    }

    let user = await User.findOne({ phone }).select('+password');

    // ✅ NEW: Duplicate Check
    if (duplicatePhones.includes(phone)) {
      if (!email) {
        console.log(`⚠️ Duplicate phone detected: ${phone}. Prompting for email.`);
        return res.status(409).json({
          success: false,
          errorCode: 'MULTIPLE_ACCOUNTS',
          message: 'This phone number is associated with multiple accounts. Please enter your email address to identify your account.'
        });
      }

      // Email was provided! Find the correct user and check if they already have a secure password
      const correctUser = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (correctUser) {
        const hasValidPassword = correctUser.password && (correctUser.password.startsWith('$2a$') || correctUser.password.startsWith('$2b$'));
        if (hasValidPassword) {
          return res.status(403).json({
            success: false,
            message: 'This phone number is registered to multiple accounts. For security, please switch to Email Login and use your Password.'
          });
        }
        user = correctUser;
      } else {
        return res.status(404).json({
          success: false,
          errorCode: 'USER_NOT_FOUND',
          message: 'No account found with this email address.'
        });
      }
    } else {
      // ✅ NORMAL SAFETY: If phone found in DB BUT email was also provided,
      // check if the email matches. If NOT, the REAL owner is someone else.
      if (user && email && user.email !== email.toLowerCase()) {
        console.log(`⚠️ Phone ${phone} belongs to ${user.email}, but ${email} is trying to claim it.`);
        const correctUser = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (correctUser) {
          user = correctUser; // Switch to the correct user
          console.log(`🎯 Switched to correct user: ${correctUser.email}`);
        } else {
          return res.status(404).json({
            success: false,
            errorCode: 'USER_NOT_FOUND',
            message: 'No account found with this email address.'
          });
        }
      }
    }
    
    // ✅ 1. Check CSV Phone-Email Map
    if (!user && phoneEmailMap[phone]) {
      const emailFromMap = phoneEmailMap[phone];
      console.log(`🔗 Phone ${phone} mapped to email ${emailFromMap}. Searching...`);
      user = await User.findOne({ email: emailFromMap });
      
      if (user && !user.phone) {
          user.phone = phone;
          await user.save();
          console.log(`✅ Auto-linked phone ${phone} to user ${user.email}`);
      }
    }

    // ✅ 2. Smart Linking Fallback (If email provided by user)
    if (!user && email) {
      console.log(`🔍 Phone ${phone} not found. Checking provided email: ${email}`);
      user = await User.findOne({ email: email.toLowerCase() });
      
      if (user) {
        console.log(`🎯 Smart Linking: Email ${email} found. Sending OTP to ${phone}.`);
      }
    }

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        errorCode: 'USER_NOT_FOUND',
        message: 'No account found with this phone number. Is this your first time using this phone?' 
      });
    }

    try {
      user.generateOTP(); 

      // Send OTP to the PROVIDED phone (even if it's not saved yet)
      const mcResponse = await messageCentral.sendWhatsAppOTP(phone);
      if (mcResponse.success) {
        user.verificationId = mcResponse.verificationId;
      }
      await user.save();
    } catch (err) {
      console.error('❌ Failed to send login OTP:', err.message);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to send OTP. Please try again.',
      });
    }

    res.status(200).json({ success: true, message: 'OTP sent to your WhatsApp successfully' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Login with OTP
// @route   POST /api/auth/login-with-otp
// @access  Public
// ─────────────────────────────────────────────
const loginWithOTP = async (req, res, next) => {
  try {
    const { phone, otp, email, newPassword } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    let user = null;

    // ✅ PRIORITY: If email was provided (Smart Linking / Duplicate flow), use email FIRST
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() })
        .select('+verificationId +otp +otpExpiry')
        .populate({ path: 'enrolledCourses.courseId', select: 'title thumbnail category' })
        .populate({ path: 'completedLessons.lessonId', select: 'title' })
        .populate('certificates');
    }

    // ✅ If no email provided, try phone directly
    if (!user) {
      user = await User.findOne({ phone })
        .select('+verificationId +otp +otpExpiry')
        .populate({ path: 'enrolledCourses.courseId', select: 'title thumbnail category' })
        .populate({ path: 'completedLessons.lessonId', select: 'title' })
        .populate('certificates');
    }

    // ✅ CSV Map fallback
    if (!user && phoneEmailMap[phone]) {
      const emailFromMap = phoneEmailMap[phone];
      user = await User.findOne({ email: emailFromMap })
        .select('+verificationId +otp +otpExpiry')
        .populate({ path: 'enrolledCourses.courseId', select: 'title thumbnail category' })
        .populate({ path: 'completedLessons.lessonId', select: 'title' })
        .populate('certificates');
    }

    // ✅ Save phone ONLY if it's not already taken by someone else
    if (user && !user.phone) {
      const phoneAlreadyTaken = await User.findOne({ phone });
      if (!phoneAlreadyTaken) {
        user.phone = phone;
        console.log(`🔗 Linked phone ${phone} to ${user.email}`);
      } else {
        console.log(`⚠️ Phone ${phone} already belongs to ${phoneAlreadyTaken.email}. NOT linking to ${user.email}.`);
      }
    }

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Dual Verification Logic
    const isLocalValid = user.otp && user.otp === otp && user.otpExpiry > Date.now();

    if (isLocalValid) {
      console.log(`✅ [DEBUG] Local OTP verification successful for ${phone}`);
    } else {
      console.log(`ℹ️ [DEBUG] Local OTP invalid or expired. Falling back to Message Central for ${phone}`);
      try {
        await messageCentral.validateOTP(user.verificationId, otp);
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message || 'Invalid OTP' });
      }
    }

    // ✅ NEW: Update Password if provided during Smart Linking
    if (newPassword && email) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = newPassword;
      console.log(`🔐 Updated password for ${user.email} during Smart Linking`);
    }

    // Mark as verified if they logged in via OTP
    if (!user.isVerified) {
      user.isVerified = true;
    }
    
    // Save any updates (phone, password, and/or verified status)
    await user.save();

    const tokens = generateTokens(user._id);
    const userRole = user.role?.toLowerCase() || 'student';

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: userRole,
          isVerified: user.isVerified,
          phone: user.phone,
          createdAt: user.createdAt,
          profilePicture: user.profilePicture || '',
          enrolledCourses: user.enrolledCourses || [],
          completedLessons: user.completedLessons || [],
          certificates: user.certificates || [],
        },
        ...tokens,
      },
    });
  } catch (error) {
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
  requestLoginOTP,
  loginWithOTP,
};