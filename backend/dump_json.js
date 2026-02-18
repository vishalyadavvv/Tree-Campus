import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const dump = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const courses = await Course.find({});
    console.log(`COUNT: ${courses.length}`);
    courses.forEach(c => console.log(`- ${c.title} (isPublished: ${c.isPublished})`));
    await mongoose.disconnect();
};

dump();
