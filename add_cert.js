import mongoose from 'mongoose';
import User from './backend/models/User.js';
import Certificate from './backend/models/Certificate.js';
import Course from './backend/models/Course.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to DB");
    const user = await User.findOne({ email: 'vishal1234@gmail.com' });
    if (!user) {
        console.log("User not found");
        process.exit(1);
    }
    
    // Find any course to link the certificate to, or just mock one
    let course = await Course.findOne();
    let courseId = course ? course._id : new mongoose.Types.ObjectId();
    let courseTitle = course ? course.title : "Test Spoken English Course";
    
    const cert = new Certificate({
        userId: user._id,
        courseId: courseId,
        type: 'course',
        score: 95,
        courseTitle: courseTitle,
        userName: user.name,
        completionPercentage: 100,
        grade: 'A+'
    });
    
    await cert.save();
    
    // Also add to user's certificates array
    if (!user.certificates.includes(cert._id)) {
        user.certificates.push(cert._id);
        await user.save();
    }
    
    console.log("Certificate generated and added to user", cert);
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});
