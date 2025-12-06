import { body, param, validationResult } from 'express-validator';

/**
 * Validation result handler
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const validateSignup = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

/**
 * Validation rules for login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Validation rules for OTP verification
 */
const validateOTP = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  validate,
];

/**
 * Validation rules for course creation
 */
const validateCourse = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category')
    .notEmpty().withMessage('Category is required'),
  validate,
];

/**
 * Validation rules for lesson creation
 */
const validateLesson = [
  body('title')
    .trim()
    .notEmpty().withMessage('Lesson title is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID'),
  validate,
];
/**
 * Validate volunteer application data
 */
 const validateVolunteerData = (data) => {
  const errors = {};
  const { name, email, phone, address, motivation } = data;

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  } else if (email.length > 255) {
    errors.email = 'Email must be less than 255 characters';
  }

  // Phone validation
  const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
  if (!phone || phone.trim().length === 0) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  } else if (phone.length > 20) {
    errors.phone = 'Phone number must be less than 20 characters';
  }

  // Address validation
  if (!address || address.trim().length === 0) {
    errors.address = 'Address is required';
  } else if (address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters long';
  } else if (address.trim().length > 500) {
    errors.address = 'Address must be less than 500 characters';
  }

  // Motivation validation
  if (!motivation || motivation.trim().length === 0) {
    errors.motivation = 'Motivation is required';
  } else if (motivation.trim().length < 50) {
    errors.motivation = 'Please provide more details (at least 50 characters)';
  } else if (motivation.trim().length > 2000) {
    errors.motivation = 'Motivation must be less than 2000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize input data
 */
 const sanitizeVolunteerData = (data) => {
  return {
    name: data.name?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    phone: data.phone?.trim() || '',
    address: data.address?.trim() || '',
    motivation: data.motivation?.trim() || ''
  };
};
/**
 * Validation rules for MongoDB ObjectId
 */
const validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  validate,
];

export {
  validate,
  validateSignup,
  validateLogin,
  validateOTP,
  validateCourse,
  validateLesson,
  validateObjectId,
  validateVolunteerData,
  sanitizeVolunteerData
};
