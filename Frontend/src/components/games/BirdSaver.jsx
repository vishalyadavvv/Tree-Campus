import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, PauseIcon, PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const WORDS = [
  { word: 'सेब', answer: 'Apple', hint: 'A red fruit' },
  { word: 'किताब', answer: 'Book', hint: 'Something you read' },
  { word: 'घर', answer: 'House', hint: 'Where you live' },
  { word: 'पानी', answer: 'Water', hint: 'You drink this' },
  { word: 'पेड़', answer: 'Tree', hint: 'Has leaves and roots' },
  { word: 'विद्यालय', answer: 'School', hint: 'Place to learn' },
  { word: 'दोस्त', answer: 'Friend', hint: 'Someone you like' },
  { word: 'खुश', answer: 'Happy', hint: 'Not sad' },
  { word: 'दौड़ना', answer: 'Run', hint: 'Faster than walking' },
  { word: 'खाना', answer: 'Eat', hint: 'Consume food' },
  { word: 'पक्षी', answer: 'Bird', hint: 'It can fly' },
  { word: 'सूरज', answer: 'Sun', hint: 'Shines in the day' },
  { word: 'चाँद', answer: 'Moon', hint: 'Shines at night' },
  { word: 'सुंदर', answer: 'Beautiful', hint: 'Very pretty' },
  { word: 'तेज़', answer: 'Fast', hint: 'Quick speed' },
  { word: 'आम', answer: 'Mango', hint: 'A sweet fruit' },
  { word: 'फूल', answer: 'Flower', hint: 'Grows in garden' },
  { word: 'रात', answer: 'Night', hint: 'When we sleep' },
  { word: 'दिन', answer: 'Day', hint: 'When sun shines' },
  { word: 'बिल्ली', answer: 'Cat', hint: 'Says meow' },
];

const BirdSaver = () => {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingWords, setFallingWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [level, setLevel] = useState(1);
  
  const gameAreaRef = useRef(null);
  const requestRef = useRef();
  const lastSpawnTime = useRef(0);
  const lastUpdateTime = useRef(0);

  // Calculate spawn interval based on level (slower progression)
  const getSpawnInterval = () => {
    return Math.max(2500, 4000 - (level - 1) * 200); // Start at 4 seconds, decrease by 200ms per level, minimum 2.5s
  };

  // Calculate fall speed based on level (much slower)
  const getFallSpeed = () => {
    return 0.15 + (level - 1) * 0.02; // Start very slow, increase gradually
  };

  // Spawn a new word
  const spawnWord = () => {
    const randomWordObj = WORDS[Math.floor(Math.random() * WORDS.length)];
    const id = Date.now() + Math.random(); // More unique ID
    const randomX = Math.floor(Math.random() * 70) + 10;
    
    setFallingWords(prev => [
      ...prev,
      { 
        id, 
        ...randomWordObj, 
        x: randomX, 
        y: 0, // Start at top
        speed: getFallSpeed()
      }
    ]);
  };

  // Game Loop with delta time for consistent speed
  const gameLoop = (time) => {
    if (gameState !== 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Initialize lastUpdateTime
    if (!lastUpdateTime.current) {
      lastUpdateTime.current = time;
    }

    const deltaTime = time - lastUpdateTime.current;
    lastUpdateTime.current = time;

    // Spawn logic with time-based check
    if (time - lastSpawnTime.current > getSpawnInterval()) {
      spawnWord();
      lastSpawnTime.current = time;
    }

    // Move words based on delta time for consistent speed
    setFallingWords(prevWords => {
      const newWords = prevWords.map(w => ({ 
        ...w, 
        y: w.y + (w.speed * deltaTime / 16.67) // Normalize to 60fps
      }));
      
      // Check for missed words (hit bottom at 95%)
      const missedWords = newWords.filter(w => w.y > 95);
      if (missedWords.length > 0) {
        setLives(l => Math.max(0, l - missedWords.length));
        return newWords.filter(w => w.y <= 95);
      }
      
      return newWords;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'paused') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState, level]);

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [lives, gameState]);

  // Handle Input with trim and case-insensitive matching
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    // Check match - case insensitive and trimmed
    const trimmedVal = val.trim().toLowerCase();
    if (trimmedVal.length === 0) return;

    const matchIndex = fallingWords.findIndex(w => 
      w.answer.toLowerCase() === trimmedVal
    );
    
    if (matchIndex !== -1) {
      // Correct answer!
      const pointsEarned = Math.round(10 * (1 + level * 0.1)); // Bonus points for higher levels
      setScore(s => s + pointsEarned);
      setFallingWords(prev => prev.filter((_, i) => i !== matchIndex));
      setInputValue('');
      
      // Level up every 100 points
      const newScore = score + pointsEarned;
      if (Math.floor(newScore / 100) > Math.floor(score / 100)) {
        setLevel(l => l + 1);
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setFallingWords([]);
    setLevel(1);
    setGameState('playing');
    setInputValue('');
    lastSpawnTime.current = 0;
    lastUpdateTime.current = 0;
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
      lastUpdateTime.current = 0; // Reset timer to avoid jumps
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 min-h-[600px] relative flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex justify-between items-center z-10 shadow-md">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🐦</span> Bird Saver
            </h2>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              Level {level}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold font-mono">Score: {score}</div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <HeartIcon 
                  key={i} 
                  className={`w-6 h-6 transition-all ${
                    i < lives ? 'text-white drop-shadow-lg' : 'text-white/20'
                  }`} 
                />
              ))}
            </div>
            {(gameState === 'playing' || gameState === 'paused') && (
              <button 
                onClick={togglePause}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                {gameState === 'playing' ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div ref={gameAreaRef} className="flex-1 relative bg-gradient-to-b from-sky-200 via-blue-100 to-green-200 overflow-hidden">
          
          {/* Background clouds */}
          <div className="absolute top-10 left-10 text-4xl opacity-30">☁️</div>
          <div className="absolute top-20 right-20 text-5xl opacity-20">☁️</div>
          <div className="absolute top-40 left-1/3 text-3xl opacity-25">☁️</div>
          
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-green-600/30 to-transparent z-0" />
          
          {/* Falling Words */}
          <AnimatePresence>
            {fallingWords.map((word) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: 0,
                  top: `${word.y}%`,
                  left: `${word.x}%`
                }}
                exit={{ opacity: 0, scale: 0, rotate: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute transform -translate-x-1/2 z-10"
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-xl flex items-center justify-center text-3xl relative border-2 border-white">
                    🐦
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="mt-2 bg-white/95 backdrop-blur px-4 py-2 rounded-lg text-base font-bold text-gray-800 shadow-lg border-2 border-gray-200">
                    {word.word}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 bg-yellow-100/80 px-2 py-1 rounded italic">
                    {word.hint}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Start Screen */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-lg">
                  🐦
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Save the Birds!</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Type the <strong className="text-orange-600">English translation</strong> of falling Hindi words before birds hit the ground. Use the hints to help you!
                </p>
                <button 
                  onClick={startGame}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition shadow-lg shadow-orange-500/30 text-lg"
                >
                  Start Game 🎮
                </button>
              </div>
            </div>
          )}

          {/* Paused Screen */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">⏸️ Paused</h3>
                <p className="text-gray-600 mb-6">Take a break! Click play to continue.</p>
                <button 
                  onClick={togglePause}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition shadow-lg"
                >
                  Continue Playing
                </button>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-20">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h3>
                <div className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                  {score}
                </div>
                <p className="text-gray-500 mb-2">Final Score</p>
                <p className="text-sm text-gray-400 mb-8">Reached Level {level}</p>
                <button 
                  onClick={startGame}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition shadow-lg text-lg"
                >
                  <ArrowPathIcon className="w-6 h-6" /> Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t-2 border-gray-200 z-10 shadow-inner">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type English translation here..." 
            autoFocus
            disabled={gameState !== 'playing'}
            className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-center font-bold disabled:bg-gray-100 disabled:text-gray-400"
          />
          <div className="text-center mt-3 text-sm text-gray-500">
            ⌨️ Type the answer and it will match automatically • Case insensitive
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirdSaver;