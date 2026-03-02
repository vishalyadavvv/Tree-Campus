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

        // 2. Read CSV and prepare updates
        console.log(`📖 Phase 2: Reading CSV from ${CSV_PATH}...`);
        if (!fs.existsSync(CSV_PATH)) {
            console.error('❌ CSV file not found!');
            return;
        }

        const updates = [];
        const fileStream = fs.createReadStream(CSV_PATH);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const columns = line.split('\t');
            if (columns.length < 5) continue;

            const name = columns[1]?.trim();
            const email = columns[2]?.trim().toLowerCase();
            const rawPhone = columns[4]?.trim();
            const normalizedPhone = normalizePhone(rawPhone);

            if (email && normalizedPhone) {
                updates.push({ email, name: name || email.split('@')[0], phone: normalizedPhone });
            }
        }
        console.log(`📊 Found ${updates.length} records with valid phones in CSV.`);

        // 3. Apply updates in chunks
        console.log('🚀 Phase 3: Applying phone updates (with UPSERT). Duplicates will be allowed due to isWpMigrated flag.');
        let updatedCount = 0;
        let insertedCount = 0;
        let chunkErrors = 0;
        const CHUNK_SIZE = 1000;

        for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
            const chunk = updates.slice(i, i + CHUNK_SIZE);
            const bulkOps = chunk.map(u => ({
                updateOne: {
                    filter: { email: u.email },
                    update: { 
                        $setOnInsert: {
                            name: u.name,
                            isVerified: true,
                            role: 'student'
                        },
                        $set: { 
                            phone: u.phone,
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
