import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wpPostsPath = path.join(__dirname, '../Wordpress data/wp_posts.json');
const wpItemsPath = path.join(__dirname, '../Wordpress data/wp_learnpress_user_items.json');

try {
    const postsData = JSON.parse(fs.readFileSync(wpPostsPath, 'utf8'));
    
    console.log("Root Array Length:", postsData.length);
    console.log("First 5 items structure:");
    postsData.slice(0, 5).forEach((item, index) => {
        console.log(`Item ${index}:`, JSON.stringify(item).substring(0, 200) + "...");
    });
    
    // Check if any item is a "table" with "data" property
    const tableItem = postsData.find(i => i.type === 'table' && i.data);
    if (tableItem) {
        console.log("Found table item with data property! switching to that.");
        // If the data is nested in a table object
    }

    
    // Also look at user items to see what they link to
    const itemsData = JSON.parse(fs.readFileSync(wpItemsPath, 'utf8'));
    const userItems = itemsData.filter(i => i.user_item_id && i.item_id);
    console.log(`\nUser Items Count: ${userItems.length}`);
    if (userItems.length > 0) {
        console.log("Sample User Item:", userItems[0]);
    }
} catch (err) {
    console.error("Error analyzing WP data:", err);
}
