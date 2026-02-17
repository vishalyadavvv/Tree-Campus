import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Blog from '../models/Blog.js';
import LiveClass from '../models/LiveClass.js';

const checkCounts = async () => {
    try {
        console.log('Connecting to DB...');
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is missing in env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB successfully');

        const allUsers = await User.countDocuments();
        const students = await User.countDocuments({ role: 'student' });
        const admins = await User.countDocuments({ role: 'admin' });
        
        // Check for other roles (legacy or incorrect data)
        const others = await User.countDocuments({ role: { $nin: ['student', 'admin'] } });
        const distinctRoles = await User.distinct('role');

        const allCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        
        const allBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });

        const allLiveClasses = await LiveClass.countDocuments();
        
        const totalEnrollments = await User.aggregate([
            { $project: { count: { $size: { $ifNull: ["$enrolledCourses", []] } } } },
            { $group: { _id: null, total: { $sum: "$count" } } }
        ]);

        console.log('\n--- REAL DB CONTENT ---');
        console.log(`Users (Total): ${allUsers}`);
        console.log(`   - Students: ${students}`);
        console.log(`   - Admins: ${admins}`);
        console.log(`   - Others/Unknown: ${others}`);
        console.log(`   - Unique Roles found: ${distinctRoles.join(', ')}`);
        
        console.log(`\nCourses (Total): ${allCourses}`);
        console.log(`   - Published: ${publishedCourses}`);
        console.log(`   - Drafts: ${allCourses - publishedCourses}`);

        console.log(`\nBlogs (Total): ${allBlogs}`);
        console.log(`   - Published: ${publishedBlogs}`);

        console.log(`\nLiveClasses: ${allLiveClasses}`);
        console.log(`Total Enrollments: ${totalEnrollments[0]?.total || 0}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCounts();
