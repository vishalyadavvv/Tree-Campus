import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all courses that don't have isPublished field
    const result = await Course.updateMany(
      { isPublished: { $exists: false } },
      { $set: { isPublished: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} courses with missing isPublished field.`);
    
    // Also, let's just make sure all courses have a boolean value
    const all = await Course.find({});
    console.log('Current course statuses:');
    all.forEach(c => console.log(`- ${c.title}: ${c.isPublished}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();
