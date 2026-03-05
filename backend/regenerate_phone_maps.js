import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // ──────────────────────────────────────
        // 1. Generate duplicatePhones.json
        // ──────────────────────────────────────
        console.log('🔍 Phase 1: Finding duplicate phone numbers...');
        const dupAgg = await User.aggregate([
            { $match: { phone: { $exists: true, $ne: null, $ne: '' } } },
            { $group: { _id: '$phone', count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const duplicatePhones = dupAgg.map(d => d._id);
        const dupPath = path.join(__dirname, 'utils', 'duplicatePhones.json');
        fs.writeFileSync(dupPath, JSON.stringify(duplicatePhones, null, 2));
        console.log(`✅ Written ${duplicatePhones.length} duplicate phones to duplicatePhones.json`);

        // ──────────────────────────────────────
        // 2. Generate phoneEmailMap.json
        // ──────────────────────────────────────
        console.log('🔍 Phase 2: Building phone → email map...');
        const allUsers = await User.find(
            { phone: { $exists: true, $ne: null, $ne: '' } },
            { phone: 1, email: 1, _id: 0 }
        ).lean();

        const phoneEmailMap = {};
        for (const u of allUsers) {
            // For duplicates, we store the FIRST email found (primary)
            // For unique phones, we store the only email
            if (!phoneEmailMap[u.phone]) {
                phoneEmailMap[u.phone] = u.email;
            }
        }

        const mapPath = path.join(__dirname, 'utils', 'phoneEmailMap.json');
        fs.writeFileSync(mapPath, JSON.stringify(phoneEmailMap, null, 2));
        console.log(`✅ Written ${Object.keys(phoneEmailMap).length} phone→email mappings to phoneEmailMap.json`);

        // ──────────────────────────────────────
        // 3. Summary
        // ──────────────────────────────────────
        console.log(`\n=========================================`);
        console.log(`📊 REGENERATION SUMMARY`);
        console.log(`=========================================`);
        console.log(`- Duplicate phone numbers: ${duplicatePhones.length}`);
        console.log(`- Phone→Email mappings:    ${Object.keys(phoneEmailMap).length}`);
        console.log(`- Total users with phone:  ${allUsers.length}`);
        console.log(`=========================================\n`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected');
    }
};

run();
