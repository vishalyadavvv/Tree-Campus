// client/src/pages/Spokee.jsx
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
  const messagesEndRef = useRef(null);
  const language = localStorage.getItem('preferredLanguage') || 'hindi';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate AI response - Replace with actual API call
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
    }, 1500);
  };

  const generateResponse = (input) => {
    const responses = [
      "That's great! Let me help you practice. Can you make a sentence using that word?",
      "Excellent! Your pronunciation is improving. Try speaking a bit slower for better clarity.",
      "Good question! Let me explain that grammar rule to you...",
      "Well done! Would you like to practice more conversations?",
      "I can help you with that. Let's break it down step by step."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateResponseHindi = (input) => {
    const responses = [
      "बहुत अच्छा! मैं आपको अभ्यास में मदद करूंगा। क्या आप उस शब्द का उपयोग करके एक वाक्य बना सकते हैं?",
      "उत्कृष्ट! आपका उच्चारण सुधर रहा है। बेहतर स्पष्टता के लिए थोड़ा धीरे बोलने का प्रयास करें।",
      "अच्छा सवाल! मैं आपको उस व्याकरण नियम की व्याख्या करता हूं...",
      "बहुत बढ़िया! क्या आप अधिक बातचीत का अभ्यास करना चाहेंगे?",
      "मैं इसमें आपकी मदद कर सकता हूं। चलिए इसे चरण दर चरण तोड़ते हैं।"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickPrompts = [
    { en: 'Help me practice greetings', hi: 'अभिवादन का अभ्यास करें' },
    { en: 'Correct my grammar', hi: 'मेरा व्याकरण सुधारें' },
    { en: 'Teach me new words', hi: 'मुझे नए शब्द सिखाएं' },
    { en: 'Practice conversation', hi: 'बातचीत का अभ्यास करें' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="ml-auto">
              <span className="inline-flex items-center px-3 py-1 bg-green-400 bg-opacity-30 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                {language === 'hindi' ? 'ऑनलाइन' : 'Online'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-xl mb-4" style={{ height: '500px', overflowY: 'auto' }}>
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
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 {language === 'hindi' ? 'टिप्स' : 'Tips'}:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {language === 'hindi' ? 'Spokee से कोई भी प्रश्न पूछें' : 'Ask Spokee any question'}</li>
            <li>• {language === 'hindi' ? 'अपनी वर्तनी और व्याकरण सुधारें' : 'Get corrections on spelling and grammar'}</li>
            <li>• {language === 'hindi' ? 'नए शब्द और वाक्यांश सीखें' : 'Learn new words and phrases'}</li>
            <li>• {language === 'hindi' ? 'दैनिक बातचीत का अभ्यास करें' : 'Practice daily conversations'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Spokee;