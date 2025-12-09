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

    console.log(`✅ Marking lesson ${lessonId} complete for user ${userId}`);

    // Validate IDs
    if (!userId || !lessonId) {
      console.error('❌ Invalid userId or lessonId');
      return res.status(400).json({ success: false, message: 'Invalid user or lesson ID' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      console.error(`❌ Lesson not found: ${lessonId}`);
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const courseId = lesson.courseId;
    if (!courseId) {
      console.error(`❌ Course not found for lesson: ${lessonId}`);
      return res.status(400).json({ success: false, message: 'Lesson has no associated course' });
    }

    console.log(`📚 Lesson belongs to course: ${courseId}`);

    // Find or create Progress document
    let progressDoc = await Progress.findOne({ user: userId, course: courseId });
    if (!progressDoc) {
      console.log(`📝 Creating new progress document for user ${userId} in course ${courseId}`);
      progressDoc = await Progress.create({ 
        user: userId, 
        course: courseId, 
        completedLessons: [] 
      });
    }

    // Check if already completed
    const alreadyCompleted = progressDoc.completedLessons.some(
      (c) => c.lesson.toString() === lessonId.toString()
    );

    if (!alreadyCompleted) {
      progressDoc.completedLessons.push({ lesson: lessonId, completedAt: new Date() });
      progressDoc.lastAccessedAt = new Date();
      await progressDoc.save();
      console.log(`✅ Added lesson ${lessonId} to completed lessons`);
    } else {
      console.log(`⏭️  Lesson ${lessonId} already completed, skipping`);
    }

    // Recalculate progress (only count lessons in valid sections)
    const sections = await (await import('../models/Section.js')).default.find({ courseId });
    const sectionIds = sections.map(s => s._id);
    const totalLessons = await Lesson.countDocuments({ 
      courseId,
      sectionId: { $in: sectionIds }
    });
    const completedCount = progressDoc.completedLessons.length;
    const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    progressDoc.overallProgress = newProgress;
    await progressDoc.save();

    console.log(`📊 Progress updated: ${completedCount}/${totalLessons} = ${newProgress}%`);

    return res.status(200).json({
      success: true,
      message: 'Lesson marked as complete',
      data: {
        progress: newProgress,
        completedLessons: completedCount,
        totalLessons
      }
    });
  } catch (error) {
    console.error('❌ completeLesson error:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to mark lesson as complete'
    });
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

    // Ensure progress is up-to-date (recompute using Lessons in valid sections)
    const sections = await (await import('../models/Section.js')).default.find({ courseId });
    const sectionIds = sections.map(s => s._id);
    const totalLessons = await Lesson.countDocuments({ 
      courseId,
      sectionId: { $in: sectionIds }
    });
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
