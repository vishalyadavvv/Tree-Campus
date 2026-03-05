import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const users = db.collection('users');

        console.log('🗑️ Dropping existing phone_1 index...');
        try {
            await users.dropIndex('phone_1');
            console.log('✅ Dropped phone_1');
        } catch (e) {
            console.log('ℹ️ phone_1 does not exist or already dropped');
        }

        console.log('🚀 Creating standard phone index (Non-unique for now)...');
        await users.createIndex(
            { phone: 1 },
            { name: 'phone_1' }
        );
        console.log('✅ Created standard phone_1 index');

        const idxs = await users.indexes();
        console.log('Updated Indexes:', JSON.stringify(idxs, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
