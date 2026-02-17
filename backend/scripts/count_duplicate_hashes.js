import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const countHashes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const duplicatedHash = '$2y$10$c211GhFRCGXHiHuo89vp3.wQnEI5wF48ejzo73F1P12w1JM1ReaHa';
        
        // Count users with this exact hash (starts with $2y$)
        const count = await User.countDocuments({ 
            password: duplicatedHash 
        });

        // Also count if already normalized by script (starts with $wp$ or normalized to $2a$)
        const wpCount = await User.countDocuments({
            password: { $regex: /c211GhFRCGXHiHuo89vp3\.wQnEI5wF48ejzo73F1P12w1JM1ReaHa/ }
        });

        const totalUsers = await User.countDocuments({});

        console.log(`Total Users in DB: ${totalUsers}`);
        console.log(`Users with the duplicated hash: ${wpCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

countHashes();
