import { validationResult } from 'express-validator';
import SchoolRegistration from '../models/schoolRegistration.js';


// @desc    Submit school registration
// @route   POST /api/registerSchool
// @access  Public
export const createSchoolRegistration = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const {
      schoolName,
      schoolEmail,
      schoolAddress,
      schoolPhone,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      termsAccepted,
      submittedAt,
      status
    } = req.body;

    // Check if school with this email already exists
    const existingSchool = await SchoolRegistration.findOne({ schoolEmail });
    if (existingSchool) {
      return res.status(400).json({
        success: false,
        message: 'A school registration with this email already exists.'
      });
    }

    // Create new school registration
    const schoolRegistration = await SchoolRegistration.create({
      schoolName,
      schoolEmail,
      schoolAddress,
      schoolPhone,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      termsAccepted,
      submittedAt: submittedAt || new Date(),
      status: status || 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'School registration submitted successfully!',
      data: {
        id: schoolRegistration._id,
        schoolName: schoolRegistration.schoolName,
        schoolEmail: schoolRegistration.schoolEmail,
        status: schoolRegistration.status,
        createdAt: schoolRegistration.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all school registrations
// @route   GET /api/registerSchool
// @access  Public (should be protected in production)
export const getAllSchoolRegistrations = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = status ? { status } : {};

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch school registrations with pagination
    const registrations = await SchoolRegistration.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await SchoolRegistration.countDocuments(query);

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single school registration by ID
// @route   GET /api/registerSchool/:id
// @access  Public (should be protected in production)
export const getSchoolRegistrationById = async (req, res, next) => {
  try {
    const registration = await SchoolRegistration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'School registration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update school registration status
// @route   PATCH /api/registerSchool/:id/status
// @access  Public (should be protected/admin only in production)
export const updateSchoolRegistrationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }

    const registration = await SchoolRegistration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'School registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete school registration
// @route   DELETE /api/registerSchool/:id
// @access  Public (should be protected/admin only in production)
export const deleteSchoolRegistration = async (req, res, next) => {
  try {
    const registration = await SchoolRegistration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'School registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'School registration deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
