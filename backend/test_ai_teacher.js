import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

import { askTeacher } from './controllers/teacherController.js';
import mongoose from 'mongoose';
import User from './models/User.js';

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ role: 'admin' }) || await User.findOne({});
        
        if (!user) {
            console.error("No user found for testing");
            process.exit(1);
        }

        const req = {
            body: {
                question: "Hello, I want to learn English",
                language: "English",
                history: []
            },
            user: user
        };

        const res = {
            json: (data) => {
                console.log("RESPONSE RECEIVED:");
                console.log("Text:", data.text.substring(0, 100) + "...");
                console.log("Audio Text:", data.audio_text);
                console.log("Has Audio:", !!data.audio);
                console.log("Audio Base64 Length:", data.audio ? data.audio.length : 0);
                console.log("Visemes Count:", data.visemes ? data.visemes.length : 0);
                process.exit(0);
            },
            status: (code) => ({
                json: (data) => {
                    console.error("ERROR STATUS:", code, data);
                    process.exit(1);
                }
            })
        };

        await askTeacher(req, res);
    } catch (err) {
        console.error("Test Error:", err);
        process.exit(1);
    }
};

test();
