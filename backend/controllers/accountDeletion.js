import { validationResult } from 'express-validator';
import crypto from 'crypto';
import AccountDeletion from '../models/AccountDeletion.js';
import { sendAccountDeletionConfirmation } from '../utils/sendEmail.js';

// @desc    Submit account deletion request
// @route   POST /api/account-deletion-request
// @access  Public
export const createDeletionRequest = async (req, res, next) => {
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

    const { name, email, phone, reason } = req.body;

    // Check if there's already a pending request for this email
    const existingRequest = await AccountDeletion.findOne({
      email,
      status: { $in: ['pending_verification', 'verified', 'processing'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'An account deletion request for this email is already in progress.'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create deletion request
    const deletionRequest = await AccountDeletion.create({
      name,
      email,
      phone,
      reason: reason || '',
      verificationToken,
      verificationTokenExpires,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    // Send confirmation emails in background (non-blocking)
    sendAccountDeletionConfirmation(email, name, {
      email,
      phone,
      reason: reason || 'Not specified'
    }).catch(error => {
      console.error('❌ Error sending account deletion confirmation email:', error.message);
    });

    res.status(201).json({
      success: true,
      message: 'Account deletion request submitted successfully.',
      data: {
        id: deletionRequest._id,
        email: deletionRequest.email,
        status: deletionRequest.status,
        createdAt: deletionRequest.createdAt
      },
      // Remove this in production - only for testing
      verificationLink: `${req.protocol}://${req.get('host')}/api/account-deletion-request/verify/${verificationToken}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify account deletion request
// @route   GET /api/account-deletion-request/verify/:token
// @access  Public
export const verifyDeletionRequest = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find request with valid token
    const deletionRequest = await AccountDeletion.findOne({
      verificationToken: token,
      status: 'pending_verification'
    }).select('+verificationToken +verificationTokenExpires');

    if (!deletionRequest) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired verification link.'
      });
    }

    // Check if token is expired
    if (deletionRequest.isVerificationTokenExpired()) {
      return res.status(400).json({
        success: false,
        message: 'Verification link has expired. Please submit a new request.'
      });
    }

    // Update request status
    deletionRequest.status = 'verified';
    deletionRequest.verifiedAt = new Date();
    deletionRequest.scheduledDeletionDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
    deletionRequest.verificationToken = undefined;
    deletionRequest.verificationTokenExpires = undefined;

    await deletionRequest.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Your account deletion will be processed within 90 days.',
      data: {
        email: deletionRequest.email,
        status: deletionRequest.status,
        scheduledDeletionDate: deletionRequest.scheduledDeletionDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all deletion requests (Admin)
// @route   GET /api/account-deletion-requests
// @access  Public (should be protected in production)
export const getAllDeletionRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = status ? { status } : {};

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch requests with pagination
    const requests = await AccountDeletion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await AccountDeletion.countDocuments(query);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single deletion request by ID
// @route   GET /api/account-deletion-request/:id
// @access  Public (should be protected in production)
export const getDeletionRequestById = async (req, res, next) => {
  try {
    const request = await AccountDeletion.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Deletion request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update deletion request status (Admin)
// @route   PATCH /api/account-deletion-request/:id/status
// @access  Public (should be protected/admin only in production)
export const updateDeletionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending_verification', 'verified', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const request = await AccountDeletion.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'completed' && { completedAt: new Date() })
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Deletion request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel deletion request
// @route   DELETE /api/account-deletion-request/:id
// @access  Public (should be protected in production)
export const cancelDeletionRequest = async (req, res, next) => {
  try {
    const request = await AccountDeletion.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Deletion request not found'
      });
    }

    // Only allow cancellation if not completed
    if (request.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed deletion request'
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Deletion request cancelled successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};
