import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const bulkReset = async () => {
    const TEMP_PASSWORD = 'TreeCampus@2026';
    const DUPLICATED_HASH = '$2y$10$c211GhFRCGXHiHuo89vp3.wQnEI5wF48ejzo73F1P12w1JM1ReaHa';

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log(`Searching for users with hash: ${DUPLICATED_HASH}`);
        
        // We find the users first to ensure we trigger the 'save' hook for hashing
        const users = await User.find({ password: DUPLICATED_HASH });
        
        console.log(`Found ${users.length} users to reset.`);

        if (users.length === 0) {
            console.log('No users found with the duplicated hash.');
            process.exit(0);
        }

        let updatedCount = 0;
        for (const user of users) {
            user.password = TEMP_PASSWORD;
            await user.save(); // This triggers the bcrypt hashing hook in User.js
            updatedCount++;
            if (updatedCount % 100 === 0) {
                console.log(`Updated ${updatedCount}/${users.length} users...`);
            }
        }

        console.log(`Successfully reset ${updatedCount} users.`);
        console.log(`New temporary password for these users IS: ${TEMP_PASSWORD}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error during bulk reset:', error.message);
        process.exit(1);
    }
};

bulkReset();
