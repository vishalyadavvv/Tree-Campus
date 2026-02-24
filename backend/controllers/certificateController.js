import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Enrollment from '../models/Enrollment.js';

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

// @desc    Save certificate from mobile app
// @route   POST /api/certificates/save-from-mobile
// @access  Private
export const saveCertificateFromMobile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      assignmentId,
      courseId,
      score,
      courseTitle,
      userName,
      certificateUrl
    } = req.body;

    console.log('📱 Saving certificate from mobile...');
    console.log('User:', userId);
    console.log('Course:', courseId);
    console.log('Score:', score);

    // ═══════════════════════════════════════════════════════════════
    // 1️⃣ CREATE CERTIFICATE IN MONGODB
    // ═══════════════════════════════════════════════════════════════
    const certificate = await Certificate.create({
      userId: userId,
      courseId: courseId,
      assignmentId: assignmentId,
      type: 'assignment',
      score: score,
      courseTitle: courseTitle,
      userName: userName,
      certificateUrl: certificateUrl || `/certificates/${courseId}`,
      platform: 'mobile',  // Track which platform issued it
      createdAt: new Date(),
      issuedAt: new Date()
    });

    console.log('✅ Certificate created:', certificate._id);

    // ═══════════════════════════════════════════════════════════════
    // 2️⃣ UPDATE USER - ADD CERTIFICATE TO ARRAY
    // ═══════════════════════════════════════════════════════════════
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { certificates: certificate._id },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    console.log('✅ User updated with certificate');

    // ═══════════════════════════════════════════════════════════════
    // 3️⃣ UPDATE PROGRESS - MARK CERTIFICATE ISSUED
    // ═══════════════════════════════════════════════════════════════
    await Progress.findOneAndUpdate(
      { user: userId, course: courseId },
      {
        $set: {
          certificateIssued: true,
          certificateUrl: `/certificates/${certificate._id}`,
          completedAt: new Date(),
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    console.log('✅ Progress updated');

    // ═══════════════════════════════════════════════════════════════
    // 4️⃣ UPDATE ENROLLMENT - MARK COMPLETED
    // ═══════════════════════════════════════════════════════════════
    await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          certificateId: certificate._id,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    console.log('✅ Enrollment updated');

    // ═══════════════════════════════════════════════════════════════
    // 5️⃣ UPDATE USER.enrolledCourses
    // ═══════════════════════════════════════════════════════════════
    await User.updateOne(
      { _id: userId, 'enrolledCourses.courseId': courseId },
      {
        $set: { 'enrolledCourses.$.completedAt': new Date() }
      }
    );

    console.log('✅ User enrolledCourses updated');

    // ═══════════════════════════════════════════════════════════════
    // 6️⃣ SEND RESPONSE
    // ═══════════════════════════════════════════════════════════════
    res.status(201).json({
      success: true,
      message: 'Certificate saved successfully',
      data: {
        certificate: {
          _id: certificate._id,
          courseTitle: certificate.courseTitle,
          userName: certificate.userName,
          score: certificate.score,
          certificateUrl: certificate.certificateUrl,
          createdAt: certificate.createdAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Error saving certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving certificate',
      error: error.message
    });
  }
};
