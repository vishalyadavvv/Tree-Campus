import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, PauseIcon, PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const WORDS = [
  { word: 'Apple', answer: 'Seb', hint: 'A red fruit' },
  { word: 'Book', answer: 'Kitab', hint: 'Something you read' },
  { word: 'House', answer: 'Ghar', hint: 'Where you live' },
  { word: 'Water', answer: 'Paani', hint: 'You drink this' },
  { word: 'Tree', answer: 'Ped', hint: 'Has leaves and roots' },
  { word: 'School', answer: 'Vidyalaya', hint: 'Place to learn' },
  { word: 'Friend', answer: 'Dost', hint: 'Someone you like' },
  { word: 'Happy', answer: 'Khush', hint: 'Not sad' },
  { word: 'Run', answer: 'Daudna', hint: 'Faster than walking' },
  { word: 'Eat', answer: 'Khana', hint: 'Consume food' },
  { word: 'Bird', answer: 'Pakshi', hint: 'It can fly' },
  { word: 'Sun', answer: 'Suraj', hint: 'Shines in the day' },
  { word: 'Moon', answer: 'Chand', hint: 'Shines at night' },
  { word: 'Beautiful', answer: 'Sundar', hint: 'Very pretty' },
  { word: 'Fast', answer: 'Tez', hint: 'Quick speed' },
];

const BirdSaver = () => {
  const [gameState, setGameState] = useState('start'); // start, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingWords, setFallingWords] = useState([]);
  const [inputObj, setInputObj] = useState('');
  const [level, setLevel] = useState(1);
  
  const gameAreaRef = useRef(null);
  const requestRef = useRef();
  const lastSpawnTime = useRef(0);
  const speedRef = useRef(1);

  // Spawn a new word
  const spawnWord = () => {
    const randomWordObj = WORDS[Math.floor(Math.random() * WORDS.length)];
    const id = Date.now();
    // Random X position between 10% and 80%
    const randomX = Math.floor(Math.random() * 70) + 10;
    
    setFallingWords(prev => [
      ...prev,
      { 
        id, 
        ...randomWordObj, 
        x: randomX, 
        y: -10, // Start slightly above
        speed: speedRef.current + (Math.random() * 0.5) 
      }
    ]);
  };

  // Game Loop
  const gameLoop = (time) => {
    if (gameState !== 'playing') return;

    // Spawn logic
    if (time - lastSpawnTime.current > 2000 / (level * 0.8)) {
      spawnWord();
      lastSpawnTime.current = time;
    }

    // Move words
    setFallingWords(prevWords => {
      const newWords = prevWords.map(w => ({ ...w, y: w.y + (0.5 * w.speed) }));
      
      // Check for missed words (hit bottom)
      const missedWords = newWords.filter(w => w.y > 90);
      if (missedWords.length > 0) {
        setLives(l => Math.max(0, l - missedWords.length));
        return newWords.filter(w => w.y <= 90); // Remove missed words
      }
      
      return newWords;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, level]);

  useEffect(() => {
    if (lives <= 0) {
      setGameState('gameover');
    }
  }, [lives]);

  // Handle Input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputObj(val);

    // Check match
    const matchIndex = fallingWords.findIndex(w => w.answer.toLowerCase() === val.toLowerCase());
    
    if (matchIndex !== -1) {
      // Correct!
      setScore(s => s + 10);
      setFallingWords(prev => prev.filter((_, i) => i !== matchIndex));
      setInputObj(''); // Clear input
      
      // Level up every 50 points
      if ((score + 10) % 50 === 0) {
        setLevel(l => l + 1);
        speedRef.current += 0.2;
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setFallingWords([]);
    setLevel(1);
    speedRef.current = 1;
    setGameState('playing');
    setInputObj('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 min-h-[600px] relative flex flex-col">
        
        {/* Header */}
        <div className="bg-[#FD5B00] text-white p-4 flex justify-between items-center z-10 shadow-md">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🐦</span> Bird Saver
            </h2>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Level {level}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold font-mono">{score}</div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <HeartIcon key={i} className={`w-6 h-6 ${i < lives ? 'text-white' : 'text-white/30'}`} />
              ))}
            </div>
            <button 
              onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              {gameState === 'playing' ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div ref={gameAreaRef} className="flex-1 relative bg-gradient-to-b from-blue-100 to-green-100 overflow-hidden">
          
          {/* Background Elements */}
          <div className="absolute bottom-0 w-full h-12 bg-green-500/20 backdrop-blur-sm z-0" />
          
          {/* Falling Words */}
          <AnimatePresence>
            {fallingWords.map((word) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  top: `${word.y}%`,
                  left: `${word.x}%`
                }}
                exit={{ opacity: 0, scale: 0, rotate: 20 }}
                className="absolute transform -translate-x-1/2 z-10"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl relative">
                    🐦
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="mt-2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold text-gray-800 shadow-sm border border-gray-200">
                    {word.word}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Start / Pause / Game Over Overlays */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  🐦
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Save the Birds!</h3>
                <p className="text-gray-600 mb-6">
                  Type the <strong>Hindi translation</strong> of the falling English words before they hit the ground.
                </p>
                <button 
                  onClick={startGame}
                  className="w-full py-3 bg-[#FD5B00] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-20">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h3>
                <div className="text-5xl font-bold text-[#FD5B00] mb-2">{score}</div>
                <p className="text-gray-500 mb-8">Final Score</p>
                <button 
                  onClick={startGame}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#FD5B00] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg"
                >
                  <ArrowPathIcon className="w-5 h-5" /> Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 z-10">
          <input 
            type="text" 
            value={inputObj}
            onChange={handleInputChange}
            placeholder="Type translation here..." 
            autoFocus
            disabled={gameState !== 'playing'}
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#FD5B00] focus:ring focus:ring-orange-100 transition outline-none text-center font-bold"
          />
          <div className="text-center mt-2 text-xs text-gray-400">
            Press Enter not required - Words match automatically
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirdSaver;
