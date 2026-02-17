import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkCols = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:');
    for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`- ${col.name}: ${count}`);
    }
    await mongoose.disconnect();
};

checkCols();
