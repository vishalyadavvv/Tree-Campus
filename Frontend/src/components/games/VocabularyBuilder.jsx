import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightBulbIcon, ArrowRightIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const VOCAB_DATA = [
  { hindi: 'सेब', english: 'APPLE', hint: 'A red fruit that grows on trees' },
  { hindi: 'किताब', english: 'BOOK', hint: 'You read this to learn' },
  { hindi: 'घर', english: 'HOUSE', hint: 'A place where people live' },
  { hindi: 'पानी', english: 'WATER', hint: 'You drink this when thirsty' },
  { hindi: 'पेड़', english: 'TREE', hint: 'Has leaves, branches and roots' },
  { hindi: 'विद्यालय', english: 'SCHOOL', hint: 'Place where students learn' },
  { hindi: 'दोस्त', english: 'FRIEND', hint: 'Someone you like and trust' },
  { hindi: 'खुश', english: 'HAPPY', hint: 'Feeling of joy and contentment' },
  { hindi: 'दौड़ना', english: 'RUN', hint: 'Moving fast on your feet' },
  { hindi: 'खाना', english: 'EAT', hint: 'What you do with food' },
  { hindi: 'पक्षी', english: 'BIRD', hint: 'An animal that can fly' },
  { hindi: 'सूरज', english: 'SUN', hint: 'Bright star in the sky during day' },
  { hindi: 'चाँद', english: 'MOON', hint: 'Visible in the night sky' },
  { hindi: 'सुंदर', english: 'BEAUTIFUL', hint: 'Very pleasant to look at' },
  { hindi: 'तेज़', english: 'FAST', hint: 'Moving at high speed' },
  { hindi: 'आम', english: 'MANGO', hint: 'Sweet yellow-orange fruit' },
  { hindi: 'फूल', english: 'FLOWER', hint: 'Colorful plant bloom' },
  { hindi: 'रात', english: 'NIGHT', hint: 'Time when you sleep' },
  { hindi: 'दिन', english: 'DAY', hint: 'Time when the sun shines' },
  { hindi: 'बिल्ली', english: 'CAT', hint: 'Pet that says meow' },
];

const VocabularyBuilder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentScramble, setCurrentScramble] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState([]);

  useEffect(() => {
    loadWord(0);
  }, []);

  const scrambleWord = (word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const loadWord = (index) => {
    if (index >= VOCAB_DATA.length) {
      setIsCompleted(true);
      return;
    }
    setCurrentIndex(index);
    setCurrentScramble(scrambleWord(VOCAB_DATA[index].english));
    setUserGuess('');
    setShowResult(null);
    setHintsUsed(0);
    setRevealedLetters([]);
  };

  const handleSubmit = () => {
    const targetWord = VOCAB_DATA[currentIndex].english;
    
    if (userGuess.toUpperCase() === targetWord) {
      const pointsEarned = 100 - (hintsUsed * 20);
      setScore(s => s + pointsEarned);
      setStreak(s => s + 1);
      setShowResult('correct');
      setTimeout(() => {
        loadWord(currentIndex + 1);
      }, 1500);
    } else {
      setStreak(0);
      setShowResult('wrong');
      setTimeout(() => setShowResult(null), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const useHint = () => {
    if (hintsUsed >= 3) return;
    
    const target = VOCAB_DATA[currentIndex].english;
    const newRevealedLetters = [...revealedLetters, hintsUsed];
    setRevealedLetters(newRevealedLetters);
    setHintsUsed(h => h + 1);
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    loadWord(0);
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-6xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Master!</h2>
            <p className="text-gray-600 mb-8">You've completed all {VOCAB_DATA.length} Hindi words!</p>
            
            <div className="bg-gradient-to-br from-teal-50 to-red-50 rounded-xl p-6 max-w-xs mx-auto mb-8 border-2 border-teal-200">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Final Score</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-teal-500 to-red-500 bg-clip-text text-transparent">{score}</p>
            </div>

            <button 
                onClick={restartGame}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-red-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-red-600 transition shadow-lg"
            >
                <ArrowPathIcon className="w-5 h-5" /> Play Again
            </button>
        </div>
      </div>
    );
  }

  const currentWordData = VOCAB_DATA[currentIndex];
  const targetWord = currentWordData.english;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100">
            <div 
                className="h-full bg-gradient-to-r from-teal-500 to-red-500 transition-all duration-500"
                style={{ width: `${((currentIndex) / VOCAB_DATA.length) * 100}%` }}
            />
        </div>

        <div className="p-8 md:p-12">
            {/* Header Stats */}
            <div className="flex justify-between items-center mb-10">
                <div>
                   <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Word {currentIndex + 1} of {VOCAB_DATA.length}</span>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">Score</p>
                        <p className="text-xl font-bold text-gray-900">{score}</p>
                   </div>
                   <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">Streak</p>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-bold text-teal-500">{streak}</span>
                            <span className="text-teal-500">🔥</span>
                        </div>
                   </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="text-center mb-12">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Translate this Hindi word</h3>
                
                {/* Hindi Word Display */}
                <motion.div 
                    key={currentWordData.hindi}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl md:text-7xl font-black text-gray-800 mb-2"
                >
                    {currentWordData.hindi}
                </motion.div>
                
                <p className="text-sm text-gray-500 mb-6">↓ Unscramble the English translation ↓</p>

                {/* Scrambled English Word */}
                <motion.div 
                    key={currentScramble}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl md:text-5xl font-black text-teal-600 tracking-wider mb-8 font-mono"
                >
                    {currentScramble}
                </motion.div>

                {/* Hint Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 inline-block max-w-lg mx-auto">
                    <div className="flex items-start gap-3 text-left">
                        <LightBulbIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-800 font-medium">Hint: <span className="text-blue-600 font-normal">{currentWordData.hint}</span></p>
                    </div>
                </div>

                {/* Revealed Letters */}
                {revealedLetters.length > 0 && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
                        <p className="text-sm text-yellow-800 font-semibold mb-2">💡 Letter Hints:</p>
                        <div className="flex gap-2 justify-center">
                            {targetWord.split('').map((letter, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-10 h-10 flex items-center justify-center font-bold text-lg rounded border-2 ${
                                        revealedLetters.includes(idx) 
                                            ? 'bg-yellow-200 border-yellow-400 text-yellow-900' 
                                            : 'bg-white border-gray-200 text-gray-300'
                                    }`}
                                >
                                    {revealedLetters.includes(idx) ? letter : '?'}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="max-w-md mx-auto relative">
                <input 
                    type="text" 
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="Type English translation..."
                    className={`
                        w-full px-6 py-4 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all uppercase
                        ${showResult === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                        ${showResult === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50'}
                    `}
                    autoFocus
                />
                
                {/* Status Icons */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <AnimatePresence>
                        {showResult === 'correct' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <CheckCircleIcon className="w-8 h-8 text-green-500" />
                            </motion.div>
                        )}
                        {showResult === 'wrong' && (
                            <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                                <XCircleIcon className="w-8 h-8 text-red-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
                <button 
                    type="button"
                    onClick={useHint}
                    disabled={hintsUsed >= 3}
                    className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <LightBulbIcon className="w-4 h-4" /> Letter Hint ({3 - hintsUsed})
                </button>
                <button 
                    onClick={handleSubmit}
                    className="px-8 py-2.5 bg-gradient-to-r from-teal-500 to-red-500 text-white rounded-lg font-bold hover:from-teal-600 hover:to-red-600 transition shadow-md flex items-center gap-2"
                >
                    Submit <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Scoring Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
                <p>Correct answer: +{100 - (hintsUsed * 20)} points • Each hint: -20 points</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for icons
const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

export default VocabularyBuilder;