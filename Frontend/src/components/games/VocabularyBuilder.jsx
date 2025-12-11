import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightBulbIcon, ArrowRightIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const VOCAB_DATA = [
  { word: 'ABUNDANT', hint: 'Existing in large quantities; plentiful.' },
  { word: 'BENEVOLENT', hint: 'Well meaning and kindly.' },
  { word: 'CANDID', hint: 'Truthful and straightforward; frank.' },
  { word: 'DILIGENT', hint: 'Having or showing care and conscientiousness in one\'s work.' },
  { word: 'EMPATHY', hint: 'The ability to understand and share the feelings of another.' },
  { word: 'FLOURISH', hint: 'Grow or develop in a healthy or vigorous way.' },
  { word: 'GENUINE', hint: 'Truly what something is said to be; authentic.' },
  { word: 'HARMONY', hint: 'The quality of forming a pleasing and consistent whole.' },
  { word: 'INEVITABLE', hint: 'Certain to happen; unavoidable.' },
  { word: 'JUBILANT', hint: 'Feeling or expressing great happiness and triumph.' },
];

const VocabularyBuilder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentScramble, setCurrentScramble] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(null); // 'correct', 'wrong'
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

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
    setCurrentScramble(scrambleWord(VOCAB_DATA[index].word));
    setUserGuess('');
    setShowResult(null);
    setHintsUsed(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetWord = VOCAB_DATA[currentIndex].word;
    
    if (userGuess.toUpperCase() === targetWord) {
      setScore(s => s + 100 - (hintsUsed * 20));
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

  const useHint = () => {
    if (hintsUsed >= 3) return;
    
    // Reveal first letter, then second, etc.
    const target = VOCAB_DATA[currentIndex].word;
    const currentLen = userGuess.length;
    const nextChar = target.charAt(hintsUsed);
    
    // Auto-fill the correct letter
    setUserGuess(prev => {
        // This is a simple hint implementation: just filling the input
        // A better way might be to show the letter elsewhere, but this is fine for now
        const arr = prev.split('');
        arr[hintsUsed] = nextChar;
        return arr.join('');
    });
    
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
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Master!</h2>
            <p className="text-gray-600 mb-8">You've completed all the words.</p>
            
            <div className="bg-gray-50 rounded-xl p-6 max-w-xs mx-auto mb-8 border border-gray-100">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Final Score</p>
                <p className="text-4xl font-bold text-[#FD5B00]">{score}</p>
            </div>

            <button 
                onClick={restartGame}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FD5B00] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/25"
            >
                <ArrowPathIcon className="w-5 h-5" /> Play Again
            </button>
        </div>
      </div>
    );
  }

  const currentWordData = VOCAB_DATA[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100">
            <div 
                className="h-full bg-[#FD5B00] transition-all duration-500"
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
                            <span className="text-xl font-bold text-orange-500">{streak}</span>
                            <span className="text-orange-500">🔥</span>
                        </div>
                   </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="text-center mb-12">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Unscramble the word</h3>
                
                <motion.div 
                    key={currentScramble}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl md:text-6xl font-black text-gray-800 tracking-wider mb-8 font-mono"
                >
                    {currentScramble}
                </motion.div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 inline-block max-w-lg mx-auto">
                    <div className="flex items-start gap-3 text-left">
                        <LightBulbIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-800 font-medium">Hint: <span className="text-blue-600 font-normal">{currentWordData.hint}</span></p>
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
                <input 
                    type="text" 
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
                    placeholder="Type answer..."
                    className={`
                        w-full px-6 py-4 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                        ${showResult === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                        ${showResult === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 focus:border-[#FD5B00] focus:ring-4 focus:ring-orange-50'}
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
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <XCircleIcon className="w-8 h-8 text-red-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
                <button 
                    type="button"
                    onClick={useHint}
                    disabled={hintsUsed >= 3}
                    className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
                >
                    <LightBulbIcon className="w-4 h-4" /> Hint ({3 - hintsUsed})
                </button>
                <button 
                    onClick={handleSubmit}
                    className="px-8 py-2.5 bg-[#FD5B00] text-white rounded-lg font-bold hover:bg-orange-600 transition shadow-md flex items-center gap-2"
                >
                    Submit <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

// Helper components for icons not imported from heroicons
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
