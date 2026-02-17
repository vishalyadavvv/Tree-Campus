import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const courses = await Course.find({});
        const sections = await Section.countDocuments();
        const lessons = await Lesson.countDocuments();
        const users = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });

        console.log('--- Database Counts ---');
        console.log(`Courses: ${courses.length}`);
        console.log(`Sections: ${sections}`);
        console.log(`Lessons: ${lessons}`);
        console.log(`Users: ${users} (${adminUsers} admins)`);
        
        console.log('\n--- Course Details ---');
        for (const c of courses) {
            const sc = await Section.countDocuments({ courseId: c._id });
            const lc = await Lesson.countDocuments({ courseId: c._id });
            console.log(`- ${c.title} (${c.isPublished ? 'Published' : 'Draft'}): ${sc} sections, ${lc} lessons`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkCounts();
