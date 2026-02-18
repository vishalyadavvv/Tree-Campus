import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const dumpCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const allCourses = await Course.find({});
    console.log(`Total courses found: ${allCourses.length}`);
    
    allCourses.forEach(c => {
      console.log(`- ID: ${c._id}, Title: ${c.title}, isPublished: ${c.isPublished}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

dumpCourses();
