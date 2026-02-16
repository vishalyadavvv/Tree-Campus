
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetPassword = async (email, newPassword) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.password = newPassword;
        await user.save(); // This will trigger the bcrypt hashing hook

        console.log(`✅ Password successfully reset for ${email}`);
        console.log(`Email: ${email}`);
        console.log(`New Password: ${newPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error.message);
        process.exit(1);
    }
};

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('Usage: node scripts/reset_user_password.js <email> <new_password>');
    process.exit(1);
}

resetPassword(email, password);
