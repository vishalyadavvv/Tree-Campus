import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const bengaliLessons = await Lesson.find({ title: /Bengali/i });
        console.log(`\n--- Bengali Lessons in DB (${bengaliLessons.length}) ---`);
        for (const l of bengaliLessons) {
            const course = await Course.findById(l.courseId);
            console.log(`- Lesson: "${l.title}" | Course: "${course ? course.title : 'NOT FOUND'}" (${l.courseId})`);
        }

        const allCourses = await Course.find();
        console.log(`\n--- All Courses in DB (${allCourses.length}) ---`);
        for (const c of allCourses) {
            const lc = await Lesson.countDocuments({ courseId: c._id });
            console.log(`- ${c._id}: "${c.title}" (${lc} lessons)`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

debug();
