import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Enrollment from '../models/Enrollment.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';

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
      assignmentId: providedAssignmentId,
      courseId: providedCourseId,
      seriesKey,
      score,
      courseTitle,
      userName,
      certificateUrl
    } = req.body;

    // Fetch user once at the start so it's available in all code paths
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('📱 Processing sync request from mobile...');
    console.log('User:', userId);
    console.log('Identifier:', seriesKey ? `Series: ${seriesKey}` : `Course: ${providedCourseId}`);

    // ═══════════════════════════════════════════════════════════════
    // 1️⃣ RESOLVE COURSE AND ASSIGNMENT
    // ═══════════════════════════════════════════════════════════════
    let courseId = providedCourseId;
    let assignmentId = providedAssignmentId;

    // 1. If seriesKey is provided, find the FIRST incomplete part the user is enrolled in
    if (seriesKey) {
      const seriesCourses = await Course.find({ seriesKey }).sort({ seriesOrder: 1 });
      
      if (seriesCourses.length === 0) {
        return res.status(404).json({ success: false, message: `Series ${seriesKey} not found` });
      }
      
      const enrolledCourseIds = user.enrolledCourses.map(e => e.courseId.toString());

      // Find the first course in the series that isn't completed yet
      const currentPart = seriesCourses.find(c => {
        const isEnrolled = enrolledCourseIds.includes(c._id.toString());
        const enrollment = user.enrolledCourses.find(e => e.courseId.toString() === c._id.toString());
        return isEnrolled && !enrollment.completedAt;
      });

      if (!currentPart) {
        // If all enrolled parts are done, or user isn't enrolled in anything yet
        // Default to the first part or return error if they already finished all
        const allCompleted = seriesCourses.every(c => {
          const enrollment = user.enrolledCourses.find(e => e.courseId.toString() === c._id.toString());
          return enrollment && enrollment.completedAt;
        });

        if (allCompleted) {
          console.log('ℹ️ User has already completed all enrolled parts of this series.');
          // Find the final part's certificate to return it
          const finalCourseId = seriesCourses[seriesCourses.length - 1]._id;
          const cert = await Certificate.findOne({ userId, courseId: finalCourseId });
          if (cert) {
            return res.status(200).json({ success: true, message: 'Series already fully completed', data: { certificate: cert } });
          }
        }

        // Default to the first enrolled part if we can't determine current
        courseId = seriesCourses.find(c => enrolledCourseIds.includes(c._id.toString()))?._id || seriesCourses[0]._id;
      } else {
        courseId = currentPart._id;
      }
      
      console.log(`ℹ️ Auto-identified current part in series: ${courseId}`);
    } 
    // 2. If no courseId but courseTitle is provided, find by Title
    else if (!courseId && courseTitle) {
      const foundCourse = await Course.findOne({ 
        $or: [
          { title: { $regex: new RegExp(`^${courseTitle}$`, 'i') } },
          { certificateTitle: { $regex: new RegExp(`^${courseTitle}$`, 'i') } }
        ]
      });
      if (foundCourse) {
        courseId = foundCourse._id;
        console.log(`ℹ️ Resolved courseId from title: ${courseId}`);
      }
    }

    // Find the course details if courseId was resolved
    let course = null;
    if (courseId) {
      course = await Course.findById(courseId);
      if (!course) {
        console.log('⚠️ Resolved courseId but course not found in DB');
        courseId = null; // Revert if not actually found
      }
    }

    // Find specific assignment for this course if course exists and assignmentId not provided
    if (courseId && !assignmentId) {
      const assignment = await Assignment.findOne({ courseId });
      assignmentId = assignment?._id;
    }

    // ═══════════════════════════════════════════════════════════════
    // 2️⃣ CHECK FOR EXISTING CERTIFICATE (PREVENT DUPLICATES)
    // ═══════════════════════════════════════════════════════════════
    const existingCertificate = await Certificate.findOne({ userId, courseId });
    if (existingCertificate) {
      console.log('ℹ️ Certificate already exists, returning existing.');
      return res.status(200).json({
        success: true,
        message: 'Certificate already exists',
        data: { certificate: existingCertificate }
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 3️⃣ SYNC ASSIGNMENT SUBMISSION (FOR WEBSITE PROGRESS)
    // ═══════════════════════════════════════════════════════════════
    let submission = null;
    if (assignmentId) {
      // Find or create a submission record to "trick" the website logic
      submission = await AssignmentSubmission.findOneAndUpdate(
        { userId, assignmentId },
        {
          $set: {
            courseId,
            totalScore: score || 100,
            percentageScore: score || 100,
            passed: true,
            status: 'submitted',
            submittedAt: new Date()
          }
        },
        { upsert: true, new: true }
      );
      console.log('✅ AssignmentSubmission synced');
    }

    // ═══════════════════════════════════════════════════════════════
    // 4️⃣ APPLY SINGLE CERTIFICATE RULE (SERIES LOGIC)
    // ═══════════════════════════════════════════════════════════════
    let certificate = null;
    let isFinalPart = true;

    if (course && course.seriesKey) {
      const higherOrderCourse = await Course.findOne({
        seriesKey: course.seriesKey,
        seriesOrder: { $gt: course.seriesOrder || 0 }
      });
      if (higherOrderCourse) {
        isFinalPart = false;
        console.log(`ℹ️ Part ${course.seriesOrder} completed, but skipping certificate (not final part).`);
      }
    }

    if (isFinalPart) {
      certificate = await Certificate.create({
        userId: userId,
        courseId: courseId, // Can be null now
        assignmentId: assignmentId, // Can be null now
        type: 'assignment',
        score: score,
        courseTitle: course ? (course.certificateTitle || course.title) : courseTitle,
        userName: userName || user.name, // Use user.name from DB if not provided
        certificateUrl: certificateUrl || (courseId ? `/certificates/${courseId}` : ''),
        platform: 'mobile',
        issuedAt: new Date()
      });

      // Link certificate to submission if available
      if (submission) {
        await AssignmentSubmission.findByIdAndUpdate(submission._id, {
          certificateId: certificate._id
        });
      }

      // Add certificate to user
      await User.findByIdAndUpdate(userId, {
        $push: { certificates: certificate._id }
      });
      console.log('✅ Certificate created and linked');
    }


    // ═══════════════════════════════════════════════════════════════
    // 5️⃣ UPDATE PROGRESS & ENROLLMENT (SYNC ONLY IF COURSE EXISTS)
    // ═══════════════════════════════════════════════════════════════
    if (courseId) {
      const enrolledCourseIds = user.enrolledCourses.map(e => e.courseId.toString());
      const coursesToUpdate = [courseId];
      
      // If it's a series and we are at the final part, check other parts
      if (course && course.seriesKey && isFinalPart) {
        const seriesCourses = await Course.find({ seriesKey: course.seriesKey });
        seriesCourses.forEach(c => {
          const cidStr = c._id.toString();
          if (cidStr !== courseId.toString() && enrolledCourseIds.includes(cidStr)) {
            coursesToUpdate.push(c._id);
          }
        });
        console.log(`ℹ️ Syncing progress for ${coursesToUpdate.length} enrolled courses in series ${course.seriesKey}`);
      }

      await Promise.all(coursesToUpdate.map(cid => (async () => {
        const cidStr = cid.toString();
        
        // Update Progress only if already enrolled/exists
        await Progress.findOneAndUpdate(
          { user: userId, course: cid },
          {
            $set: {
              certificateIssued: cidStr === courseId.toString() ? isFinalPart : false,
              certificateUrl: (cidStr === courseId.toString() && certificate) ? `/certificates/${certificate._id}` : '',
              completedAt: new Date(),
              overallProgress: 100
            }
          },
          { upsert: false } // ❌ DO NOT AUTO-CREATE PROGRESS
        );

        // Update Enrollment only if already exists
        await Enrollment.findOneAndUpdate(
          { user: userId, course: cid },
          {
            $set: {
              status: 'completed',
              completedAt: new Date(),
              certificateId: cidStr === courseId.toString() ? certificate?._id : undefined
            }
          },
          { upsert: false } // ❌ DO NOT AUTO-CREATE ENROLLMENT
        );

        // Update User enrolledCourses array only for existing
        await User.updateOne(
          { _id: userId, 'enrolledCourses.courseId': cid },
          { $set: { 'enrolledCourses.$.completedAt': new Date() } }
        );
      })()));

      console.log('✅ All related courses in series marked as completed');
    }

    res.status(201).json({
      success: true,
      message: isFinalPart ? 'Series completed! Certificate issued.' : 'Part completed! Progress saved.',
      data: {
        certificate: certificate ? {
          _id: certificate._id,
          courseTitle: certificate.courseTitle,
          score: certificate.score,
          certificateUrl: certificate.certificateUrl
        } : null,
        isFinalPart
      }
    });

  } catch (error) {
    console.error('❌ Sync Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing mobile progress',
      error: error.message
    });
  }
};
