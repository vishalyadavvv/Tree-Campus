import React from 'react';
import { Link } from 'react-router-dom';

const GamesSection = () => {
  const games = [
  {
    name: "Bird Saver",
    path: "/games/bird-saver",
    description:
      "Save birds by translating words from your native language to English in this exciting vocabulary game",
    icon: "🐦",
    color: "from-blue-400 to-blue-600",
    features: ["Vocabulary Building", "Quick Translation", "Fun Challenges"],
  },
  {
    name: "Lock & Key",
    path: "/games/lock-and-key",
    description:
      "Match synonyms and antonyms to unlock levels and expand your English word knowledge",
    icon: "🔐",
    color: "from-purple-400 to-purple-600",
    features: ["Synonyms & Antonyms", "Word Relationships", "Progressive Levels"],
  },
  {
    name: "Vocabulary Builder",
    path: "/games/vocabulary-builder",
    description:
      "Build your word power with daily challenges and expand your English vocabulary effectively",
    icon: "📚",
    color: "from-pink-400 to-pink-600",
    features: ["Daily Challenges", "Word Mastery", "Progress Tracking"],
  },
];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-[#14B8A6] to-teal-600 bg-clip-text text-transparent">
            Learn with Fun Games
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Make English learning enjoyable with our interactive games designed to improve vocabulary and grammar skills
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {game.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-[#14B8A6] transition-colors duration-300">
                {game.name}
              </h3>
              
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                {game.description}
              </p>

              {/* Game Features */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {game.features.map((feature, featureIndex) => (
                  <span 
                    key={featureIndex}
                    className="px-3 py-1 bg-teal-50 text-[#14B8A6] rounded-lg text-sm font-medium border border-teal-100"
                  >
                    {feature}
                  </span>
                ))}
              </div>

             <Link
  to={game.path}
  className="block w-full py-3 bg-gradient-to-r from-[#14B8A6] to-teal-500 text-white rounded-xl hover:from-teal-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-center transform hover:scale-105"
>
  Play Now
</Link>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-8 border border-teal-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make Learning Fun?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are improving their English skills through our engaging game-based learning platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/games" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#14B8A6] to-teal-500 text-white rounded-xl hover:from-teal-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Explore All Games
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GamesSection;