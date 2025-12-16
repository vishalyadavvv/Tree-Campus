import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockClosedIcon, KeyIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const PAIRS = [
  { id: 1, hindi: 'सेब', english: 'Apple', hint: 'A red fruit' },
  { id: 2, hindi: 'किताब', english: 'Book', hint: 'For reading' },
  { id: 3, hindi: 'घर', english: 'House', hint: 'Where you live' },
  { id: 4, hindi: 'पानी', english: 'Water', hint: 'You drink this' },
  { id: 5, hindi: 'पेड़', english: 'Tree', hint: 'Has leaves' },
  { id: 6, hindi: 'विद्यालय', english: 'School', hint: 'Place to learn' },
  { id: 7, hindi: 'दोस्त', english: 'Friend', hint: 'Someone close' },
  { id: 8, hindi: 'खुश', english: 'Happy', hint: 'Not sad' },
  { id: 9, hindi: 'दौड़ना', english: 'Run', hint: 'Fast movement' },
  { id: 10, hindi: 'खाना', english: 'Eat', hint: 'Consume food' },
  { id: 11, hindi: 'पक्षी', english: 'Bird', hint: 'Can fly' },
  { id: 12, hindi: 'सूरज', english: 'Sun', hint: 'Shines in day' },
  { id: 13, hindi: 'चाँद', english: 'Moon', hint: 'Shines at night' },
  { id: 14, hindi: 'सुंदर', english: 'Beautiful', hint: 'Very pretty' },
  { id: 15, hindi: 'तेज़', english: 'Fast', hint: 'Quick speed' },
  { id: 16, hindi: 'आम', english: 'Mango', hint: 'Sweet fruit' },
  { id: 17, hindi: 'फूल', english: 'Flower', hint: 'In garden' },
  { id: 18, hindi: 'रात', english: 'Night', hint: 'When we sleep' },
  { id: 19, hindi: 'दिन', english: 'Day', hint: 'When sun shines' },
  { id: 20, hindi: 'बिल्ली', english: 'Cat', hint: 'Says meow' },
];

const LockAndKey = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [score, setScore] = useState(0);
  const [turns, setTurns] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Take random 8 pairs
    const gamePairs = [...PAIRS].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    // Create card deck: Hindi (locks) and English (keys)
    const deck = [];
    gamePairs.forEach(pair => {
      deck.push({ 
        id: `hindi-${pair.id}`, 
        text: pair.hindi, 
        type: 'hindi', 
        pairId: pair.id,
        hint: pair.hint 
      });
      deck.push({ 
        id: `english-${pair.id}`, 
        text: pair.english, 
        type: 'english', 
        pairId: pair.id,
        hint: pair.hint 
      });
    });

    // Shuffle deck
    setCards(deck.sort(() => 0.5 - Math.random()));
    setMatchedIds([]);
    setSelectedCards([]);
    setScore(0);
    setTurns(0);
    setIsWon(false);
  };

  const handleCardClick = (card) => {
    // Ignore if already matched or selected max 2
    if (matchedIds.includes(card.id) || selectedCards.length >= 2 || selectedCards.find(c => c.id === card.id)) {
      return;
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    // Check Match
    if (newSelected.length === 2) {
      setTurns(t => t + 1);
      
      const [first, second] = newSelected;
      
      // Match if same pairId and different types (hindi + english)
      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match!
        setTimeout(() => {
          setMatchedIds(prev => [...prev, first.id, second.id]);
          setSelectedCards([]);
          setScore(s => s + 100);
          
          // Check Win
          if (matchedIds.length + 2 === cards.length) {
            setIsWon(true);
          }
        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          setSelectedCards([]);
          setScore(s => Math.max(0, s - 10)); // Penalty
        }, 1000);
      }
    }
  };

  const getCardStyle = (card) => {
    const isSelected = selectedCards.find(c => c.id === card.id);
    const isMatched = matchedIds.includes(card.id);
    
    if (isMatched) return 'bg-green-50 border-green-300 text-green-700 opacity-60 cursor-default';
    if (isSelected) {
      // Check if it's the second card and incorrect
      if (selectedCards.length === 2 && card.pairId !== selectedCards[0].pairId) {
        return 'bg-red-50 border-red-400 text-red-700 scale-105 ring-2 ring-red-200';
      }
      return 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-300 scale-105 transform shadow-lg';
    }
    return 'bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:shadow-md cursor-pointer hover:scale-102';
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 min-h-[650px] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <LockClosedIcon className="w-7 h-7" />
              Lock & Key: Hindi ↔ English
            </h2>
            <p className="text-orange-100 text-sm mt-1">Match Hindi words (🔒) with their English translations (🔑)</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-orange-200">Turns</p>
              <p className="font-mono text-2xl font-bold">{turns}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-orange-200">Score</p>
              <p className="font-mono text-2xl font-bold">{score}</p>
            </div>
            <button 
              onClick={() => setShowHints(!showHints)}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm font-medium"
              title="Toggle Hints"
            >
              {showHints ? '🙈 Hide' : '💡 Hints'}
            </button>
            <button 
              onClick={startNewGame}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
              title="New Game"
            >
              <ArrowPathIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 p-6">
          {!isWon ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  whileHover={{ scale: matchedIds.includes(card.id) ? 1 : 1.05 }}
                  whileTap={{ scale: matchedIds.includes(card.id) ? 1 : 0.95 }}
                  onClick={() => handleCardClick(card)}
                  className={`
                    relative h-36 rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300
                    ${getCardStyle(card)}
                  `}
                >
                  {/* Icon */}
                  <div className="mb-2">
                    {card.type === 'hindi' ? (
                      <LockClosedIcon className="w-8 h-8 opacity-40" />
                    ) : (
                      <KeyIcon className="w-8 h-8 opacity-40" />
                    )}
                  </div>
                  
                  {/* Word */}
                  <span className={`font-bold text-center ${card.type === 'hindi' ? 'text-xl' : 'text-lg'}`}>
                    {card.text}
                  </span>
                  
                  {/* Hint */}
                  {showHints && !matchedIds.includes(card.id) && (
                    <span className="text-xs text-gray-500 mt-2 italic text-center">
                      {card.hint}
                    </span>
                  )}
                  
                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2">
                    {matchedIds.includes(card.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                      </motion.div>
                    )}
                  </div>

                  {/* Type Badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      card.type === 'hindi' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {card.type === 'hindi' ? 'हिंदी' : 'ENG'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl"
              >
                <CheckCircleIcon className="w-20 h-20" />
              </motion.div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">🎉 Excellent Work!</h2>
              <p className="text-gray-600 mb-2 text-lg">
                You matched all {cards.length / 2} pairs in <span className="font-bold text-orange-600">{turns}</span> turns
              </p>
              <p className="text-gray-500 mb-8">
                Final Score: <span className="font-bold text-2xl text-orange-600">{score}</span> points
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={startNewGame}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition shadow-lg text-lg"
                >
                  Play Again 🎮
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions Footer */}
        <div className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-600">
          <p>
            <span className="inline-flex items-center gap-1 font-semibold text-purple-600">
              <LockClosedIcon className="w-4 h-4" /> Hindi words
            </span>
            {' '} match with {' '}
            <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
              <KeyIcon className="w-4 h-4" /> English translations
            </span>
            {' '} • Click two cards to match them • +100 points for correct, -10 for wrong
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockAndKey;