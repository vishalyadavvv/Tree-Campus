/**
 * Fix video URLs for Bengali courses ONLY.
 * Extracts real YouTube URLs from WordPress post_content
 * and updates existing lessons in MongoDB.
 * 
 * DOES NOT touch Spoken English Part 1, 2, or 3.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const WP_DATA_DIR = path.join(__dirname, '../../Wordpress data');

const loadJSON = (p) => {
    const d = fs.readFileSync(p, 'utf8');
    const r = JSON.parse(d);
    return r[r.length - 1].data || r;
};

/**
 * Extract YouTube URL from WordPress post_content.
 * Handles:
 *   [embedyt]https://youtu.be/VIDEO_ID[/embedyt]
 *   [embedyt]https://www.youtube.com/watch?v=VIDEO_ID[/embedyt]
 *   Raw YouTube URLs in content
 */
const extractVideoUrl = (content) => {
    if (!content) return null;

    // 1. Try [embedyt] shortcode
    const embedMatch = content.match(/\[embedyt\](https?:\/\/[^\[]+)\[\/embedyt\]/);
    if (embedMatch) return embedMatch[1].trim();

    // 2. Try youtu.be short URL
    const shortMatch = content.match(/(https?:\/\/youtu\.be\/[a-zA-Z0-9_-]+)/);
    if (shortMatch) return shortMatch[1];

    // 3. Try full YouTube URL
    const fullMatch = content.match(/(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)/);
    if (fullMatch) return fullMatch[1];

    // 4. Try YouTube embed URL
    const embedUrlMatch = content.match(/(https?:\/\/(?:www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+)/);
    if (embedUrlMatch) return embedUrlMatch[1];

    return null;
};

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const posts = loadJSON(path.join(WP_DATA_DIR, 'wp_posts.json'));
    const postMeta = loadJSON(path.join(WP_DATA_DIR, 'wp_postmeta.json'));

    // Build posts lookup by ID
    const postsById = new Map();
    posts.forEach(p => postsById.set(String(p.ID), p));

    // Build postMeta map
    const postMetaMap = new Map();
    postMeta.forEach(m => {
        const pid = String(m.post_id);
        if (!postMetaMap.has(pid)) postMetaMap.set(pid, {});
        postMetaMap.get(pid)[m.meta_key] = m.meta_value;
    });

    // Only process Bengali courses
    const bengaliCourseNames = [
        'Spoken English Bengali Part-1',
        'Spoken English Bengali Part-2',
        'Spoken English Bengali Part-3'
    ];

    const wpBengaliCourses = posts.filter(p =>
        p.post_type === 'lp_course' && bengaliCourseNames.includes(p.post_title)
    );

    console.log(`Found ${wpBengaliCourses.length} Bengali courses to fix`);

    let totalUpdated = 0;
    let totalNoVideo = 0;

    for (const wpCourse of wpBengaliCourses) {
        console.log(`\n=== ${wpCourse.post_title} (WP ID: ${wpCourse.ID}) ===`);

        // Find MongoDB course
        const course = await Course.findOne({ title: wpCourse.post_title });
        if (!course) {
            console.log('  Course not found in MongoDB, skipping.');
            continue;
        }

        // Get curriculum
        const meta = postMetaMap.get(String(wpCourse.ID)) || {};
        let curriculum = null;
        try {
            curriculum = JSON.parse(meta._lp_info_extra_fast_query);
        } catch (e) {
            console.log('  Error parsing curriculum');
            continue;
        }

        const sections = curriculum.sections_items || curriculum.sections || curriculum.section || [];

        // Collect all lesson WP IDs from curriculum
        const lessonWpIds = [];
        sections.forEach(s => {
            if (s.items) s.items.forEach(i => lessonWpIds.push(String(i.id)));
        });

        console.log(`  ${lessonWpIds.length} lessons in curriculum`);

        // Update each lesson's videoUrl
        for (const wpId of lessonWpIds) {
            const wpPost = postsById.get(wpId);
            if (!wpPost) continue;

            const videoUrl = extractVideoUrl(wpPost.post_content);

            // Find matching lesson in MongoDB by title and courseId
            const lesson = await Lesson.findOne({
                courseId: course._id,
                title: wpPost.post_title
            });

            if (lesson) {
                if (videoUrl) {
                    lesson.videoUrl = videoUrl;
                    await lesson.save();
                    totalUpdated++;
                } else {
                    totalNoVideo++;
                }
            }
        }

        const updatedCount = await Lesson.countDocuments({
            courseId: course._id,
            videoUrl: { $ne: 'https://youtube.com' }
        });
        const totalCount = await Lesson.countDocuments({ courseId: course._id });
        console.log(`  Updated: ${updatedCount}/${totalCount} lessons now have real video URLs`);
    }

    console.log(`\n=== COMPLETE ===`);
    console.log(`Total lessons updated with real URLs: ${totalUpdated}`);
    console.log(`Lessons with no video found in content: ${totalNoVideo}`);

    process.exit(0);
};

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
