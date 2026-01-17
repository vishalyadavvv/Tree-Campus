import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
  try {
    // Replace with your MongoDB URI if not in .env
    const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://vishaldgtldb:Ram%40123@cluster0.llotsdg.mongodb.net/TreeCampus?retryWrites=true&w=majority&appName=Cluster0";
    
    await mongoose.connect(MONGO_URI);
    console.log('🚀 Connected to MongoDB');

    // Update all courses that don't have a lang field
    const result = await Course.updateMany(
      { lang: { $exists: false } },
      { $set: { lang: 'En' } }
    );

    console.log(`✅ Migration completed!`);
    console.log(`📊 Updated ${result.modifiedCount} courses.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
