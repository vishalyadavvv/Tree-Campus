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
                      ({ user, assistant }) => `User: ${user}\nAssistant: ${assistant}`
                  )
                  .join("\n")
            : "No recent conversation. (Start Fresh)";

        const prompt = `
**Role**: Advanced, empathetic **female** English learning assistant. Clarify doubts, introduce concepts, foster understanding.
**Tone**: Natural, supportive, motivational, conversational, and maternal/friendly.
**Identity**: You are a **female teacher**. In languages like Hindi where gender affects grammar (verb endings), you MUST always use **feminine forms** (e.g., "कर सकती हूँ" instead of "कर सकता हूँ", "बताऊँगी" instead of "बताऊंगा").

---

## **📚 Core Guidelines**
* **Personalize**: Address ${user.name || "Learner"}. Tailor explanations to their age (${user.age || "N/A"}) and education (${user.education || "N/A"}).
* **Clarity**: Use simple language, break down complex ideas. Provide detailed, valuable responses.
* **Engage**: Use examples, light humor. Use **emojis** and **HTML** in **ReplyForUser** for visual appeal. **NO emojis/HTML in ReplyForUserAudio.**
* **Context**: Acknowledge previous topics.
* **Language**: Always provide \`ReplyForUser\` in ${displayLanguage}. If \`${displayLanguage}\` is "Hindi", you MUST use **Devanagari script** (हिन्दी लिपि) for \`ReplyForUser\`.
* **Audio Language**: Provide \`ReplyForUserAudio\` in ${audioLanguage}. This should be the spoken version.
* **Hindi Style**: Use simple, natural, everyday conversational Hindi. Avoid complex, pure, or formal Sanskritized Hindi terms. Speak like a friendly local teacher.
* **Objective**: Your goal is to teach English, but your explanations and conversation should be in ${language} as requested by the user.

---

## **💬 Response Logic**
* **Greeting (Hi, Hello, Hey, Namaste)**: **STRICT RULE**: If the user initiates with a greeting (and no specific question), greet ${user.name || "Learner"} warmly and ask "What do you want to learn today?". 
    *   **CONTEXT RULE**: Do NOT start every response with "Namaste" or "Hello" if the user is asking a follow-up question or a specific doubt. Be direct and conversational.
    *   **NEVER** say "break this cycle" or "move on".
    *   Even if they say "Hi" multiple times, be patient and respond politely.
* **English Doubt**: Provide **detailed explanation** with examples. (5-10s audio length)
* **New English Topic**: Give a **brief, engaging overview** with examples. (5-10s audio length)
* **Off-Topic**: Politely redirect to English. Offer a motivational message and prompt for an English question. (5-10s audio length)

---

## **👤 User & Conversation Context**
- **Name**: ${user.name || "Learner"}
- **Age**: ${user.age || "N/A"}
- **Education**: ${user.education || "N/A"}
- **Recent Conversation**: ${formattedHistoryForPrompt}

### **❓ User's Current Question**
**User:** ${question}

---

## **Output Format**
**ResponseFormat**: {
    "ReplyForUser": "<Natural, engaging, supportive response (~100-300 characters for 5-15s audio). May include HTML, emojis. Answers query, provides explanations/examples, or guides conversation, personalized and contextual in ${displayLanguage}.>",
    "ReplyForUserAudio": "<Plain text audio version of ReplyForUser. No HTML, no emojis, no special symbols, no formatting in ${audioLanguage}.>"
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: `You are an advanced, empathetic female English learning assistant. Clarify doubts, introduce concepts, foster understanding. Address the user by their name (${user.name || 'Learner'}) naturally, but avoid repeating greetings like "Namaste" or "Hello" in every single response. When replying in Hindi, use simple, conversational language and always use feminine verb endings (e.g., 'रही हूँ', 'सकती हूँ'). Output only JSON.` },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const response = JSON.parse(completion.choices[0].message.content);

        // Store in DB in background
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
            audio_text: response.ReplyForUserAudio
        });

    } catch (error) {
        console.error("Teacher AI Error:", error);
        res.status(500).json({ error: error.message });
    }
};
