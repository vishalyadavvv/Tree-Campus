// scripts/cleanupPhoneNumbers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Drop the old index so it can be recreated with partialFilterExpression
    try {
      await User.collection.dropIndex('phone_1');
      console.log('Old phone index dropped successfully.');
    } catch (e) {
      console.log('Phone index not found or already dropped.');
    }

    // Update all users where phone is an empty string or null to be undefined
    const result = await User.updateMany(
      { $or: [{ phone: "" }, { phone: null }] },
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
