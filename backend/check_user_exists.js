import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'naskarnabonita02@gmail.com';
    const user = await User.findOne({ email }).select('+password');

    if (user) {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('Password Hash:', user.password);
      console.log('isVerified:', user.isVerified);
    } else {
      console.log('User not found in database.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser();
