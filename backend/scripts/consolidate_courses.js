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

const consolidate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const allCourses = await Course.find();
        const groups = {};

        allCourses.forEach(c => {
            const normalizedTitle = c.title.trim().replace(/\s+/g, ' ');
            if (!groups[normalizedTitle]) groups[normalizedTitle] = [];
            groups[normalizedTitle].push(c);
        });

        for (const [title, courses] of Object.entries(groups)) {
            if (courses.length > 1) {
                console.log(`\nConsolidating duplicate course: "${title}"`);
                
                // Find the best one (the one with most lessons)
                let bestCourse = courses[0];
                let maxLessons = -1;

                for (const c of courses) {
                    const lc = await Lesson.countDocuments({ courseId: c._id });
                    console.log(`- ID: ${c._id} | Lessons: ${lc}`);
                    if (lc > maxLessons) {
                        maxLessons = lc;
                        bestCourse = c;
                    }
                }

                console.log(`Winning ID: ${bestCourse._id}`);

                for (const c of courses) {
                    if (String(c._id) === String(bestCourse._id)) continue;

                    console.log(`Moving items from ${c._id} to ${bestCourse._id}...`);
                    
                    // Move sections
                    await Section.updateMany({ courseId: c._id }, { courseId: bestCourse._id });
                    
                    // Move lessons
                    await Lesson.updateMany({ courseId: c._id }, { courseId: bestCourse._id });

                    // Delete redundant course
                    await Course.findByIdAndDelete(c._id);
                }
            }
        }

        // Final counts update
        const finalCourses = await Course.find();
        for (const c of finalCourses) {
            const lc = await Lesson.countDocuments({ courseId: c._id });
            const sc = await Section.countDocuments({ courseId: c._id });
            await Course.findByIdAndUpdate(c._id, { totalLessons: lc, totalSections: sc });
            console.log(`Updated stats for "${c.title}": ${sc} sections, ${lc} lessons`);
        }

        console.log('\nConsolidation Complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

consolidate();
