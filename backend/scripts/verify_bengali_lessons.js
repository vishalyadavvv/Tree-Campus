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

const verify = () => {
    const posts = loadJSON('Wordpress data/wp_posts.json');
    const meta = loadJSON('Wordpress data/wp_postmeta.json');
    
    // Bengali Part-2
    const courseId = '1778446';
    const postMeta = meta.filter(m => String(m.post_id) === courseId);
    const curriculumMeta = postMeta.find(m => m.meta_key === '_lp_info_extra_fast_query');
    
    if (!curriculumMeta) {
        console.log('Curriculum meta NOT FOUND for course', courseId);
        return;
    }
    
    let curriculum;
    try {
        curriculum = JSON.parse(curriculumMeta.meta_value);
    } catch (e) {
        console.log('Error parsing curriculum JSON');
        return;
    }
    
    console.log('Course:', courseId);
    if (!curriculum.sections) {
        console.log('Curriculum has NO sections property. Content:', JSON.stringify(curriculum).substring(0, 100));
        return;
    }
    
    console.log('Sections:', curriculum.sections.length);
    
    const itemIds = [];
    curriculum.sections.forEach(s => s.items.forEach(i => itemIds.push(String(i.id))));
    
    console.log('Item IDs in curriculum:', itemIds);
    
    itemIds.forEach(id => {
        const p = posts.find(post => String(post.ID) === id);
        console.log(`- Item ${id}: ${p ? p.post_title : 'NOT FOUND'} | Status: ${p ? p.post_status : 'N/A'} | Type: ${p ? p.post_type : 'N/A'}`);
    });
};

verify();
