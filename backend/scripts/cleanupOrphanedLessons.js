import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupNullCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find({ role: 'student' });
    console.log(`📊 Checking ${users.length} students...`);

    let totalCleaned = 0;

    for (const user of users) {
      const originalCount = user.enrolledCourses.length;
      
      // Filter out null courseIds
      user.enrolledCourses = user.enrolledCourses.filter(enrollment => {
        if (!enrollment.courseId) {
          console.log(`⚠️  Null course found for user: ${user.email}`);
          return false;
        }
        return true;
      });

      if (user.enrolledCourses.length !== originalCount) {
        await user.save();
        totalCleaned++;
        console.log(`✅ Cleaned user: ${user.email} (removed ${originalCount - user.enrolledCourses.length} null courses)`);
      }
    }

    console.log('\n📊 Cleanup Summary:');
    console.log(`   Users cleaned: ${totalCleaned}`);
    console.log('✅ Cleanup completed!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanupNullCourses();