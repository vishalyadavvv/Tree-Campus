import React from 'react';
import { Link } from 'react-router-dom';

const AIFloatingButton = () => {
  return (
    <div className="fixed bottom-32 right-6 z-[100] flex items-center justify-end">
      <Link
        to="/ai-teacher"
        className="peer w-10 h-10 md:w-14 md:h-14 bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        
        {/* Icon/Avatar Placeholder - Using a friendly Robot/Teacher icon */}
        <span className="text-xl md:text-3xl transform hover:rotate-12 transition-transform duration-300">👩‍🏫</span>
        
        {/* Badge */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </Link>

      {/* Label - Absolute positioned to the left of the icon, only shows when icon (peer) is hovered */}
      <div className="absolute right-full mr-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl border border-blue-100 opacity-0 peer-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap transform translate-x-4 peer-hover:translate-x-0">
        <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Talk to AI Teacher
        </p>
      </div>
    </div>
  );
};

export default AIFloatingButton;
