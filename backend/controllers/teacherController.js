import OpenAI from "openai";
import ChatHistory from '../models/ChatHistory.js';

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

export const askTeacher = async (req, res) => {
    try {
        const { question, history } = req.body;
        const userId = req.user._id;
        const user = req.user;

        let { language } = req.body;
        language = language || "English";

        // User requested: Always write on the board in English, only vary the spoken audio
        const displayLanguage = "English";
        const audioLanguage = language === "English-Hindi" ? "Hinglish" : language;

        const sessionHistory = history || [];
        const recentChatHistory = sessionHistory.slice(-3); // Reduced from 5 to 3 for faster context processing
        
        const isGreeting = /^(hi|hello|hey|greetings|good morning|good evening|namaste|namsate|नमस्ते)([\s\W]*)$/i.test(question.trim());
        
        const formattedHistoryForPrompt = (recentChatHistory.length && !isGreeting) 
            ? recentChatHistory
                  .map(
                      (msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
                  )
                  .join("\n")
            : "No recent conversation. (Start Fresh)";

        const prompt = `
**Role**: You are "Tree Campus AI English Teacher", a professional, encouraging, and highly effective Indian English instructor. 
**Objective**: Help students improve their English skills (Grammar, Vocabulary, Fluency) through natural conversation and targeted instruction.

---

## **🎓 Teaching Style & Guidelines**
1. **Persona**: You are a warm, supportive Indian teacher. You speak in clear, natural, and polite Indian English. Use a pacing that is comfortable and easy to understand for beginners.
2. **Correction Policy**: 
   - **Do NOT correct minor typos** or casual spellings (e.g., "hii", "ok", "thx") unless they impede understanding or are major grammatical errors properly.
   - **Focus on major errors** only.
   - If a correction is needed, do it gently and briefly before answering the core question.
3. **Brevity & English Focus**:
   - **Brevity**: Keep responses EXTREMELY short, punchy, and concise (maximum 2-3 sentences). Do not write long paragraphs.
   - **Explain**: Use clear, simple English.
   - **Vocabulary**: Naturally introduce 1 advanced word or idiom relevant to the topic.
   - **Engagement**: Always end with a short relevant follow-up question to keep the conversation going.
4. **Structured Layout**: Use simple HTML/Markdown in ReplyForUser:
   - Use **<b>** for emphasis.
   - Use <br/> for paragraph breaks.
   - Keep it visually clean.
5. **Language Logic**:
   - ReplyForUser: Explanations can be in ${displayLanguage}, but **examples and practice must be in English**.
   - ReplyForUserAudio: Natural spoken version based on the Target Audio Language:
     * If the language is **Hindi**, write the fully spoken explanation in **simple, everyday conversational Hindi (Devanagari script)** exactly as it will be read by an Indian voice. Do NOT use overly formal or complex Hindi words. Keep only the core grammar examples in English.
     * If the language is **Hinglish**, output the text in **normal conversational Hinglish (written in Latin script)**. Speak naturally like an Indian teacher mixing Hindi and English (e.g. "Aaj hum grammar practice karenge..."). Keep grammar examples in English.
     * If the language is **English**, write it in fully natural Indian English.
   - **Target Audio Language**: ${audioLanguage}. Write the text exactly as it should be spoken smoothly at a moderate, calm pace by an Indian teacher. **Do NOT include HTML tags, emojis, or structural markers** in the audio text.

---

## **💬 Interaction Logic**
* **Greeting**: Warmly greet ${user.name || "Learner"}. Speak in natural conversational ${audioLanguage}. Briefly ask what they'd like to focus on (Grammar, Vocabulary, Speaking) if it's the start of a session.
* **Topic Explanation**: Explanation -> Example -> Question.
* **Off-Topic**: Politely steer back to English learning.

---

## **👤 Context**
- **Learner**: ${user.name || "Learner"}
- **Recent Chat**: ${formattedHistoryForPrompt}
- **Current Question**: ${question}

---

## **Output Format**
**ResponseFormat**: {
    "ReplyForUser": "<Structured HTML response for the UI.>",
    "ReplyForUserAudio": "<Plain text for speech generation.>"
}
`;

        console.time("OpenAI Text Generation");
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are the Tree Campus AI English Teacher. You are professional, encouraging, and focused on helping students learn. KEEP RESPONSES EXTREMELY CONCISE. Output strictly valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 300,
            temperature: 0.7
        });
        console.timeEnd("OpenAI Text Generation");

        const response = JSON.parse(completion.choices[0].message.content);

        // --- Generate Audio (TTS) ---
        // Using Google Cloud TTS REST API for Indian English voice
        let audioData = null;
        let visemesData = null;

        try {
            const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
            
            if (!apiKey) {
                console.warn("GOOGLE_CLOUD_API_KEY is missing. Skipping audio generation.");
            } else if (!response.ReplyForUserAudio || response.ReplyForUserAudio.trim() === "") {
                console.warn("⚠️ AI returned empty audio text. Skipping TTS to prevent 400 error.");
            } else {
                const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
                
                // Using en-IN-Neural2-D (Female Indian English) or en-IN-Wavenet-C (Male)
                // If nanami (female) -> en-IN-Neural2-D, else en-IN-Wavenet-C
                const teacherName = "Nanami"; 
                
                let languageCode = "en-IN";
                let voiceName = teacherName === "Nanami" ? "en-IN-Neural2-D" : "en-IN-Wavenet-C";

                // Switch to a Hindi voice if the user requested Hindi or English-Hindi (Hinglish)
                if (language === "Hindi" || language === "English-Hindi") {
                    languageCode = "hi-IN";
                    // Using Wavenet instead of Neural2 because Neural2 Hindi voices are occasionally restricted/unavailable, causing silent crashes
                    voiceName = teacherName === "Nanami" ? "hi-IN-Wavenet-A" : "hi-IN-Wavenet-C"; // Female / Male Hindi voices
                }

                const requestBody = {
                    input: { text: response.ReplyForUserAudio },
                    voice: { languageCode: languageCode, name: voiceName },
                    audioConfig: { 
                        audioEncoding: "MP3",
                        speakingRate: 0.98
                    }
                };

                console.time("Google TTS Generation");
                const ttsResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });
                console.timeEnd("Google TTS Generation");

                if (!ttsResponse.ok) {
                    const errorText = await ttsResponse.text();
                    throw new Error(`Google TTS API error: ${ttsResponse.status} ${errorText}`);
                }

                const ttsData = await ttsResponse.json();
                audioData = ttsData.audioContent; // This is already base64 encoded MP3
                
                // Process timepoints into visemes for the 3D Avatar
                if (ttsData.timepoints && ttsData.timepoints.length > 0) {
                     visemesData = ttsData.timepoints.map(tp => {
                         // tp.markName maps to a viseme ID (0-21). Google returns letters/numbers. 
                         // We will map it to a generic viseme if necessary, or just use the time in ms.
                         // For simplicity, we just trigger speech viseme 5 or 21 at the given timestamp.
                         const timeMs = Math.round(tp.timeSeconds * 1000);
                         return [timeMs, 21]; // Trigger lipsync movement
                     });
                     
                     // Ensure an end shape
                     const lastTime = ttsData.timepoints[ttsData.timepoints.length -1].timeSeconds;
                     visemesData.push([Math.round(lastTime * 1000) + 200, 0]); // neutral frame
                }
            }

            // Fallback hardcoded visemes if Google doesn't return timepoints or if we want the old sync
            if (!visemesData || visemesData.length === 0) {
                visemesData = [
                    [140, 21], [350, 5], [490, 21], [630, 0], [980, 21], [1050, 7], [1110, 21],
                    [1180, 5], [1250, 21], [1460, 18], [1530, 21], [1600, 1], [1680, 21],
                    [1770, 5], [1980, 19], [2050, 21], [2330, 5], [2500, 21], [2640, 0],
                    [3190, 5], [3240, 21], [3420, 5], [3560, 8], [3770, 21], [3840, 1],
                    [3920, 21], [3980, 5], [4110, 21], [4180, 5], [4250, 21], [4600, 5],
                    [4670, 21], [4740, 0], [5160, 6], [5210, 21], [5320, 1], [5400, 5],
                    [5440, 21], [5620, 1], [5710, 21], [5780, 5], [5840, 21], [6120, 5],
                    [6260, 21], [6330, 5], [6470, 0], [6520, 0], [7009, 21], [7133, 14],
                    [7321, 19], [7473, 5], [8992, 10], [10213, 3], [11060, 20], [11418, 0],
                    [11910, 10], [12605, 1], [13621, 3], [14775, 20], [15744, 4], [16865, 4],
                    [18045, 12], [18625, 18], [19721, 11], [20421, 21], [20959, 12], [21900, 7],
                    [23241, 0], [24495, 8], [25730, 8], [27225, 20], [28921, 2], [30360, 13],
                    [31944, 16], [33192, 21], [34737, 1], [35908, 5], [37256, 14], [38625, 18],
                    [40130, 14], [41418, 8], [42999, 2], [44450, 9], [45576, 17], [46922, 16],
                    [48259, 0], [49523, 16], [51084, 5], [52531, 15], [53856, 11], [55384, 19],
                    [56792, 21], [58292, 19], [59856, 11]
                ];
            }

        } catch (audioError) {
            console.error("Audio Generation Error Details:", audioError.message, audioError.stack);
            // Non-blocking error: we still return text even if audio fails
        }

        // Store chat history in background
        ChatHistory.findOneAndUpdate(
            { user: userId, isTeacher: true },
            { 
                $push: { 
                    messages: [
                        { role: 'user', content: question },
                        { role: 'assistant', content: response.ReplyForUser }
                    ]
                }
            },
            { upsert: true, new: true }
        ).catch(err => console.error("History storage error:", err));

        res.json({
            text: response.ReplyForUser,
            audio_text: response.ReplyForUserAudio,
            audio: audioData, // Base64 MP3
            visemes: visemesData // For 3D lipsync
        });

    } catch (error) {
        console.error("Teacher AI Error:", error);
        res.status(500).json({ error: error.message });
    }
};
