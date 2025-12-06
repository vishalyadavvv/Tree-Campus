// controllers/progressController.js
import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js'; // <-- use the Progress model

// Helper: safely get ObjectId string
const toId = (v) => (v ? v.toString() : v);

// @desc    Mark lesson as complete
// @route   POST /api/progress/lesson/:id/complete
// @access  Private
export const completeLesson = async (req, res) => {
  try {
    const userId = req.user._id;
    const lessonId = req.params.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const courseId = lesson.courseId || lesson.course || lesson.courseId; // defensive

    // find or create Progress doc for this user+course
    let progressDoc = await Progress.findOne({ user: userId, course: courseId });
    if (!progressDoc) {
      progressDoc = await Progress.create({ user: userId, course: courseId, completedLessons: [] });
    }

    // Check if already marked completed in Progress doc (idempotent)
    const alreadyCompleted = progressDoc.completedLessons.some(
      (c) => toId(c.lesson) === toId(lessonId)
    );

    if (!alreadyCompleted) {
      progressDoc.completedLessons.push({ lesson: lessonId, completedAt: new Date() });
      // update lastAccessedAt
      progressDoc.lastAccessedAt = new Date();
      await progressDoc.save();
    }

    // Recalculate overallProgress using the schema method (which expects course populated lessons)
    // If method uses populate('lessons') it may rely on Course.lessons - but we'll also compute reliably:
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = progressDoc.completedLessons.length;
    const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Save computed overallProgress to progressDoc
    progressDoc.overallProgress = newProgress;
    await progressDoc.save();

    // Also keep User.enrolledCourses in sync if present (best-effort)
    const user = await User.findById(userId);
    if (user) {
      const enrollmentIndex = (user.enrolledCourses || []).findIndex(
        (en) => toId(en.courseId) === toId(courseId)
      );
      if (enrollmentIndex !== -1) {
        user.enrolledCourses[enrollmentIndex].progress = newProgress;
      } else {
        // If no enrollment exists, optionally add one (comment/uncomment based on your app logic)
        // user.enrolledCourses = user.enrolledCourses || [];
        // user.enrolledCourses.push({ courseId, progress: newProgress });
      }

      // Optionally keep a lightweight user.completedLessons array (if your app expects it)
      // Add only if you actually have that field and it's used elsewhere.
      if (Array.isArray(user.completedLessons)) {
        const userAlready = user.completedLessons.some(c => toId(c.lessonId || c.lesson) === toId(lessonId));
        if (!userAlready) {
          // try to match existing user schema shape (lessonId used in your original code)
          user.completedLessons.push({ lessonId, completedAt: new Date() });
        }
      }

      await user.save();
    }

    // Certificate generation when reaching 100%
    if (newProgress === 100) {
      // Check if a certificate already exists
      const existingCertificate = await Certificate.findOne({ userId, courseId });
      if (!existingCertificate) {
        const certificate = await Certificate.create({
          userId,
          courseId,
          completionPercentage: 100
        });

        // Try to link certificate id to user (if user has certificates array)
        if (user && Array.isArray(user.certificates)) {
          user.certificates.push(certificate._id);
          await user.save();
        }

        // mark certificateIssued in progressDoc
        progressDoc.certificateIssued = true;
        progressDoc.certificateUrl = certificate._id; // or certificate.url (update as needed)
        await progressDoc.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lesson marked as complete',
      data: {
        progress: newProgress,
        completedLessons: completedCount
      }
    });
  } catch (error) {
    console.error('completeLesson error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get course progress
// @route   GET /api/progress/course/:id
// @access  Private
export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    // Get or create progress doc
    let progressDoc = await Progress.findOne({ user: userId, course: courseId });
    if (!progressDoc) {
      progressDoc = await Progress.create({ user: userId, course: courseId });
    }

    // Ensure progress is up-to-date (recompute using Lessons)
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = progressDoc.completedLessons.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Optionally update and save progressDoc.overallProgress if different
    if (progressDoc.overallProgress !== progress) {
      progressDoc.overallProgress = progress;
      await progressDoc.save();
    }

    // Build lessonsWithStatus using lessons from DB (preserve sort/order)
    const allLessons = await Lesson.find({ courseId }).sort('order');
    const completedSet = new Set(progressDoc.completedLessons.map(c => toId(c.lesson)));

    const lessonsWithStatus = allLessons.map(lesson => ({
      ...lesson.toObject(),
      isCompleted: completedSet.has(toId(lesson._id))
    }));

    return res.status(200).json({
      success: true,
      data: {
        progress,
        totalLessons,
        completedLessons: completedCount,
        lessons: lessonsWithStatus
      }
    });
  } catch (error) {
    console.error('getCourseProgress error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
