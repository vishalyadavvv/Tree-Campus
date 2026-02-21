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

        const displayLanguage = language === "English-Hindi" ? "English" : language;
        const audioLanguage = language === "English-Hindi" ? "Hinglish" : language;

        const sessionHistory = history || [];
        const recentChatHistory = sessionHistory.slice(-5);
        
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
   - **Focus on major errors** only (e.g., wrong tense, incorrect sentence structure).
   - If a correction is needed, do it gently and briefly before answering the core question.
3. **English Focus**:
   - **Explain**: Use clear, simple English.
   - **Vocabulary**: Naturally introduce 1 advanced word or idiom relevant to the topic.
   - **Engagement**: Always end with a relevant follow-up question to keep the conversation going.
4. **Structured Layout**: Use simple HTML/Markdown in ReplyForUser:
   - Use **<b>** for emphasis.
   - Use <br/> for paragraph breaks.
   - Keep it visually clean.
5. **Language Logic**:
   - ReplyForUser: Explanations can be in ${displayLanguage}, but **examples and practice must be in English**.
   - ReplyForUserAudio: Natural spoken version in ${audioLanguage}. Write the text exactly as it should be spoken smoothly at a moderate, calm pace by an Indian teacher. **Do NOT include HTML tags, emojis, or structural markers** in the audio text.

---

## **💬 Interaction Logic**
* **Greeting**: Warmly greet ${user.name || "Learner"} in a polite Indian style. Briefly ask what they'd like to focus on (Grammar, Vocabulary, Speaking) if it's the start of a session.
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
                { role: "system", content: "You are the Tree Campus AI English Teacher. You are professional, encouraging, and focused on helping students learn. Output strictly valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
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
            } else {
                const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
                
                // Using en-IN-Neural2-D (Female Indian English) or en-IN-Wavenet-C (Male)
                // If nanami (female) -> en-IN-Neural2-D, else en-IN-Wavenet-C
                const teacherName = "Nanami"; 
                const voiceName = teacherName === "Nanami" ? "en-IN-Neural2-D" : "en-IN-Wavenet-C";

                const requestBody = {
                    input: { text: response.ReplyForUserAudio },
                    voice: { languageCode: "en-IN", name: voiceName },
                    audioConfig: { 
                        audioEncoding: "MP3",
                        speakingRate: 0.85 // Slower pace for teacher feel
                    },
                    // Request Timepoints for accurate lip-syncing!
                    enableTimePointing: ["VISUAL_MARK"]
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
            console.error("Audio Generation Error:", audioError);
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
