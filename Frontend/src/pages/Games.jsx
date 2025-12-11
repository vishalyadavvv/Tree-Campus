// client/src/pages/Games.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  TrophyIcon,
  UserGroupIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  LockClosedIcon,
  ArrowRightIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchGamesData = () => {
      setLoading(true);
      // Use static data directly since backend endpoints are not yet available
      setGames(GAMES_DATA);
      setLeaderboard(LEADERBOARD_DATA);
      setLoading(false);
    };

    fetchGamesData();
  }, []);

  const filteredGames = activeFilter === 'all' 
    ? games 
    : games.filter(game => game.difficulty.toLowerCase() === activeFilter);

  const filters = [
    { id: 'all', label: 'All Games' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' }
  ];

  if (loading) {
    return <GamesLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FD5B00]/10 text-[#FD5B00] text-sm font-medium rounded-full mb-4">
                <FireIcon className="w-4 h-4" />
                Learn While Playing
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Fun Learning Games
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Improve your English skills through interactive games. Challenge yourself, 
                compete with others, and track your progress.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#FD5B00]/10 rounded-lg flex items-center justify-center">
                    <TrophyIcon className="w-5 h-5 text-[#FD5B00]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">4</p>
                    <p className="text-sm text-gray-500">Games</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">47K+</p>
                    <p className="text-sm text-gray-500">Players</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">150K+</p>
                    <p className="text-sm text-gray-500">Games Played</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Featured Game Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src="/images/games/featured-game.png" 
                    alt="Featured Game"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#FD5B00] text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Lock And Key</h3>
                  <p className="text-gray-600 mb-4">
                    Match synonyms and antonyms to unlock treasures. Build your vocabulary while having fun
                  </p>
                  <Link to="/games/lock-and-key">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-[#FD5B00] text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayIcon className="w-5 h-5" />
                      Play Now
                    </motion.button>
                  </Link>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-[#FD5B00]/10 rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeFilter === filter.id
                    ? 'bg-[#FD5B00] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          {/* <Link 
            to="/leaderboard"
            className="flex items-center gap-2 text-[#FD5B00] font-medium hover:text-orange-700 transition-colors"
          >
            <TrophyIcon className="w-5 h-5" />
            View Full Leaderboard
            <ArrowRightIcon className="w-4 h-4" />
          </Link> */}
        </motion.div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          <AnimatePresence mode="wait">
            {filteredGames.map((game, index) => (
              <GameCard key={game._id || game.id} game={game} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Leaderboard Section */}
        <LeaderboardSection leaderboard={leaderboard} />
      </section>

      {/* How to Play Section */}
      <HowToPlaySection />
    </div>
  );
};

// ==================== GAME CARD COMPONENT ====================
const GameCard = ({ game, index }) => {
  const navigate = useNavigate();
  
  const difficultyConfig = {
    Easy: { color: 'bg-emerald-50 text-emerald-700', stars: 1 },
    Medium: { color: 'bg-amber-50 text-amber-700', stars: 2 },
    Hard: { color: 'bg-red-50 text-red-700', stars: 3 }
  };

  const config = difficultyConfig[game.difficulty] || difficultyConfig.Easy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Game Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <img 
          src={game.image || game.thumbnail}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = ``;
          }}
        />
        
        {/* Overlay with Icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Game Icon Badge */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl">
          {game.icon}
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {game.difficulty}
          </span>
        </div>

        {/* Play Count */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white text-sm">
          <span className="flex items-center gap-1">
            <UserGroupIcon className="w-4 h-4" />
            {game.players}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {game.avgTime || '5 min'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{game.name}</h3>
          <div className="flex items-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              i < config.stars ? (
                <StarSolidIcon key={i} className="w-4 h-4 text-amber-400" />
              ) : (
                <StarIcon key={i} className="w-4 h-4 text-gray-200" />
              )
            ))}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {game.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">High Score</p>
            <p className="font-bold text-gray-900">{game.highScore?.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Your Best</p>
            <p className="font-bold text-[#FD5B00]">{game.userHighScore?.toLocaleString() || '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">XP Reward</p>
            <p className="font-bold text-emerald-600">+{game.xpReward || 50}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link to={`/games/${game.slug || game.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-[#FD5B00] text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Play Now
            </motion.button>
          </Link>
          <Link to={`/games/${game.slug || game.id}/leaderboard`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
            >
          
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== LEADERBOARD SECTION ====================
const LeaderboardSection = ({ leaderboard }) => {
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🥇' };
      case 2:
        return { bg: 'bg-gray-50', border: 'border-gray-200', icon: '🥈' };
      case 3:
        return { bg: 'bg-orange-50', border: 'border-orange-200', icon: '🥉' };
      default:
        return { bg: 'bg-white', border: 'border-gray-100', icon: rank };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top Players</h2>
              <p className="text-sm text-gray-500">This week's champions</p>
            </div>
          </div>
          {/* <Link 
            to="/leaderboard"
            className="text-sm text-[#FD5B00] font-medium hover:text-orange-700 transition-colors"
          >
            View All
          </Link> */}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Player</th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Game</th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">XP Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaderboard.map((entry, index) => {
              const rankStyle = getRankStyle(entry.rank);
              return (
                <motion.tr
                  key={entry._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${rankStyle.bg} hover:bg-gray-50 transition-colors`}
                >
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      entry.rank <= 3 ? '' : 'bg-gray-100 text-gray-600 text-sm font-medium'
                    }`}>
                      {entry.rank <= 3 ? rankStyle.icon : `#${entry.rank}`}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {entry.avatar ? (
                          <img 
                            src={entry.avatar} 
                            alt={entry.player}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#FD5B00]/10 flex items-center justify-center text-[#FD5B00] font-semibold">
                            {entry.player?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{entry.player}</p>
                        <p className="text-xs text-gray-500">{entry.level || 'Gold Learner'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900">{entry.score?.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                      {entry.gameIcon && <span>{entry.gameIcon}</span>}
                      {entry.game}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-600 font-semibold">+{entry.xpEarned || 100}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// ==================== HOW TO PLAY SECTION ====================
const HowToPlaySection = () => {
  const steps = [
    {
      icon: '🎯',
      title: 'Choose a Game',
      description: 'Select from our collection of educational games based on your skill level.'
    },
    {
      icon: '🎮',
      title: 'Play & Learn',
      description: 'Have fun while improving your vocabulary, grammar, and language skills.'
    },
    {
      icon: '⭐',
      title: 'Earn Points',
      description: 'Score points for correct answers and earn XP to level up your profile.'
    },
    {
      icon: '🏆',
      title: 'Compete',
      description: 'Challenge friends and climb the leaderboard to become the top player.'
    }
  ];

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learning English has never been this fun. Follow these simple steps to get started.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative text-center p-6"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200" />
              )}
              
              {/* Step Number */}
              <div className="relative z-10 w-16 h-16 bg-[#FD5B00]/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                {step.icon}
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== LOADING SCREEN ====================
const GamesLoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-3 border-gray-200 border-t-[#FD5B00] rounded-full mx-auto mb-4"
      />
      <p className="text-gray-600">Loading games...</p>
    </div>
  </div>
);

// ==================== DEFAULT DATA ====================

const GAMES_DATA = [
  {
    id: 1,
    slug: 'bird-saver',
    name: 'Bird Saver',
    description: 'Save birds by translating Hindi words to English quickly. Test your translation speed and vocabulary skills!',
    icon: '�',
    image: 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765432805/Gemini_Generated_Image_bxpnzobxpnzobxpn_zxgovl.png',
    difficulty: 'Easy',
    players: '15,234',
    highScore: 1250,
    userHighScore: 890,
    xpReward: 50,
    avgTime: '3 min'
  },
  {
    id: 2,
    slug: 'lock-and-key',
    name: 'Lock & Key',
    description: 'Match synonyms and antonyms to unlock treasures. Build your vocabulary while having fun!',
    icon: '�',
    image: 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765432965/Gemini_Generated_Image_idif13idif13idif_pybkin.png',
    players: '12,456',
    highScore: 980,
    userHighScore: 720,
    xpReward: 75,
    avgTime: '5 min'
  },
  {
    id: 3,
    slug: 'vocabulary-builder',
    name: 'Vocabulary Builder',
    description: 'Challenge yourself with word puzzles and crosswords. Expand your word power and language skills!',
    icon: '📚',
    image: 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765432978/Gemini_Generated_Image_4ijuit4ijuit4iju_vdpwqc.png',
    difficulty: 'Hard',
    players: '8,934',
    highScore: 1580,
    userHighScore: null,
    xpReward: 100,
    avgTime: '7 min'
  }
];

const LEADERBOARD_DATA = [
  { rank: 1, player: 'Priya Sharma', score: 1580, game: 'Vocabulary Builder', gameIcon: '📚', xpEarned: 250, level: 'Diamond' },
  { rank: 2, player: 'Rahul Kumar', score: 1250, game: 'Bird Saver', gameIcon: '🐦', xpEarned: 200, level: 'Platinum' },
  { rank: 3, player: 'Amit Patel', score: 980, game: 'Lock & Key', gameIcon: '🔐', xpEarned: 150, level: 'Gold' },
  { rank: 4, player: 'Sneha Mishra', score: 875, game: 'Bird Saver', gameIcon: '🐦', xpEarned: 120, level: 'Silver' },
];

export default Games;