import React from 'react';
import { Link } from 'react-router-dom';

const AIFloatingButton = () => {
  return (
    <div className="fixed bottom-32 right-6 z-[100] flex items-center gap-3 group">
      {/* Label - Shows on hover and non-clickable as per user preference */}
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl border border-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pointer-events-none">
        <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
          Talk to AI Teacher
        </p>
      </div>

      <Link
        to="/ai-teacher"
        className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        
        {/* Icon/Avatar Placeholder - Using a friendly Robot/Teacher icon */}
        <span className="text-xl md:text-3xl transform group-hover:rotate-12 transition-transform duration-300">👩‍🏫</span>
        
        {/* Badge */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </Link>
    </div>
  );
};

export default AIFloatingButton;
