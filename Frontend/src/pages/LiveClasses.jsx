import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, Youtube } from 'lucide-react';

const LiveClasses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    // Trigger header animation
    setIsVisible(true);
    
    // Stagger card animations
    upcomingClasses.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, 200 + (index * 100));
    });
  }, []);

  const upcomingClasses = [
    {
      id: 1,
      title: 'Daily Conversation Practice',
      teacher: 'Priya Sharma',
      date: 'Today, 6:00 PM',
      duration: '60 min',
      students: 45,
      level: 'Beginner',
      platform: 'Zoom',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      title: 'Grammar Workshop',
      teacher: 'Rahul Kumar',
      date: 'Tomorrow, 7:00 PM',
      duration: '45 min',
      students: 38,
      level: 'Intermediate',
      platform: 'YouTube Live',
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      title: 'Business English',
      teacher: 'Anjali Verma',
      date: 'Dec 25, 5:00 PM',
      duration: '90 min',
      students: 52,
      level: 'Advanced',
      platform: 'Zoom',
      image: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: 4,
      title: 'Pronunciation Masterclass',
      teacher: 'Vikram Singh',
      date: 'Dec 26, 4:00 PM',
      duration: '75 min',
      students: 41,
      level: 'Intermediate',
      platform: 'YouTube Live',
      image: 'https://i.pravatar.cc/150?img=4'
    },
    {
      id: 5,
      title: 'IELTS Preparation',
      teacher: 'Neha Patel',
      date: 'Dec 27, 8:00 PM',
      duration: '120 min',
      students: 67,
      level: 'Advanced',
      platform: 'Zoom',
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 6,
      title: 'Vocabulary Building',
      teacher: 'Amit Joshi',
      date: 'Dec 28, 6:30 PM',
      duration: '50 min',
      students: 55,
      level: 'Beginner',
      platform: 'YouTube Live',
      image: 'https://i.pravatar.cc/150?img=6'
    }
  ];

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-blue-100 text-blue-700';
      case 'Advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Background Image */}
      <div 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D')`,
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FD5A00]/25 to-orange-600/95"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className={`flex items-center justify-center mb-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <Video className="w-12 h-12 mr-4 text-white" />
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 text-center text-white transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Live Classes
          </h1>
          <p className={`text-xl md:text-2xl text-white font-extrabold text-center max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Learn live with expert teachers and join thousands of students
          </p>
        </div>
      </div>

      {/* Rest of your existing code remains the same */}
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
                  <p className="text-gray-700">Click the "Join Class" button</p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FD5B00] font-bold mr-3 text-lg">3.</span>
                  <p className="text-gray-700">You'll be redirected to Zoom or YouTube</p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FD5B00] font-bold mr-3 text-lg">4.</span>
                  <p className="text-gray-700">All classes are completely FREE!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes Header */}
        <div className={`flex items-center justify-between mb-8 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900">
            Upcoming Classes
          </h2>
          <div className="flex items-center space-x-2 text-[#FD5B00]">
            <Calendar className="w-6 h-6" />
            <span className="font-semibold">This Week</span>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingClasses.map((classItem, index) => (
            <div 
              key={classItem.id} 
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 ${
                visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#FD5B00] to-[#ff7a33] p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={classItem.image}
                    alt={classItem.teacher}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="text-white">
                    <h3 className="font-bold text-lg">{classItem.teacher}</h3>
                    <div className="flex items-center text-sm text-orange-100">
                      {classItem.platform === 'Zoom' ? (
                        <Video className="w-4 h-4 mr-1" />
                      ) : (
                        <Youtube className="w-4 h-4 mr-1" />
                      )}
                      {classItem.platform}
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
                    <span className="text-sm font-medium">{classItem.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-[#FD5B00]" />
                    <span className="text-sm font-medium">{classItem.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 ${getLevelColor(classItem.level)} rounded-full text-xs font-semibold`}>
                      {classItem.level}
                    </span>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-[#FD5B00]" />
                      <span className="text-sm font-medium">{classItem.students} students</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-[#FD5B00] to-[#ff7a33] text-white rounded-xl hover:from-[#e55200] hover:to-[#ff6b1f] transition-all duration-300 font-bold text-lg shadow-md hover:shadow-xl transform hover:scale-105">
                  Join Class
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 bg-gradient-to-r from-[#FD5B00] to-[#ff7a33] rounded-2xl p-8 text-center text-white shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-3xl font-bold mb-4">Can't find the right class?</h3>
          <p className="text-lg text-orange-100 mb-6">
            Request a custom class topic and we'll schedule it for you!
          </p>
          <button className="px-8 py-3 bg-white text-[#FD5B00] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105">
            Request a Class
          </button>
        </div>
      </div>
    </div>
  );}

export default LiveClasses;