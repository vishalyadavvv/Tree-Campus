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

        console.log('🚀 Creating correct conditional phone index...');
        await users.createIndex(
            { phone: 1 },
            { 
              unique: true, 
              name: 'phone_1',
              partialFilterExpression: { 
                phone: { $type: "string" },
                isWpMigrated: { $ne: true } 
              } 
            }
        );
        console.log('✅ Created phone_1 with isWpMigrated filter');

        const idxs = await users.indexes();
        console.log('Updated Indexes:', JSON.stringify(idxs, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
