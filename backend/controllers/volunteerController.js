import { validationResult } from 'express-validator';
import Volunteer from '../models/Volunteer.js';

// @desc    Submit volunteer application
// @route   POST /api/volunteer
// @access  Public
export const createVolunteer = async (req, res, next) => {
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

    const { name, email, phone, address, motivation } = req.body;

    // Check if volunteer with this email already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: 'A volunteer application with this email already exists.'
      });
    }

    // Create new volunteer
    const volunteer = await Volunteer.create({
      name,
      email,
      phone,
      address,
      motivation
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully!',
      data: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        createdAt: volunteer.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all volunteer applications
// @route   GET /api/volunteers
// @access  Public (should be protected in production)
export const getAllVolunteers = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = status ? { status } : {};

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch volunteers with pagination
    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Volunteer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: volunteers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: volunteers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single volunteer by ID
// @route   GET /api/volunteer/:id
// @access  Public (should be protected in production)
export const getVolunteerById = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer application status
// @route   PATCH /api/volunteer/:id/status
// @access  Public (should be protected/admin only in production)
export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete volunteer application
// @route   DELETE /api/volunteer/:id
// @access  Public (should be protected/admin only in production)
export const deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer application deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
