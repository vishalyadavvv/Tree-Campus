// client/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const language = localStorage.getItem('preferredLanguage') || 'hindi';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {language === 'hindi' ? 'पेज नहीं मिला' : 'Page Not Found'}
        </h2>
        <p className="text-gray-600 mb-8">
          {language === 'hindi' 
            ? 'क्षमा करें, आप जिस पेज को ढूंढ रहे हैं वह मौजूद नहीं है।'
            : 'Sorry, the page you are looking for does not exist.'}
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          {language === 'hindi' ? 'होम पर जाएं' : 'Go to Home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
