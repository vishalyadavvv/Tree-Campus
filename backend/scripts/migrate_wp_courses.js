
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Section from '../models/Section.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const WP_DATA_DIR = path.join(__dirname, '../../Wordpress data');

const wpPostsPath = path.join(WP_DATA_DIR, 'wp_posts.json');
const wpUsersPath = path.join(WP_DATA_DIR, 'wp_users.json');
const wpPostMetaPath = path.join(WP_DATA_DIR, 'wp_postmeta.json');
const wpUsermetaPath = path.join(WP_DATA_DIR, 'wp_usermeta.json');
const wpUserItemsPath = path.join(WP_DATA_DIR, 'wp_learnpress_user_items.json');
const wpUserItemResultsPath = path.join(WP_DATA_DIR, 'wp_learnpress_user_item_results.json');

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

// Extract actual data rows from PHPMyAdmin JSON export format
const extractData = (raw) => {
    if (!raw || raw.length === 0) return [];
    const lastEntry = raw[raw.length - 1];
    if (lastEntry && lastEntry.data && Array.isArray(lastEntry.data)) {
        return lastEntry.data;
    }
    return raw.filter(r => r.ID || r.post_id || r.meta_id || r.user_id || r.user_item_id);
};

const migrateCourses = async () => {
    await connectDB();

    console.log('Loading WordPress data...');
    const rawPosts = loadJSON(wpPostsPath);
    const rawUsers = loadJSON(wpUsersPath);
    const rawPostMeta = loadJSON(wpPostMetaPath);
    const rawUserItems = loadJSON(wpUserItemsPath);
    const rawUserMeta = loadJSON(wpUsermetaPath);
    const rawUserResults = loadJSON(wpUserItemResultsPath);

    const posts = extractData(rawPosts);
    const users = extractData(rawUsers);
    const postMeta = extractData(rawPostMeta);
    const userItems = extractData(rawUserItems);
    const userMeta = extractData(rawUserMeta);
    const userResults = extractData(rawUserResults);

    console.log(`Loaded ${posts.length} posts, ${users.length} users, ${postMeta.length} metadata.`);

    // 0. Build optimized Lookups
    console.log('Building metadata maps...');
    const postMetaMap = new Map();
    postMeta.forEach(m => {
        const pid = String(m.post_id);
        if (!postMetaMap.has(pid)) postMetaMap.set(pid, {});
        postMetaMap.get(pid)[m.meta_key] = m.meta_value;
    });

    const userMetaMap = new Map();
    userMeta.forEach(m => {
        const uid = String(m.user_id);
        if (!userMetaMap.has(uid)) userMetaMap.set(uid, {});
        userMetaMap.get(uid)[m.meta_key] = m.meta_value;
    });

    const userResultsMap = new Map();
    userResults.forEach(r => {
        const uiid = String(r.user_item_id);
        try {
            userResultsMap.set(uiid, typeof r.result === 'string' ? JSON.parse(r.result) : r.result);
        } catch (e) {
            userResultsMap.set(uiid, r.result);
        }
    });

    // 1. Map existing Authors/Admins for course ownership
    const userMap = new Map();
    const allMongoUsers = await User.find({});
    
    // Default fallback admin
    let defaultAdminId = null;
    const adminUser = allMongoUsers.find(u => u.role === 'admin');
    if (adminUser) {
        defaultAdminId = adminUser._id;
    } else if (allMongoUsers.length > 0) {
        defaultAdminId = allMongoUsers[0]._id;
    }

    // Map WP users to existing Mongo users by email
    const wpUserEmailMap = new Map();
    users.forEach(u => {
        if (u.user_email) wpUserEmailMap.set(String(u.ID), u.user_email.toLowerCase());
    });

    allMongoUsers.forEach(u => {
        // Try to find if any WP ID maps to this email
        for (const [wpId, email] of wpUserEmailMap.entries()) {
            if (email === u.email.toLowerCase()) {
                userMap.set(wpId, u._id);
            }
        }
    });

    // 2. Build Lesson -> Course Map
    const lessonToCourseMap = new Map();
    const itemToSectionOrderMap = new Map();

    userItems.forEach(ui => {
        if (ui.item_type === 'lp_lesson' && ui.ref_type === 'lp_course' && ui.ref_id) {
            lessonToCourseMap.set(String(ui.item_id), String(ui.ref_id));
        }
    });

    // 3. Migrate Courses and Sections (PRIORITY)
    console.log('--- Migrating Courses and Sections ---');
    const allowedStatuses = ['publish', 'draft', 'trash', 'inherit'];
    const wpCourses = posts.filter(p => p.post_type === 'lp_course' && allowedStatuses.includes(p.post_status));
    
    // Sort so "Spoken English Part 3" comes first
    wpCourses.sort((a, b) => {
        if (a.post_title.includes('Part 3')) return -1;
        if (b.post_title.includes('Part 3')) return 1;
        return 0;
    });

    const courseMap = new Map();

    for (const wpCourse of wpCourses) {
        console.log(`Processing course: ${wpCourse.post_title}`);
        const instructorId = userMap.get(String(wpCourse.post_author)) || defaultAdminId;
        const meta = postMetaMap.get(String(wpCourse.ID)) || {};
        
        let duration = meta._lp_duration || '0 hours';

        const courseData = {
            title: wpCourse.post_title,
            description: wpCourse.post_content || wpCourse.post_title,
            instructor: instructorId,
            category: 'Other', 
            level: 'All Levels',
            duration: duration,
            isPublished: wpCourse.post_status === 'publish',
            slug: wpCourse.post_name,
        };

        const normalizedTitle = wpCourse.post_title.trim().replace(/\s+/g, ' ');
        let course = await Course.findOne({ 
            $or: [{ title: wpCourse.post_title }, { title: normalizedTitle }]
        });
        
        if (course) {
            Object.assign(course, courseData);
            await course.save();
        } else {
            course = await Course.create(courseData);
        }
        courseMap.set(String(wpCourse.ID), course._id);

        // Parse curriculum
        let curriculum = null;
        try {
            if (meta._lp_info_extra_fast_query) {
                curriculum = JSON.parse(meta._lp_info_extra_fast_query);
            }
        } catch (e) {}

        const curriculumSections = curriculum?.sections || curriculum?.section || curriculum?.sections_items || [];
        if (curriculumSections.length > 0) {
            for (let i = 0; i < curriculumSections.length; i++) {
                const wpSection = curriculumSections[i];
                let section = await Section.findOne({ courseId: course._id, title: wpSection.title });
                if (!section) {
                    section = await Section.create({
                        courseId: course._id,
                        title: wpSection.title || `Section ${i+1}`,
                        order: i + 1
                    });
                }
                
                if (wpSection.items) {
                    wpSection.items.forEach((item, itemIdx) => {
                        itemToSectionOrderMap.set(String(item.id), {
                            mongoCourseId: course._id,
                            mongoSectionId: section._id,
                            order: itemIdx + 1
                        });
                        if (!lessonToCourseMap.has(String(item.id))) {
                            lessonToCourseMap.set(String(item.id), String(wpCourse.ID));
                        }
                    });
                }
            }
        }
    }

    // 4. Migrate Lessons and Quizzes (PRIORITY)
    console.log('--- Migrating Lessons and Quizzes ---');
    const wpLessonTypes = ['lp_lesson', 'lp_quiz'];
    const wpItems = posts.filter(p => wpLessonTypes.includes(p.post_type) && allowedStatuses.includes(p.post_status));
    
    let itemsCreated = 0;
    let itemsSkipped = 0;
    for (const wpItem of wpItems) {
        if (itemsCreated % 50 === 0) console.log(`Processing item ${itemsCreated + itemsSkipped}/${wpItems.length}: ${wpItem.post_title}...`);
        const mapping = itemToSectionOrderMap.get(String(wpItem.ID));
        let mongoCourseId, mongoSectionId, order;

        if (mapping) {
            mongoCourseId = mapping.mongoCourseId;
            mongoSectionId = mapping.mongoSectionId;
            order = mapping.order;
        } else {
            const wpCourseId = lessonToCourseMap.get(String(wpItem.ID));
            if (!wpCourseId) continue;
            mongoCourseId = courseMap.get(String(wpCourseId));
            if (!mongoCourseId) continue;
            
            let genSection = await Section.findOne({ courseId: mongoCourseId, title: 'General' });
            if (!genSection) {
                genSection = await Section.create({ courseId: mongoCourseId, title: 'General', order: 1 });
            }
            mongoSectionId = genSection._id;
            order = wpItem.menu_order || 0;
        }

        const meta = postMetaMap.get(String(wpItem.ID)) || {};
        let videoUrl = 'https://youtube.com';
        const content = wpItem.post_content || '';
        const ytMatch = content.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        if (ytMatch) videoUrl = ytMatch[0];

        const itemData = {
            courseId: mongoCourseId,
            sectionId: mongoSectionId,
            title: wpItem.post_title,
            content: content,
            videoUrl: videoUrl,
            isFree: meta._lp_preview === 'yes' ? true : false,
            order: order
        };

        const existingLesson = await Lesson.findOne({ courseId: mongoCourseId, title: wpItem.post_title });
        if (!existingLesson) {
            await Lesson.create(itemData);
            itemsCreated++;
        }
    }
    console.log(`Lessons: ${itemsCreated} new items created.`);

    // Update statistics
    for (const [wpId, courseId] of courseMap.entries()) {
        const lc = await Lesson.countDocuments({ courseId });
        const sc = await Section.countDocuments({ courseId });
        await Course.findByIdAndUpdate(courseId, { totalLessons: lc, totalSections: sc });
    }
    console.log('Course content migration complete. Moving to users...');

    // 5. Migrate WordPress Users (Optional/Slow)
    console.log('--- Migrating Users ---');
    let usersCreated = 0;
    for (const wpUser of users) {
        const wpEmail = wpUser.user_email?.toLowerCase();
        if (!wpEmail) continue;

        const wpId = String(wpUser.ID);
        const meta = userMetaMap.get(wpId) || {};
        const name = wpUser.display_name || wpUser.user_login;
        let phone = meta.phone_number && String(meta.phone_number).length === 10 ? meta.phone_number : `9${wpId.padStart(9, '0')}`;

        const mongoUser = await User.findOne({ email: wpEmail });
        if (!mongoUser) {
            try {
                const newUser = await User.collection.insertOne({
                    name, email: wpEmail, phone, password: wpUser.user_pass.replace('$wp$', ''),
                    role: 'student', isVerified: true, createdAt: new Date(), updatedAt: new Date(),
                    enrolledCourses: [], completedLessons: [], certificates: []
                });
                userMap.set(wpId, newUser.insertedId);
                usersCreated++;
                if (usersCreated % 500 === 0) console.log(`Created ${usersCreated} users...`);
            } catch (e) {}
        } else {
            userMap.set(wpId, mongoUser._id);
        }
    }

    // 6. Migrate Enrollments
    console.log('--- Migrating Enrollments ---');
    const wpEnrollments = userItems.filter(ui => ui.item_type === 'lp_course');
    const allLessons = await Lesson.find({});
    const lessonTitleMap = new Map();
    allLessons.forEach(l => lessonTitleMap.set(`${l.courseId}_${l.title}`, l._id));

    let enrollmentsCreated = 0;
    for (const wpEnroll of wpEnrollments) {
        const mongoUserId = userMap.get(String(wpEnroll.user_id));
        const mongoCourseId = courseMap.get(String(wpEnroll.item_id));
        if (!mongoUserId || !mongoCourseId) continue;

        const result = userResultsMap.get(String(wpEnroll.user_item_id)) || {};
        const progress = result.result || 0;
        
        const enrollmentData = {
            user: mongoUserId, course: mongoCourseId,
            status: wpEnroll.status === 'completed' ? 'completed' : 'active',
            progress: Math.min(100, Math.round(parseFloat(progress))),
            completedLessons: [],
            enrolledAt: wpEnroll.start_time ? new Date(wpEnroll.start_time) : new Date()
        };

        const existing = await Enrollment.findOne({ user: mongoUserId, course: mongoCourseId });
        if (!existing) {
            await Enrollment.create(enrollmentData);
            enrollmentsCreated++;
        }
    }
    console.log(`Enrollments migration complete. ${enrollmentsCreated} new enrollments created.`);
    
    console.log('Migration Successfully Finished.');
    process.exit();
};

migrateCourses();
