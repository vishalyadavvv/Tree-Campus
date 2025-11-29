// client/src/components/dashboard/RecentActivity.jsx
import React from 'react';

const RecentActivity = ({ activities }) => {
  const language = localStorage.getItem('preferredLanguage') || 'hindi';

  const activityIcons = {
    lesson: '📖',
    quiz: '📝',
    game: '🎮',
    certificate: '🏆'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {language === 'hindi' ? 'हाल की गतिविधि' : 'Recent Activity'}
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="flex-shrink-0 text-2xl">
              {activityIcons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.title}
              </p>
              {activity.score && (
                <p className="text-sm text-green-600">
                  {language === 'hindi' ? 'स्कोर' : 'Score'}: {activity.score}
                </p>
              )}
              <p className="text-xs text-gray-500">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;