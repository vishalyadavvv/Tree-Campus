// client/src/components/dashboard/Stats.jsx
import React from 'react';

const DashboardStats = ({ data }) => {
  const language = localStorage.getItem('preferredLanguage') || 'hindi';

  const stats = [
    {
      label: language === 'hindi' ? 'कोर्स पूर्ण' : 'Courses Completed',
      value: data?.coursesCompleted || 0,
      icon: '📚',
      color: 'from-green-400 to-green-600'
    },
    {
      label: language === 'hindi' ? 'पाठ पूर्ण' : 'Lessons Completed',
      value: data?.lessonsCompleted || 0,
      icon: '✅',
      color: 'from-blue-400 to-blue-600'
    },
    {
      label: language === 'hindi' ? 'क्विज पूर्ण' : 'Quizzes Completed',
      value: data?.quizzesCompleted || 0,
      icon: '🎯',
      color: 'from-purple-400 to-purple-600'
    },
    {
      label: language === 'hindi' ? 'सीखने का समय' : 'Learning Time',
      value: `${data?.totalWatchTime || 0}m`,
      icon: '⏱️',
      color: 'from-orange-400 to-orange-600'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}>
          <div className="text-4xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm opacity-90">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;