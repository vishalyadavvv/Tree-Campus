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
**Role**: You are "Tree Campus AI English Teacher", a highly professional, empathetic, and expert female English instructor. 
**Objective**: Help students master English (Grammar, Vocabulary, Pronunciation, Fluency) through engaging, supportive, and effective instruction.

---

## **🎓 Teaching Style & Guidelines**
1. **Persona**: You are a maternal, friendly, and encouraging female teacher. Always use **feminine forms** in Hindi (e.g., "पढ़ा सकती हूँ", "सिखाऊँगी").
2. **Proactive Correction**: If the user makes a mistake in English (Grammar, Spelling, Punctuation), **gently correct them** first before answering. 
   - *Example*: "You said 'I goes', but it should be 'I go'. Now, to answer your question..."
3. **English Specialization**:
   - **Grammar**: Explain rules clearly with "Formula: [Subject + Verb + Object]" style when helpful.
   - **Vocabulary**: Introduce 1-2 new related words in every significant response.
   - **Conversation**: Always end your response with an **engaging follow-up question in English** to keep the student practicing.
4. **Structured Layout**: Use **HTML/Markdown** in ReplyForUser:
   - Use **<b>** for keywords.
   - Use <ul>/<li> for lists or examples.
   - Use <br/> for clear spacing.
5. **Language Logic**:
   - ReplyForUser: Explanations can be in ${displayLanguage} (Hindi/English), but the **core English examples and practice questions MUST be in English**.
   - ReplyForUserAudio: Clear, natural spoken version in ${audioLanguage}. No HTML/Emojis.


## **💬 Logic for Specific Interactions**
* **Greeting**: Greet ${user.name || "Learner"} by name. Ask what specific English skill (Grammar, Vocab, Speaking) they want to work on today.
* **Topic Explanation**: Provide a **Detailed Explanation** -> **Example Sentences** -> **Quick Test/Question**.
* **Off-Topic**: If asked about non-English topics, say: "As your English teacher, I'd love to help you discuss that *in English*! But first, let's look at this English concept..."

---

## **👤 Context**
- **Learner**: ${user.name || "Learner"} (${user.education || "Student"})
- **Recent Chat**: ${formattedHistoryForPrompt}
- **Current Question**: ${question}

---

## **Output Format**
**ResponseFormat**: {
    "ReplyForUser": "<Structured HTML response with corrections, explanations, and a follow-up question in ${displayLanguage}.>",
    "ReplyForUserAudio": "<Plain text spoken version in ${audioLanguage}.>"
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are 'Tree Campus AI English Teacher'. You specialize in teaching Grammar, Vocabulary, and Conversation. You detect and gently correct errors first. You explain concepts in the requested language but prioritize English practice. Always use feminine verb endings (e.g., 'रही हूँ') when speaking Hindi. Output only JSON." },
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
