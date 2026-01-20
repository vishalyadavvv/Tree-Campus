import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Progress from './models/Progress.js';
import Enrollment from './models/Enrollment.js';
import connectDB from './config/db.js';

const debugData = async () => {
  try {
    await connectDB();
    
    // IDs from user report
    const userId = "696a0580a0aed409b07f6dcc";
    const courseId = "6943c7f6bf660e5e0ae9e6c9";
    const lessonId = "6944e9407080cb6689046c92";
    
    console.log('--- DEBUG START ---');

    console.log(`Checking interactions for:`)
    console.log(`User: ${userId}`);
    console.log(`Course: ${courseId}`);
    
    // 1. Check Progress Doc
    const progressDoc = await Progress.findOne({ user: userId, course: courseId });
    console.log('\n--- Progress Collection ---');
    if (!progressDoc) {
      console.log('❌ No Progress document found!');
    } else {
      console.log(`Overall Progress: ${progressDoc.overallProgress}%`);
      console.log(`Completed Lessons Count: ${progressDoc.completedLessons.length}`);
      console.log('Raw Completed Lessons Array:');
      console.log(JSON.stringify(progressDoc.completedLessons, null, 2));
      
      const inArray = progressDoc.completedLessons.some(c => {
         if (c.lesson && c.lesson.toString() === lessonId) return true;
         if (c.toString() === lessonId) return true;
         if (c._id && c._id.toString() === lessonId) return true;
         return false;
      });
      console.log(`\nIs Lesson ${lessonId} present? ${inArray ? 'YES' : 'NO'}`);
    }

    // 2. Check Enrollment Doc
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    console.log('\n--- Enrollment Collection ---');
    if (!enrollment) {
      console.log('❌ No Enrollment document found!');
    } else {
      console.log(`Progress: ${enrollment.progress}%`);
      console.log(`Completed Lessons: ${JSON.stringify(enrollment.completedLessons)}`);
      const inEnrollment = enrollment.completedLessons.some(id => id.toString() === lessonId);
      console.log(`Is Lesson ${lessonId} present? ${inEnrollment ? 'YES' : 'NO'}`);
    }

    // 3. Check User Doc
    const user = await User.findById(userId);
    console.log('\n--- User Collection ---');
    if (!user) {
      console.log('❌ User not found!');
    } else {
      console.log('Global Completed Lessons:');
      console.log(JSON.stringify(user.completedLessons, null, 2));
      const inUser = user.completedLessons.some(cl => cl.lessonId.toString() === lessonId);
      console.log(`Is Lesson ${lessonId} present? ${inUser ? 'YES' : 'NO'}`);
    }

    console.log('\n--- DEBUG END ---');
    process.exit();

  } catch (err) {
    console.error('Error running debug script:', err);
    process.exit(1);
  }
};

debugData();
