// client/src/components/common/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
};

export default Loader;

