import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Video, Youtube, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api'; // Adjust path based on your project structure

const LiveClasses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [classes, setClasses] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger header animation
    setIsVisible(true);
    fetchLiveClasses();

    // Update current time every minute to refresh "Live" status
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Fetching live classes from API...');
      const response = await api.get('/live-classes');
      console.log('✅ API Response:', response.data);

      // Handle different response structures
      let classesData = [];
      
      if (Array.isArray(response.data)) {
        classesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        classesData = response.data.data;
      } else if (response.data.liveClasses && Array.isArray(response.data.liveClasses)) {
        classesData = response.data.liveClasses;
      } else if (response.data.data?.liveClasses && Array.isArray(response.data.data.liveClasses)) {
        classesData = response.data.data.liveClasses;
      } else {
        console.warn('⚠️ Unexpected API response structure:', response.data);
      }

      // Filter upcoming & live classes (show until they end)
      const now = new Date();
      
      const upcoming = classesData.filter(liveClass => {
        const classDate = new Date(liveClass.scheduledAt);
        const durationMinutes = liveClass.duration || 60;
        const endDate = new Date(classDate.getTime() + durationMinutes * 60000);
        
        // Show if explicitly marked live OR if the scheduled time hasn't passed the end time
        return liveClass.status === 'live' || endDate > now;
      }).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

      const past = classesData.filter(liveClass => {
        const classDate = new Date(liveClass.scheduledAt);
        const durationMinutes = liveClass.duration || 60;
        const endDate = new Date(classDate.getTime() + durationMinutes * 60000);
        
        // Show if status explicitly not live AND end time has passed
        return liveClass.status !== 'live' && endDate <= now;
      }).sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)); // Past classes: newest first

      console.log('📊 Classes:', { upcoming, past });
      setClasses({ upcoming, past });

      // Stagger card animations
      setTimeout(() => {
        upcoming.concat(past).forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => [...prev, index]);
          }, 200 + (index * 100));
        });
      }, 300);

    } catch (error) {
      console.error('❌ Error fetching live classes:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load live classes');
      setClasses({ upcoming: [], past: [] });
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'All Levels': return 'bg-green-100 text-green-700';
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-blue-100 text-blue-700';
      case 'Advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = currentTime;
    
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
    
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.getDate() === tomorrow.getDate() && 
                       date.getMonth() === tomorrow.getMonth() && 
                       date.getFullYear() === tomorrow.getFullYear();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const isLiveNow = (scheduledAt, duration) => {
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + (duration || 60) * 60000);
    return currentTime >= start && currentTime <= end;
  };

  const getDurationText = (duration) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${duration}m`;
  };

  const joinClass = (classItem) => {
    if (classItem.platform === 'Zoom' && classItem.source === 'automated' && classItem._id) {
      navigate(`/live-classes/join/${classItem._id}`);
    } else if (classItem.link) {
      window.open(classItem.link, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No class link available');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#FD5B00]" />
          <p className="mt-4 text-gray-600 text-lg">Loading live classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Classes</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchLiveClasses}
            className="px-6 py-3 bg-[#FD5B00] text-white rounded-lg hover:bg-[#e55200] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayedClasses = classes[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-orange-200/50 py-12 mb-8 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#FD5A00] text-center drop-shadow-sm">
            Live Classes
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">

        {/* Tab Navigation & Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              {activeTab === 'upcoming' ? 'Upcoming Classes' : 'Past Classes'}
            </h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {displayedClasses.length} {displayedClasses.length === 1 ? 'class' : 'classes'} {activeTab === 'upcoming' ? 'scheduled' : 'completed'}
            </p>
          </div>
          
          <div className="mt-3 md:mt-0 bg-gray-100 p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'upcoming' 
                  ? 'bg-white text-[#FD5B00] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'past' 
                  ? 'bg-white text-[#FD5B00] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past Classes
            </button>
          </div>
        </div>

        {/* Loading/Error/Empty States */}
        {displayedClasses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {activeTab} Classes</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {activeTab === 'upcoming' 
                ? 'Check back soon for new live class schedules' 
                : 'No history of completed classes yet'
              }
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={fetchLiveClasses}
                className="px-6 py-3 bg-[#FD5B00] text-white rounded-lg hover:bg-[#e55200] transition-colors cursor-pointer"
              >
                Check Again
              </button>
            )}
          </div>
        ) : (
          /* Classes Grid - OPTIMIZED FOR MOBILE */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {displayedClasses.map((classItem, index) => (
              <div 
                key={classItem._id || classItem.id} 
                className={`bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 ${
                  visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r p-3 md:p-6 ${activeTab === 'upcoming' ? 'from-[#FD5B00] to-[#ff7a33]' : 'from-gray-600 to-gray-500'}`}>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center border-2 md:border-4 border-white shadow-lg">
                      {classItem.instructorImage ? (
                        <img
                          src={classItem.instructorImage}
                          alt={classItem.instructor}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className={`w-5 h-5 md:w-8 md:h-8 ${activeTab === 'upcoming' ? 'text-[#FD5B00]' : 'text-gray-600'}`} />
                      )}
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-sm md:text-lg">{classItem.instructor}</h3>
                      <div className="flex items-center text-xs md:text-sm opacity-90">
                        {classItem.platform === 'Zoom' ? (
                          <Video className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        ) : (
                          <Youtube className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        )}
                        {classItem.platform || 'Live Session'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 md:p-6">
                  <h4 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-4 line-clamp-2">
                    {classItem.title}
                    {activeTab === 'upcoming' && isLiveNow(classItem.scheduledAt, classItem.duration) && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                        <span className="w-2 h-2 mr-1 bg-red-600 rounded-full"></span>
                        LIVE
                      </span>
                    )}
                  </h4>

                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className={`w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 ${activeTab === 'upcoming' ? 'text-[#FD5B00]' : 'text-gray-500'}`} />
                      <span className="text-xs md:text-sm font-medium">
                        {formatDate(classItem.scheduledAt)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className={`w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 ${activeTab === 'upcoming' ? 'text-[#FD5B00]' : 'text-gray-500'}`} />
                      <span className="text-xs md:text-sm font-medium">
                        {getDurationText(classItem.duration || 60)}
                      </span>
                    </div>

                    {/* Password display: Only show for upcoming */}
                    {activeTab === 'upcoming' && classItem.platform === 'Zoom' && classItem.password && (
                      <div className="flex items-center text-gray-600 bg-orange-50 p-1.5 md:p-2 rounded-lg border border-orange-100">
                        <div className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex items-center justify-center font-bold text-[10px] md:text-xs text-[#FD5B00] border border-[#FD5B00] rounded-sm">P</div>
                        <span className="text-xs md:text-sm">
                          Password: <span className="font-mono font-bold text-gray-900">{classItem.password}</span>
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`px-2 md:px-3 py-0.5 md:py-1 ${getLevelColor(classItem.level || 'Beginner')} rounded-full text-[10px] md:text-xs font-semibold`}>
                        {classItem.level || 'All Levels'}
                      </span>
                    </div>
                    {classItem.description && (
                      <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mt-1">
                        {classItem.description}
                      </p>
                    )}
                  </div>

                  {activeTab === 'upcoming' ? (
                    (() => {
                      const isLive = isLiveNow(classItem.scheduledAt, classItem.duration);
                      return (
                        <button 
                          onClick={() => joinClass(classItem)}
                          className={`w-full py-2.5 md:py-3 text-white rounded-lg md:rounded-xl transition-all duration-300 font-bold text-sm md:text-lg shadow-md hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                            isLive 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 animate-pulse ring-4 ring-green-100' 
                              : 'bg-gradient-to-r from-[#FD5B00] to-[#ff7a33] hover:from-[#e55200] hover:to-[#ff6b1f]'
                          }`}
                          disabled={!classItem.link && !classItem.meetingId}
                        >
                          {isLive ? 'JOIN LIVE NOW' : (classItem.link || classItem.meetingId) ? 'Join Class' : 'Link Coming Soon'}
                        </button>
                      );
                    })()
                  ) : (
                    <button 
                      className="w-full py-2.5 md:py-3 bg-gray-100 text-gray-500 rounded-lg md:rounded-xl cursor-not-allowed font-medium text-sm md:text-lg border border-gray-200"
                      disabled
                    >
                      Class Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default LiveClasses;