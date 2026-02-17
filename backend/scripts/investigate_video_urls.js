/**
 * Investigate how video URLs are stored in WordPress for Bengali lessons
 */
import fs from 'fs';

const loadJSON = (p) => {
    const d = fs.readFileSync(p, 'utf8');
    const r = JSON.parse(d);
    return r[r.length - 1].data || r;
};

const posts = loadJSON('Wordpress data/wp_posts.json');
const meta = loadJSON('Wordpress data/wp_postmeta.json');

// Get Bengali Part-2 curriculum
const bengaliCourse = posts.find(p => p.post_title === 'Spoken English Bengali Part-2');
console.log('Bengali Part-2 WP ID:', bengaliCourse.ID);

const cMeta = meta.find(m => String(m.post_id) === String(bengaliCourse.ID) && m.meta_key === '_lp_info_extra_fast_query');
const curriculum = JSON.parse(cMeta.meta_value);
const sections = curriculum.sections_items;

// Get first few lesson IDs
const lessonIds = [];
sections.forEach(s => {
    if (s.items) s.items.forEach(i => lessonIds.push(String(i.id)));
});

console.log(`Total lesson IDs: ${lessonIds.length}`);
console.log('Sample IDs:', lessonIds.slice(0, 5));

// Check the first 3 lessons
for (const id of lessonIds.slice(0, 3)) {
    console.log(`\n--- Lesson WP ID: ${id} ---`);
    
    // Check post content
    const post = posts.find(p => String(p.ID) === id);
    if (post) {
        console.log('Title:', post.post_title);
        console.log('Content (first 500 chars):', post.post_content.substring(0, 500));
    } else {
        console.log('Post NOT FOUND');
    }
    
    // Check meta keys
    const itemMeta = meta.filter(m => String(m.post_id) === id);
    console.log('Meta keys:');
    itemMeta.forEach(m => {
        console.log(`  ${m.meta_key}: ${String(m.meta_value).substring(0, 150)}`);
    });
}
