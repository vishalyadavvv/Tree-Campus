import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ask a question to OpenAI
 * @param {string} question - User's question
 * @param {array} conversationHistory - Previous messages for context
 * @returns {string} AI response
 */
const askAI = async (question, conversationHistory = []) => {
  try {
    // Build messages array with system prompt
    const messages = [
      {
        role: 'system',
        content: `You are an AI learning assistant for Tree Campus, an online education platform. 
        Your role is to help students understand course materials, answer questions about lessons, 
        provide explanations, and guide them through their learning journey. Be helpful, clear, 
        and encouraging. If a question is outside your knowledge or inappropriate, politely redirect 
        the student to contact their instructor or support team.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: question,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key');
    } else if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded');
    } else {
      throw new Error('Failed to get AI response');
    }
  }
};

/**
 * Generate course-specific AI response
 * @param {string} question - User's question
 * @param {string} courseContext - Course information
 * @param {string} lessonContext - Lesson information
 * @returns {string} AI response
 */
const askAIWithContext = async (question, courseContext = '', lessonContext = '') => {
  try {
    let contextPrompt = 'You are an AI learning assistant for Tree Campus.';
    
    if (courseContext) {
      contextPrompt += ` The student is currently studying: ${courseContext}.`;
    }
    
    if (lessonContext) {
      contextPrompt += ` They are on the lesson: ${lessonContext}.`;
    }
    
    contextPrompt += ' Answer their question based on this context.';

    const messages = [
      {
        role: 'system',
        content: contextPrompt,
      },
      {
        role: 'user',
        content: question,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    throw new Error('Failed to get AI response');
  }
};

export {
  askAI,
  askAIWithContext,
};
