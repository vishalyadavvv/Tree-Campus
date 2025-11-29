// client/src/components/dashboard/ProgressChart.jsx
import React from 'react';

const ProgressChart = ({ weeklyData }) => {
  const language = localStorage.getItem('preferredLanguage') || 'hindi';
  const days = language === 'hindi' 
    ? ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const maxValue = Math.max(...weeklyData);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {language === 'hindi' ? 'साप्ताहिक प्रगति' : 'Weekly Progress'}
      </h3>
      <div className="flex items-end justify-between h-64 space-x-2">
        {weeklyData.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-blue-500 rounded-t-lg transition-all duration-500"
                style={{ height: `${(value / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold">
                  {value}%
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
