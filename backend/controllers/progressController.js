import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';

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

    // 🔄 SYNC 1: Update Enrollment collection
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      enrollment.progress = newProgress;
      const alreadyInEnrollment = enrollment.completedLessons.some(
        id => id.toString() === lessonId.toString()
      );
      if (!alreadyInEnrollment) {
        enrollment.completedLessons.push(lessonId);
      }
      enrollment.lastAccessedAt = new Date();
      await enrollment.save();
      console.log(`✅ Enrollment updated for course ${courseId}`);
    }

    // 🔄 SYNC 2: Update User.enrolledCourses array (cache)
    await User.updateOne(
      { _id: userId, 'enrolledCourses.courseId': courseId },
      { 
        $set: { 
          'enrolledCourses.$.progress': newProgress,
          'enrolledCourses.$.lastAccessedAt': new Date()
        } 
      }
    );

    // 🔄 SYNC 3: Update User.completedLessons top-level array
    // Check if not already in user's global completed list
    const user = await User.findById(userId);
    if (user) {
      const isAlreadyInUserList = user.completedLessons.some(
        cl => cl.lessonId.toString() === lessonId.toString()
      );
      if (!isAlreadyInUserList) {
        user.completedLessons.push({ lessonId: lessonId, completedAt: new Date() });
        await user.save();
        console.log(`✅ User global completedLessons updated`);
      }
    }

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
    const completedSet = new Set(
      progressDoc.completedLessons.map(c => (c.lesson ? c.lesson.toString() : ''))
    );

    const lessonsWithStatus = allLessons.map(lesson => ({
      ...lesson.toObject(),
      isCompleted: completedSet.has(lesson._id.toString())
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
// @desc    Mark entire course as complete
// @route   POST /api/progress/course/:id/complete
// @access  Private
export const completeCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    console.log(`🏆 Marking course ${courseId} complete for user ${userId}`);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // 1. Update Progress model
    let progressDoc = await Progress.findOne({ user: userId, course: courseId });
    if (!progressDoc) {
      progressDoc = await Progress.create({ user: userId, course: courseId });
    }

    // Mark all lessons as complete (fetch all lesson IDs for this course)
    const lessons = await Lesson.find({ courseId }).select('_id');
    const allLessonIds = lessons.map(l => l._id);
    
    // Replace completedLessons with all lessons (or merge)
    const completedSet = new Set(progressDoc.completedLessons.map(cl => cl.lesson.toString()));
    allLessonIds.forEach(id => {
      if (!completedSet.has(id.toString())) {
        progressDoc.completedLessons.push({ lesson: id, completedAt: new Date() });
      }
    });

    progressDoc.overallProgress = 100;
    progressDoc.certificateIssued = true; // Auto-issue flag maybe?
    await progressDoc.save();

    // 2. Update Enrollment model
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      enrollment.progress = 100;
      // Sync completed lessons IDs
      const existingIds = new Set(enrollment.completedLessons.map(id => id.toString()));
      allLessonIds.forEach(id => {
        if (!existingIds.has(id.toString())) {
          enrollment.completedLessons.push(id);
        }
      });
      enrollment.completedAt = new Date();
      await enrollment.save();
    }

    // 3. Update User model cache and global list
    const user = await User.findById(userId);
    if (user) {
      // Update enrolledCourses cache
      const enrollmentEntry = user.enrolledCourses.find(ec => ec.courseId.toString() === courseId.toString());
      if (enrollmentEntry) {
        enrollmentEntry.progress = 100;
        enrollmentEntry.completedAt = new Date();
      }

      // Sync global completedLessons
      const userCompletedSet = new Set(user.completedLessons.map(cl => cl.lessonId.toString()));
      allLessonIds.forEach(id => {
        if (!userCompletedSet.has(id.toString())) {
          user.completedLessons.push({ lessonId: id, completedAt: new Date() });
        }
      });
      
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Course marked as complete',
      data: { progress: 100 }
    });
  } catch (error) {
    console.error('completeCourse error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
