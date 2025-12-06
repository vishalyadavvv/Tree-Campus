import React, { useState, useRef, useEffect } from 'react';


const Spokee = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'spokee',
      text: 'Hello! I am Spokee, your AI English learning companion. How can I help you today?',
      textHindi: 'नमस्ते! मैं Spokee हूं, आपका AI अंग्रेजी सीखने वाला साथी। मैं आज आपकी कैसे मदद कर सकता हूं?',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [language, setLanguage] = useState('hindi');
  const messagesEndRef = useRef(null);

 

  const learningCategories = {
    vocabulary: {
      en: 'Vocabulary Builder',
      hi: 'शब्दावली निर्माता',
      icon: '📚',
      questions: [
        { q: 'What does "diligent" mean?', a: 'Hardworking and careful', qHi: '"Diligent" का अर्थ क्या है?' },
        { q: 'Use "ambitious" in a sentence', a: 'Example: She is ambitious about her career.', qHi: '"Ambitious" का वाक्य में प्रयोग करें' },
        { q: 'What is a synonym for "happy"?', a: 'Joyful, delighted, pleased', qHi: '"Happy" का पर्यायवाची क्या है?' }
      ]
    },
    grammar: {
      en: 'Grammar Practice',
      hi: 'व्याकरण अभ्यास',
      icon: '✍️',
      questions: [
        { q: 'Correct this: "He go to school daily"', a: 'He goes to school daily', qHi: 'सुधारें: "He go to school daily"' },
        { q: 'What is the past tense of "eat"?', a: 'Ate', qHi: '"Eat" का भूतकाल क्या है?' },
        { q: 'Fill in: "I ___ studying for 2 hours" (present perfect continuous)', a: 'have been', qHi: 'भरें: "I ___ studying for 2 hours"' }
      ]
    },
    conversation: {
      en: 'Daily Conversations',
      hi: 'दैनिक बातचीत',
      icon: '💬',
      questions: [
        { q: 'How would you introduce yourself to a stranger?', a: 'Example: Hello, my name is... Nice to meet you!', qHi: 'आप अपना परिचय कैसे देंगे?' },
        { q: 'Ask for directions to the nearest bank', a: 'Example: Excuse me, could you tell me where the nearest bank is?', qHi: 'बैंक का रास्ता पूछें' },
        { q: 'Order food at a restaurant', a: 'Example: I would like to order...', qHi: 'रेस्टोरेंट में खाना ऑर्डर करें' }
      ]
    },
    pronunciation: {
      en: 'Pronunciation Tips',
      hi: 'उच्चारण युक्तियाँ',
      icon: '🗣️',
      questions: [
        { q: 'How do you pronounce "schedule"?', a: 'SHED-yool (UK) or SKED-jool (US)', qHi: '"Schedule" का उच्चारण कैसे करें?' },
        { q: 'Practice saying: "She sells seashells"', a: 'Focus on the "S" sound', qHi: 'अभ्यास करें: "She sells seashells"' },
        { q: 'What is the difference between "ship" and "sheep"?', a: 'Ship has a short "i" sound, sheep has a long "ee" sound', qHi: '"Ship" और "sheep" में अंतर?' }
      ]
    },
    idioms: {
      en: 'Idioms & Phrases',
      hi: 'मुहावरे और वाक्यांश',
      icon: '🎭',
      questions: [
        { q: 'What does "break the ice" mean?', a: 'To start a conversation in a social setting', qHi: '"Break the ice" का अर्थ?' },
        { q: 'Explain "piece of cake"', a: 'Something that is very easy to do', qHi: '"Piece of cake" समझाएं' },
        { q: 'Use "under the weather" in context', a: 'Example: I am feeling under the weather today (feeling sick)', qHi: '"Under the weather" का प्रयोग करें' }
      ]
    },
    writing: {
      en: 'Writing Skills',
      hi: 'लेखन कौशल',
      icon: '📝',
      questions: [
        { q: 'Write a formal email greeting', a: 'Example: Dear Sir/Madam, I hope this email finds you well.', qHi: 'औपचारिक ईमेल अभिवादन लिखें' },
        { q: 'How do you end a professional email?', a: 'Example: Best regards, Sincerely, Kind regards', qHi: 'पेशेवर ईमेल कैसे समाप्त करें?' },
        { q: 'Write a short paragraph about your hobby', a: 'Share your interests in 3-4 sentences', qHi: 'अपने शौक के बारे में लिखें' }
      ]
    }
  };

  const handleCategoryClick = (categoryKey) => {
    const category = learningCategories[categoryKey];
    const randomQuestion = category.questions[Math.floor(Math.random() * category.questions.length)];
    
    const questionMsg = {
      id: messages.length + 1,
      type: 'spokee',
      text: `${category.icon} ${category.en}\n\n${randomQuestion.q}`,
      textHindi: `${category.icon} ${category.hi}\n\n${randomQuestion.qHi}`,
      time: new Date().toLocaleTimeString(),
      isQuestion: true,
      answer: randomQuestion.a
    };
    
    setMessages(prev => [...prev, questionMsg]);
    setCurrentQuiz(randomQuestion.a);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const spokeeResponse = {
        id: messages.length + 2,
        type: 'spokee',
        text: generateResponse(inputText),
        textHindi: generateResponseHindi(inputText),
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, spokeeResponse]);
      setIsTyping(false);
      setCurrentQuiz(null);
    }, 1500);
  };

  const showAnswer = () => {
    if (currentQuiz) {
      const answerMsg = {
        id: messages.length + 1,
        type: 'spokee',
        text: `✅ Answer: ${currentQuiz}\n\nWould you like to practice more?`,
        textHindi: `✅ उत्तर: ${currentQuiz}\n\nक्या आप और अभ्यास करना चाहेंगे?`,
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, answerMsg]);
      setCurrentQuiz(null);
    }
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! Great to see you practicing. What would you like to learn today?";
    }
    if (lowerInput.includes('grammar')) {
      return "Perfect! Grammar is essential. Let me give you some exercises. Click on 'Grammar Practice' above or ask me a specific grammar question.";
    }
    if (lowerInput.includes('vocabulary') || lowerInput.includes('word')) {
      return "Excellent! Building vocabulary is key. Try the 'Vocabulary Builder' section or tell me which topic interests you.";
    }
    if (lowerInput.includes('conversation') || lowerInput.includes('speak')) {
      return "Great choice! Let's practice conversations. Choose 'Daily Conversations' or tell me a scenario you want to practice.";
    }
    
    const responses = [
      "That's wonderful! Keep practicing. Can you try forming a complete sentence with that?",
      "Good effort! Remember to use proper tenses. Would you like me to explain more?",
      "Excellent! Your English is improving. Let me give you a challenge - try using this in a real conversation.",
      "Well done! Would you like to explore more topics or practice what you've learned?",
      "Great question! Let me break this down for you step by step..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateResponseHindi = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "नमस्ते! आपको अभ्यास करते देखकर अच्छा लगा। आज आप क्या सीखना चाहेंगे?";
    }
    if (lowerInput.includes('grammar') || lowerInput.includes('व्याकरण')) {
      return "बिल्कुल सही! व्याकरण बहुत महत्वपूर्ण है। मैं आपको कुछ अभ्यास दूंगा। ऊपर 'व्याकरण अभ्यास' पर क्लिक करें।";
    }
    
    const responses = [
      "बहुत बढ़िया! अभ्यास जारी रखें। क्या आप इसके साथ एक पूरा वाक्य बना सकते हैं?",
      "अच्छा प्रयास! सही काल का उपयोग करना याद रखें। क्या आप चाहते हैं कि मैं और समझाऊं?",
      "उत्कृष्ट! आपकी अंग्रेजी सुधर रही है। मैं आपको एक चुनौती देता हूं - इसे वास्तविक बातचीत में उपयोग करने का प्रयास करें।",
      "बहुत अच्छा! क्या आप अधिक विषय जानना चाहेंगे या सीखे हुए का अभ्यास करना चाहेंगे?",
      "अच्छा सवाल! मैं इसे चरण दर चरण समझाता हूं..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickPrompts = [
    { en: 'Help me with tenses', hi: 'काल में मदद करें' },
    { en: 'Common mistakes', hi: 'सामान्य गलतियाँ' },
    { en: 'Business English', hi: 'व्यावसायिक अंग्रेजी' },
    { en: 'Interview preparation', hi: 'साक्षात्कार तैयारी' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-bold">Spokee AI</h1>
                <p className="text-blue-100 text-sm">
                  {language === 'hindi' ? 'आपका वर्चुअल अंग्रेजी साथी' : 'Your Virtual English Companion'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
                className="px-3 py-1 bg-[black] bg-opacity-20 rounded-full text-xs hover:bg-opacity-30 transition"
              >
                {language === 'hindi' ? '🇬🇧 EN' : '🇮🇳 HI'}
              </button>
              <span className="inline-flex items-center px-3 py-1 bg-green-400 bg-opacity-30 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                {language === 'hindi' ? 'ऑनलाइन' : 'Online'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Categories */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {Object.entries(learningCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-center"
            >
              <div className="text-3xl mb-1">{category.icon}</div>
              <div className="text-xs font-semibold text-gray-700">
                {language === 'hindi' ? category.hi : category.en}
              </div>
            </button>
          ))}
        </div>

        {/* Messages */}
       <div
  id="chat-scroll-box"
  className="bg-white rounded-2xl shadow-xl mb-4"
  style={{ height: '400px', overflowY: 'auto' }}
>

          <div className="p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : message.isQuestion
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-2 border-green-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    {message.type === 'spokee' && language === 'hindi' 
                      ? message.textHindi 
                      : message.text}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">{message.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Show Answer Button */}
        {currentQuiz && (
          <div className="mb-4 text-center">
            <button
              onClick={showAnswer}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition shadow-md font-semibold"
            >
              ✅ {language === 'hindi' ? 'उत्तर दिखाएं' : 'Show Answer'}
            </button>
          </div>
        )}

        {/* Quick Prompts */}
        <div className="mb-4 flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setInputText(language === 'hindi' ? prompt.hi : prompt.en)}
              className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition shadow-md"
            >
              {language === 'hindi' ? prompt.hi : prompt.en}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'hindi' ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {language === 'hindi' ? 'भेजें' : 'Send'}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 {language === 'hindi' ? 'आज की युक्ति' : 'Today\'s Tip'}:
          </h3>
          <p className="text-sm text-blue-800">
            {language === 'hindi' 
              ? '📚 प्रतिदिन 15 मिनट अभ्यास करें। ऊपर दिए गए श्रेणियों पर क्लिक करें और प्रश्नों का उत्तर दें। अपने उत्तर टाइप करें या "उत्तर दिखाएं" पर क्लिक करें।'
              : '📚 Practice 15 minutes daily. Click on categories above and answer questions. Type your answer or click "Show Answer" to learn.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Spokee;