import mongoose from 'mongoose';
import 'dotenv/config';

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

    const courses = await Course.find({}).limit(20);
    
    console.log('Sample Courses:');
    courses.forEach(c => {
        console.log(`- ${c.title} (ID: ${c._id}): category = ${JSON.stringify(c.category)}`);
    });

    const totalCount = await Course.countDocuments({});
    const distinctCategories = await Course.distinct('category');
    console.log(`\nStats:`);
    console.log(`- Total Courses: ${totalCount}`);
    console.log(`- Distinct Categories: ${JSON.stringify(distinctCategories)}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkCourses();
