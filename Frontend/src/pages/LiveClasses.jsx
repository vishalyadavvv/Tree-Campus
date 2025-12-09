import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, Youtube, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api'; // Adjust path based on your project structure

const LiveClasses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Trigger header animation
    setIsVisible(true);
    fetchLiveClasses();
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

      // Filter upcoming classes (scheduled in the future)
      const now = new Date();
      const upcoming = classesData.filter(liveClass => {
        const classDate = new Date(liveClass.scheduledAt);
        return classDate > now;
      }).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

      console.log('📊 Upcoming classes:', upcoming);
      setUpcomingClasses(upcoming);

      // Stagger card animations
      setTimeout(() => {
        upcoming.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => [...prev, index]);
          }, 200 + (index * 100));
        });
      }, 300);

    } catch (error) {
      console.error('❌ Error fetching live classes:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load live classes');
      setUpcomingClasses([]);
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
    const now = new Date();
    const diffTime = Math.abs(date - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
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

  const getDurationText = (duration) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${duration}m`;
  };

  const joinClass = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Background Image */}
      <div 
        className="relative py-20 bg-cover bg-center md:py-28 px-4 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D')`,
        }}
      >
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className={`flex items-center justify-center mb-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <Video className="w-12 h-12 mr-4 text-white" />
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 text-center text-white transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Live Classes
          </h1>
          <p className={`text-xl md:text-2xl text-white font-extrabold text-center max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {upcomingClasses.length > 0 
              ? `Join ${upcomingClasses.length} upcoming live sessions with expert instructors`
              : 'Connect with expert teachers in real-time interactive sessions'
            }
          </p>
          <div className={`text-center mt-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={fetchLiveClasses}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Loader2 className="w-5 h-5 mr-2" />
              Refresh Classes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <div className={`bg-white border-2 border-[#FD5B00] rounded-2xl p-8 mb-12 shadow-lg transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#FD5B00] rounded-full flex items-center justify-center">
                <span className="text-2xl">📺</span>
              </div>
            </div>
            <div className="ml-6 flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How to Join Live Classes
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <span className="text-[#FD5B00] font-bold mr-3 text-lg">1.</span>
                  <p className="text-gray-700">Choose your preferred class from the list below</p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FD5B00] font-bold mr-3 text-lg">2.</span>
                  <p className="text-gray-700">Click the "Join Class" button before the start time</p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FD5B00] font-bold mr-3 text-lg">3.</span>
                  <p className="text-gray-700">You'll be redirected to the meeting platform</p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FD5B00] font-bold mr-3 text-lg">4.</span>
                  <p className="text-gray-700">All classes are interactive and FREE!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between mb-8 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Upcoming Classes
            </h2>
            <p className="text-gray-600 mt-2">
              {upcomingClasses.length} {upcomingClasses.length === 1 ? 'class' : 'classes'} scheduled
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[#FD5B00] mt-4 md:mt-0">
            <Calendar className="w-6 h-6" />
            <span className="font-semibold">Live Sessions</span>
          </div>
        </div>

        {/* Loading/Error/Empty States */}
        {upcomingClasses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Classes</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Check back soon for new live class schedules
            </p>
            <button
              onClick={fetchLiveClasses}
              className="px-6 py-3 bg-[#FD5B00] text-white rounded-lg hover:bg-[#e55200] transition-colors"
            >
              Check Again
            </button>
          </div>
        ) : (
          /* Classes Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingClasses.map((classItem, index) => (
              <div 
                key={classItem._id || classItem.id} 
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 ${
                  visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#FD5B00] to-[#ff7a33] p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                      {classItem.instructorImage ? (
                        <img
                          src={classItem.instructorImage}
                          alt={classItem.instructor}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 text-[#FD5B00]" />
                      )}
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-lg">{classItem.instructor}</h3>
                      <div className="flex items-center text-sm text-orange-100">
                        {classItem.platform === 'Zoom' ? (
                          <Video className="w-4 h-4 mr-1" />
                        ) : (
                          <Youtube className="w-4 h-4 mr-1" />
                        )}
                        {classItem.platform || 'Live Session'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {classItem.title}
                  </h4>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-[#FD5B00]" />
                      <span className="text-sm font-medium">
                        {formatDate(classItem.scheduledAt)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-[#FD5B00]" />
                      <span className="text-sm font-medium">
                        {getDurationText(classItem.duration || 60)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 ${getLevelColor(classItem.level || 'Beginner')} rounded-full text-xs font-semibold`}>
                        {classItem.level || 'All Levels'}
                      </span>
                      {classItem.maxParticipants && (
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-[#FD5B00]" />
                          <span className="text-sm font-medium">
                            Max: {classItem.maxParticipants}
                          </span>
                        </div>
                      )}
                    </div>
                    {classItem.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {classItem.description}
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={() => joinClass(classItem.link)}
                    className="w-full py-3 bg-gradient-to-r from-[#FD5B00] to-[#ff7a33] text-white rounded-xl hover:from-[#e55200] hover:to-[#ff6b1f] transition-all duration-300 font-bold text-lg shadow-md hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!classItem.link}
                  >
                    {classItem.link ? 'Join Class' : 'Link Coming Soon'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {upcomingClasses.length > 0 && (
          <div className={`mt-16 bg-gradient-to-r from-[#FD5B00] to-[#ff7a33] rounded-2xl p-8 text-center text-white shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-3xl font-bold mb-4">Want More Classes?</h3>
            <p className="text-lg text-orange-100 mb-6">
              Suggest topics or request specific classes and we'll schedule them for you!
            </p>
            <button className="px-8 py-3 bg-white text-[#FD5B00] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105">
              Request a Class
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClasses;