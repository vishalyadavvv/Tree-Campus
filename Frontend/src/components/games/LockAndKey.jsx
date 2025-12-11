import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockClosedIcon, KeyIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const PAIRS = [
  { id: 1, key: 'Big', lock: 'Huge', type: 'Synonym' },
  { id: 2, key: 'Happy', lock: 'Joyful', type: 'Synonym' },
  { id: 3, key: 'Fast', lock: 'Quick', type: 'Synonym' },
  { id: 4, key: 'Start', lock: 'Begin', type: 'Synonym' },
  { id: 5, key: 'End', lock: 'Finish', type: 'Synonym' },
  { id: 6, key: 'Love', lock: 'Hate', type: 'Antonym' },
  { id: 7, key: 'Hot', lock: 'Cold', type: 'Antonym' },
  { id: 8, key: 'Up', lock: 'Down', type: 'Antonym' },
  { id: 9, key: 'Rich', lock: 'Poor', type: 'Antonym' },
  { id: 10, key: 'Hard', lock: 'Soft', type: 'Antonym' },
];

const LockAndKey = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [score, setScore] = useState(0);
  const [turns, setTurns] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Take random 6 pairs
    const gamePairs = [...PAIRS].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    // Create card deck: Keys and Locks
    const deck = [];
    gamePairs.forEach(pair => {
      deck.push({ id: pair.id, text: pair.key, type: 'key', pairId: pair.id });
      deck.push({ id: pair.id + 100, text: pair.lock, type: 'lock', pairId: pair.id });
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
    
    if (isMatched) return 'bg-green-50 border-green-200 text-green-700 opacity-50 cursor-default';
    if (isSelected) {
      // Check if it's the second card and incorrect
      if (selectedCards.length === 2 && card.pairId !== selectedCards[0].pairId) {
        return 'bg-red-50 border-red-200 text-red-700 scale-105';
      }
      return 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-200 scale-105 transform shadow-lg';
    }
    return 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:shadow-md cursor-pointer';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 min-h-[600px] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <LockClosedIcon className="w-7 h-7" />
              Lock & Key
            </h2>
            <p className="text-blue-100 text-sm opacity-90">Match the correct synonyms & antonyms</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-blue-200">Turns</p>
              <p className="font-mono text-xl font-bold">{turns}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-blue-200">Score</p>
              <p className="font-mono text-xl font-bold">{score}</p>
            </div>
            <button 
              onClick={startNewGame}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
              title="Restart"
            >
              <ArrowPathIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 bg-gray-50 p-8">
          {!isWon ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: matchedIds.includes(card.id) ? 1 : 1.02 }}
                  whileTap={{ scale: matchedIds.includes(card.id) ? 1 : 0.98 }}
                  onClick={() => handleCardClick(card)}
                  className={`
                    relative h-32 rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300
                    ${getCardStyle(card)}
                  `}
                >
                  <div className="mb-2">
                    {card.type === 'key' ? (
                      <KeyIcon className="w-8 h-8 opacity-50" />
                    ) : (
                      <LockClosedIcon className="w-8 h-8 opacity-50" />
                    )}
                  </div>
                  <span className="font-bold text-lg text-center">{card.text}</span>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2">
                    {matchedIds.includes(card.id) && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircleIcon className="w-16 h-16" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Excellent Work!</h2>
              <p className="text-gray-600 mb-8 max-w-sm">
                You matched all the locks and keys in {turns} turns.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={startNewGame}
                  className="px-8 py-3 bg-[#FD5B00] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LockAndKey;
