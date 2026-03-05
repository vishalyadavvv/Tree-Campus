import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// CSV is in root, script is in backend/scripts
const CSV_PATH = path.join(__dirname, '..', '..', 'users_clean.csv');

import User from '../models/User.js';

const normalizePhone = (phone) => {
    if (!phone) return null;
    let digits = phone.replace(/\D/g, '');
    if (digits.length > 10) {
        digits = digits.slice(-10);
    }
    return digits.length === 10 ? digits : null;
};

const run = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Initial Step: Mark likely migrated users
        console.log('🔄 Phase 1: Flagging migrated users (isWpMigrated = true)...');
        const flagResult = await User.updateMany(
            { 
              $or: [
                { password: { $regex: /^\$P\$/ } },
                { password: { $regex: /^\$H\$/ } },
                { password: { $regex: /^\$2y\$/ } },
                { password: { $regex: /^\$2a\$/ } },
                { isVerified: true },
                { phone: { $regex: /^wp_/ } }
              ]
            },
            { $set: { isWpMigrated: true } }
        );
        console.log(`✅ Flagged ${flagResult.modifiedCount} users as isWpMigrated.`);

        // 2. Read Patch JSON
        console.log(`📖 Phase 2: Reading Patch JSON...`);
        const patchPath = path.join(__dirname, 'phone_patch.json');
        if (!fs.existsSync(patchPath)) {
            console.error('❌ Patch JSON file not found! Please ensure phone_patch.json exists in scripts folder.');
            return;
        }

        const updates = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
        console.log(`📊 Found ${updates.length} records in patch.`);

        // 3. Apply updates in chunks
        console.log('🚀 Phase 3: Applying phone updates (with UPSERT).');
        let updatedCount = 0;
        let insertedCount = 0;
        let chunkErrors = 0;
        const CHUNK_SIZE = 1000;

        for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
            const chunk = updates.slice(i, i + CHUNK_SIZE);
            const bulkOps = chunk.map(u => ({
                updateOne: {
                    filter: { email: u.e }, // e = email in patch
                    update: { 
                        $setOnInsert: {
                            name: u.n, // n = name
                            isVerified: true,
                            role: 'student'
                        },
                        $set: { 
                            phone: normalizePhone(u.p), // p = phone
                            isWpMigrated: true 
                        } 
                    },
                    upsert: true
                }
            }));

            try {
                const result = await User.collection.bulkWrite(bulkOps, { ordered: false });
                updatedCount += result.modifiedCount;
                insertedCount += result.upsertedCount;
            } catch (err) {
                chunkErrors++;
            }

            if (i % 5000 === 0 && i > 0) {
                console.log(`⏳ Progress: ${i} / ${updates.length}...`);
            }
        }

        console.log(`\n=========================================`);
        console.log(`✅ FINAL SUMMARY`);
        console.log(`=========================================`);
        console.log(`- Total phone updates applied: ${updatedCount}`);
        console.log(`- Total new users created (upserted): ${insertedCount}`);
        console.log(`- Total users in CSV processed: ${updates.length}`);
        console.log(`=========================================\n`);

    } catch (error) {
        console.error('❌ Script Fatal Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected');
    }
};

run();
