import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const listCourses = async () => {
    await connectDB();
    const courses = await Course.find({}, 'title _id');
    console.log("--- EXISTING MONGODB COURSES ---");
    courses.forEach(c => {
        console.log(`"${c.title}" : "${c._id}"`);
    });
    process.exit();
};

listCourses();
