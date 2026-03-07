import React from "react";
import { Link } from "react-router-dom";

const SpokeeSection = () => {
  return (
    <section className="py-6 bg-[#115E59] text-white relative overflow-hidden"> 
      {/* Root reduced from py-20 → py-6 */}

      {/* Faded Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: `url("")` }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-3 relative z-10"> 
        {/* Width also reduced from 7xl → 5xl */}

        <div className="grid md:grid-cols-2 gap-6 items-start"> 
          {/* Gap reduced */}

          {/* LEFT SECTION */}
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Meet Spokee AI
            </h2>

            <p className="text-base text-teal-100 font-semibold">
              Your Personal English Speaking Partner
            </p>

            <p className="text-sm text-teal-50 leading-relaxed">
              Practice English with instant feedback and pronunciation correction.
            </p>

            <ul className="space-y-2">
              {[
                "24/7 AI Speaking Partner",
                "Pronunciation Correction",
                "Instant Feedback",
                "Real-life Topic Conversations",
                "Personalized Learning",
                "Progress Tracking"
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[#14B8A6] text-[10px]">
                    ✓
                  </div>
                  <span className="text-teal-50 text-xs">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Link 
                to="/spokee"
                className="px-4 py-2 bg-white text-[#14B8A6] rounded-lg hover:bg-teal-50 transition text-sm font-semibold"
              >
                Start Conversation
              </Link>
              <Link 
                to="/spokee"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/20 transition text-sm font-semibold"
              >
                Watch Demo
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20">

              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-teal-200 rounded-lg flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-base font-bold">Spokee AI</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-teal-200 text-[10px]">Online</p>
                  </div>
                </div>
              </div>

              {/* Bubbles */}
              <div className="space-y-2">
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-[11px] text-white">
                    Hello! I'm Spokee. What would you like to practice today?
                  </p>
                </div>
                <div className="bg-white rounded-lg p-2 ml-4">
                  <p className="text-[11px] text-gray-700">
                    I want to practice introducing myself.
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-[11px] text-white">
                    Great! Let's begin. Tell me about yourself...
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-1">
                {["Voice Recognition", "Instant Feedback", "Tracking", "24/7"].map((f, i) => (
                  <span key={i} className="px-2 py-[2px] bg-white/20 text-white text-[9px] rounded border border-white/30">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating Icons */}
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-300 rounded-full text-[8px] flex items-center justify-center text-[#14B8A6] shadow">
              AI
            </div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full shadow flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpokeeSection;
