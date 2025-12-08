// client/src/components/common/Loader.jsx
import React from 'react';

const Loader = () => {
  const primaryColor = '#FD5A00';
  const logoUrl = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative">
        {/* Rotating border circle */}
        <div 
          className="absolute inset-0 rounded-full animate-spin" 
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: `4px solid ${primaryColor}`,
            opacity: 0.3,
          }}
        ></div>
        
        {/* Animated gradient ring */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse" 
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: `2px solid ${primaryColor}`,
            opacity: 0.5,
          }}
        ></div>

        {/* Company logo in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src={logoUrl} 
            alt="Tree Campus" 
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Loading text with color */}
      <p className="mt-8 text-gray-700 font-semibold text-lg">Loading...</p>
      <p 
        className="mt-2 text-sm font-medium" 
        style={{ color: primaryColor }}
      >
        Tree Campus
      </p>
    </div>
  );
};

export default Loader;

