// scripts/cleanupPhoneNumbers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Update all users where phone is an empty string to be undefined
    const result = await User.updateMany(
      { phone: "" },
      { $unset: { phone: "" } }
    );

    console.log(`Successfully updated ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
