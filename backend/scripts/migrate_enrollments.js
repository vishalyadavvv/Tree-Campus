
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const WP_DATA_DIR = path.join(__dirname, '../../Wordpress data');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const loadJSON = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return [];
    }
};

const migrateEnrollments = async () => {
    await connectDB();

    console.log('Loading WordPress data...');
    const rawUserItems = loadJSON(path.join(WP_DATA_DIR, 'wp_learnpress_user_items.json'));
    const wpUsersRaw = loadJSON(path.join(WP_DATA_DIR, 'wp_users.json'));
    const wpPostsRaw = loadJSON(path.join(WP_DATA_DIR, 'wp_posts.json'));

    // Extract actual data from phpmyadmin export format
    let userItems = rawUserItems;
    let wpUsers = wpUsersRaw;
    let wpPosts = wpPostsRaw;

    // Handle phpmyadmin nested "data" array format 
    if (rawUserItems.length > 0 && rawUserItems[rawUserItems.length - 1]?.data) {
        userItems = rawUserItems[rawUserItems.length - 1].data;
    } else {
        // Filter out header rows
        userItems = rawUserItems.filter(r => r.user_item_id);
    }

    if (wpUsersRaw.length > 0 && wpUsersRaw[wpUsersRaw.length - 1]?.data) {
        wpUsers = wpUsersRaw[wpUsersRaw.length - 1].data;
    } else {
        wpUsers = wpUsersRaw.filter(r => r.ID);
    }

    if (wpPostsRaw.length > 0 && wpPostsRaw[wpPostsRaw.length - 1]?.data) {
        wpPosts = wpPostsRaw[wpPostsRaw.length - 1].data;
    } else {
        wpPosts = wpPostsRaw.filter(r => r.ID);
    }

    console.log(`Loaded ${userItems.length} user items, ${wpUsers.length} WP users, ${wpPosts.length} WP posts.`);

    // 1. Build WP User ID -> Email Map
    const wpUserEmailMap = new Map();
    wpUsers.forEach(u => {
        if (u.user_email) {
            wpUserEmailMap.set(String(u.ID), u.user_email.toLowerCase());
        }
    });

    // 2. Build MongoDB User Email -> ID Map
    const allMongoUsers = await User.find({});
    const mongoUserEmailMap = new Map();
    allMongoUsers.forEach(u => {
        mongoUserEmailMap.set(u.email.toLowerCase(), u._id);
    });
    console.log(`Found ${allMongoUsers.length} MongoDB users.`);

    // 3. Build WP Course Title -> MongoDB Course Map
    // First get course titles from wp_posts
    const wpCourseMap = new Map(); // WP course ID -> title
    wpPosts.filter(p => p.post_type === 'lp_course').forEach(p => {
        wpCourseMap.set(String(p.ID), p.post_title);
    });

    // Map MongoDB courses by title
    const allMongoCourses = await Course.find({});
    const mongoCourseByTitle = new Map();
    allMongoCourses.forEach(c => {
        mongoCourseByTitle.set(c.title, c._id);
    });
    console.log(`Found ${allMongoCourses.length} MongoDB courses.`);

    // 4. Build WP Lesson Title -> MongoDB Lesson Map
    const wpLessonMap = new Map(); // WP lesson ID -> title
    wpPosts.filter(p => p.post_type === 'lp_lesson').forEach(p => {
        wpLessonMap.set(String(p.ID), p.post_title);
    });

    const allMongoLessons = await Lesson.find({});
    // Map: courseId+lessonTitle -> lessonId (for matching)
    const mongoLessonMap = new Map();
    allMongoLessons.forEach(l => {
        mongoLessonMap.set(`${l.courseId}_${l.title}`, l._id);
    });
    console.log(`Found ${allMongoLessons.length} MongoDB lessons.`);

    // 5. Process enrollments
    // Course enrollments in user_items have item_type === 'lp_course'
    const courseEnrollments = userItems.filter(ui => ui.item_type === 'lp_course');
    console.log(`Found ${courseEnrollments.length} course enrollments to process.`);

    // Lesson completions: item_type === 'lp_lesson' && status === 'completed'
    const lessonCompletions = userItems.filter(ui => 
        ui.item_type === 'lp_lesson' && ui.status === 'completed'
    );

    // Build: WP user_item_id (enrollment parent) -> completed lesson WP IDs
    // Each lesson item has parent_id pointing to the enrollment user_item_id
    const enrollmentLessonsMap = new Map(); // enrollment user_item_id -> [wp_lesson_ids]
    lessonCompletions.forEach(lc => {
        const parentId = String(lc.parent_id);
        if (!enrollmentLessonsMap.has(parentId)) {
            enrollmentLessonsMap.set(parentId, []);
        }
        enrollmentLessonsMap.get(parentId).push(String(lc.item_id));
    });

    let enrollmentsCreated = 0;
    let enrollmentsSkipped = 0;
    let enrollmentsUpdated = 0;

    for (const enrollment of courseEnrollments) {
        const wpUserId = String(enrollment.user_id);
        const wpCourseId = String(enrollment.item_id);
        const enrollmentItemId = String(enrollment.user_item_id);

        // Resolve MongoDB user
        const wpEmail = wpUserEmailMap.get(wpUserId);
        if (!wpEmail) {
            enrollmentsSkipped++;
            continue;
        }
        const mongoUserId = mongoUserEmailMap.get(wpEmail);
        if (!mongoUserId) {
            console.log(`  Skipped: WP user ${wpUserId} (${wpEmail}) not found in MongoDB.`);
            enrollmentsSkipped++;
            continue;
        }

        // Resolve MongoDB course
        const courseTitle = wpCourseMap.get(wpCourseId);
        if (!courseTitle) {
            enrollmentsSkipped++;
            continue;
        }
        const mongoCourseId = mongoCourseByTitle.get(courseTitle);
        if (!mongoCourseId) {
            console.log(`  Skipped: Course "${courseTitle}" not found in MongoDB.`);
            enrollmentsSkipped++;
            continue;
        }

        // Map status
        let status = 'active';
        if (enrollment.graduation === 'passed' || enrollment.status === 'finished') {
            status = 'completed';
        }

        // Resolve completed lessons
        const completedWpLessonIds = enrollmentLessonsMap.get(enrollmentItemId) || [];
        const completedMongoLessonIds = [];
        
        for (const wpLessonId of completedWpLessonIds) {
            const lessonTitle = wpLessonMap.get(wpLessonId);
            if (lessonTitle) {
                const mongoLessonId = mongoLessonMap.get(`${mongoCourseId}_${lessonTitle}`);
                if (mongoLessonId) {
                    completedMongoLessonIds.push(mongoLessonId);
                }
            }
        }

        // Calculate progress as percentage of completed lessons
        const totalLessonsInCourse = allMongoLessons.filter(
            l => l.courseId.toString() === mongoCourseId.toString()
        ).length;
        
        const progress = totalLessonsInCourse > 0 
            ? Math.round((completedMongoLessonIds.length / totalLessonsInCourse) * 100) 
            : 0;

        const enrolledAt = enrollment.start_time ? new Date(enrollment.start_time) : new Date();

        try {
            // Use findOneAndUpdate with upsert for idempotency
            const result = await Enrollment.findOneAndUpdate(
                { user: mongoUserId, course: mongoCourseId },
                {
                    $set: {
                        enrolledAt,
                        status,
                        progress: Math.min(progress, 100),
                        completedLessons: completedMongoLessonIds,
                        lastAccessedAt: enrollment.end_time ? new Date(enrollment.end_time) : enrolledAt
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            if (result.isNew === false) {
                enrollmentsUpdated++;
            } else {
                enrollmentsCreated++;
            }
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key - already handled by upsert, but just in case
                enrollmentsUpdated++;
            } else {
                console.error(`  Error creating enrollment for user ${wpEmail}, course "${courseTitle}":`, error.message);
                enrollmentsSkipped++;
            }
        }
    }

    console.log(`\nEnrollment Migration Summary:`);
    console.log(`  Created: ${enrollmentsCreated}`);
    console.log(`  Updated: ${enrollmentsUpdated}`);
    console.log(`  Skipped: ${enrollmentsSkipped}`);

    // Update course enrollment counts
    console.log('\nUpdating course enrollment counts...');
    for (const course of allMongoCourses) {
        const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
        if (enrollmentCount > 0) {
            await Course.findByIdAndUpdate(course._id, { 
                enrolledStudents: enrollmentCount 
            });
        }
    }

    console.log('Enrollment migration complete.');
    process.exit();
};

migrateEnrollments();
