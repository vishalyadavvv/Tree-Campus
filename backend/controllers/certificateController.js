import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// @desc    Get user certificates
// @route   GET /api/certificates
// @access  Private
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail instructor')
      .sort('-issuedAt');

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Private
export const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('courseId', 'title instructor');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if certificate belongs to user (unless admin)
    if (certificate.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this certificate'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all enrolled courses with certificate status
// @route   GET /api/certificates/status
// @access  Private
export const getCertificateStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.courseId')
      .populate('certificates');

    const coursesWithStatus = user.enrolledCourses.map(enrollment => {
      const hasCertificate = user.certificates.some(cert => 
        cert.courseId && cert.courseId.toString() === enrollment.courseId._id.toString()
      );

      return {
        course: enrollment.courseId,
        progress: enrollment.progress,
        hasCertificate,
        isLocked: !hasCertificate
      };
    });

    res.status(200).json({
      success: true,
      data: coursesWithStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
