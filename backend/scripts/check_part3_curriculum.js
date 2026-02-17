import fs from 'fs';

const loadJSON = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    const raw = JSON.parse(data);
    const lastEntry = raw[raw.length - 1];
    if (lastEntry && lastEntry.data && Array.isArray(lastEntry.data)) {
        return lastEntry.data;
    }
    return raw;
};

const check = () => {
    const meta = loadJSON('Wordpress data/wp_postmeta.json');
    const courseId = '34227';
    const postMeta = meta.filter(m => String(m.post_id) === courseId);
    const curriculumMeta = postMeta.find(m => m.meta_key === '_lp_info_extra_fast_query');
    
    if (!curriculumMeta) {
        console.log('Curriculum meta NOT FOUND for course', courseId);
        return;
    }
    
    const curriculum = JSON.parse(curriculumMeta.meta_value);
    const sections = curriculum.sections || curriculum.section || [];
    console.log(`Course ID: ${courseId} | Title: Spoken English Part 3`);
    console.log('Sections:', sections.length);
    
    sections.forEach((s, i) => {
        console.log(`\nSection ${i+1}: ${s.title}`);
        if (s.items) {
            console.log(`Items (${s.items.length}):`);
            s.items.forEach(item => {
                console.log(`  - [${item.id}] ${item.title || 'Untitled'}`);
            });
        }
    });
};

check();
