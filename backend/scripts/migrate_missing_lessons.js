/**
 * Targeted script: Migrate ONLY missing lessons for all courses.
 * Reads curriculum from WordPress metadata and ensures every lesson
 * referenced in a course's curriculum exists in MongoDB.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Section from '../models/Section.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const WP_DATA_DIR = path.join(__dirname, '../../Wordpress data');

const loadJSON = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    const raw = JSON.parse(data);
    const lastEntry = raw[raw.length - 1];
    if (lastEntry && lastEntry.data && Array.isArray(lastEntry.data)) return lastEntry.data;
    return raw;
};

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const posts = loadJSON(path.join(WP_DATA_DIR, 'wp_posts.json'));
    const postMeta = loadJSON(path.join(WP_DATA_DIR, 'wp_postmeta.json'));

    console.log(`Loaded ${posts.length} posts, ${postMeta.length} metadata entries`);

    // Build post meta map
    const postMetaMap = new Map();
    postMeta.forEach(m => {
        const pid = String(m.post_id);
        if (!postMetaMap.has(pid)) postMetaMap.set(pid, {});
        postMetaMap.get(pid)[m.meta_key] = m.meta_value;
    });

    // Build posts lookup by ID
    const postsById = new Map();
    posts.forEach(p => postsById.set(String(p.ID), p));

    // Find all WordPress courses
    const wpCourses = posts.filter(p => p.post_type === 'lp_course');
    console.log(`Found ${wpCourses.length} WordPress courses`);

    let totalLessonsCreated = 0;
    let totalSectionsCreated = 0;

    for (const wpCourse of wpCourses) {
        console.log(`\n=== Processing: "${wpCourse.post_title}" (WP ID: ${wpCourse.ID}) ===`);

        // Find matching MongoDB course
        const normalizedTitle = wpCourse.post_title.trim().replace(/\s+/g, ' ');
        let course = await Course.findOne({
            $or: [{ title: wpCourse.post_title }, { title: normalizedTitle }]
        });

        if (!course) {
            console.log(`  Course not found in MongoDB, skipping.`);
            continue;
        }

        console.log(`  MongoDB Course ID: ${course._id}`);

        // Get curriculum metadata
        const meta = postMetaMap.get(String(wpCourse.ID)) || {};
        let curriculum = null;
        try {
            if (meta._lp_info_extra_fast_query) {
                curriculum = JSON.parse(meta._lp_info_extra_fast_query);
            }
        } catch (e) {
            console.log(`  Error parsing curriculum JSON, trying double-parse...`);
            try {
                curriculum = JSON.parse(JSON.parse(meta._lp_info_extra_fast_query));
            } catch (e2) {
                console.log(`  Double-parse also failed.`);
            }
        }

        if (!curriculum) {
            console.log(`  No curriculum metadata found.`);
            continue;
        }

        // Handle both "sections" and "section" keys
        // Handle multiple possible keys: "sections", "section", or "sections_items"
        const curriculumSections = curriculum.sections || curriculum.section || curriculum.sections_items || [];
        console.log(`  Curriculum has ${curriculumSections.length} sections`);

        if (curriculumSections.length === 0) {
            console.log(`  WARNING: Curriculum parsed but has 0 sections. Keys: ${Object.keys(curriculum).join(', ')}`);
            console.log(`  Raw curriculum preview: ${JSON.stringify(curriculum).substring(0, 200)}`);
            continue;
        }

        let courseLessonsCreated = 0;

        for (let i = 0; i < curriculumSections.length; i++) {
            const wpSection = curriculumSections[i];
            const sectionTitle = wpSection.title || `Section ${i + 1}`;

            // Find or create section
            let section = await Section.findOne({ courseId: course._id, title: sectionTitle });
            if (!section) {
                section = await Section.create({
                    courseId: course._id,
                    title: sectionTitle,
                    order: i + 1
                });
                totalSectionsCreated++;
                console.log(`  Created section: "${sectionTitle}"`);
            }

            // Process items in this section
            const items = wpSection.items || [];
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                const wpPost = postsById.get(String(item.id));

                const lessonTitle = (wpPost && wpPost.post_title) || item.title || `Lesson ${j + 1}`;
                const content = (wpPost && wpPost.post_content) || '';

                // Extract video URL from content
                let videoUrl = 'https://youtube.com';
                const ytMatch = content.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
                if (ytMatch) videoUrl = ytMatch[0];

                // Check if lesson already exists
                const existing = await Lesson.findOne({ courseId: course._id, title: lessonTitle });
                if (!existing) {
                    await Lesson.create({
                        courseId: course._id,
                        sectionId: section._id,
                        title: lessonTitle,
                        content: content,
                        videoUrl: videoUrl,
                        isFree: false,
                        order: j + 1
                    });
                    courseLessonsCreated++;
                    totalLessonsCreated++;
                }
            }
        }

        // Update course statistics
        const lessonCount = await Lesson.countDocuments({ courseId: course._id });
        const sectionCount = await Section.countDocuments({ courseId: course._id });
        await Course.findByIdAndUpdate(course._id, { totalLessons: lessonCount, totalSections: sectionCount });

        console.log(`  Result: ${courseLessonsCreated} new lessons created. Total: ${lessonCount} lessons, ${sectionCount} sections.`);
    }

    console.log(`\n=== MIGRATION COMPLETE ===`);
    console.log(`Total new sections created: ${totalSectionsCreated}`);
    console.log(`Total new lessons created: ${totalLessonsCreated}`);

    // Final summary
    const allCourses = await Course.find();
    console.log(`\n--- Final Course Summary ---`);
    for (const c of allCourses) {
        const lc = await Lesson.countDocuments({ courseId: c._id });
        const sc = await Section.countDocuments({ courseId: c._id });
        console.log(`  "${c.title}" — ${sc} sections, ${lc} lessons`);
    }

    process.exit(0);
};

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
