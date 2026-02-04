import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EnglishSpeaking = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
   const timer = setTimeout(() => {
  setIsLoading(false);
}, 1000); // or 1000, 2000, etc

    return () => clearTimeout(timer);
  }, []);

  // Course data with YouTube links
  const courses = [
    {
      title: "Spoken English Classes Online Free",
      videos: [
        { id: "Zas1PhDo174", title: "Basic English Conversation" },
        { id: "o_HteK3eklI", title: "English Pronunciation Guide" },
        { id: "2VIMWv1ZI2w", title: "Common English Phrases" }
      ]
    },
    {
      title: "Free English-Speaking Course",
      videos: [
        { id: "4qeTK_DTNbk", title: "Speaking Fluently" },
        { id: "uak7QtkIlqk", title: "Grammar Essentials" },
        { id: "siiLUgmqh1A", title: "Vocabulary Building" }
      ]
    },
    {
      title: "Best English-Speaking Course Online Free",
      videos: [
        { id: "2sk_kI_-r3k", title: "Advanced Conversation" },
        { id: "FnWWxPuGF9M", title: "Business English" },
        { id: "ciODDi6d2k8", title: "Interview Preparation" }
      ]
    },
    {
      title: "Free Spoken English Course",
      videos: [
        { id: "qdIzdvp2n8Y", title: "Daily Use Sentences" },
        { id: "RwceWU1MlyM", title: "Listening Practice" },
        { id: "E8-1yf76gTo", title: "Accent Training" }
      ]
    },
    {
      title: "Best English Learning App For Free",
      videos: [
        { id: "QcUcX01EcIc", title: "App Overview" },
        { id: "RwceWU1MlyM", title: "Practice Exercises" },
        { id: "5pYvg_c4Q74", title: "Progress Tracking" }
      ]
    }
  ];

  // Loading animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading English Courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header with background image */}
      <header 
        className="relative bg-cover bg-center py-20 md:py-28 px-4 text-white
        "
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')`
        }}
      >
        <div className="container mx-auto text-center">
          <Link to="/courses">
  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
    Free English Speaking Classes
  </h1>
</Link>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-up">
            Master English conversation with our curated collection of free video lessons
          </p>
         <Link to="/courses">
  <button className="bg-primary hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse-slow">
    Start Learning Now
  </button>
</Link>
        </div>
        
        {/* Animated floating elements */}
        <div className="absolute top-10 left-10 w-6 h-6 bg-primary rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-white rounded-full opacity-50 animate-ping"></div>
        <div className="absolute bottom-16 left-1/4 w-8 h-8 bg-primary rounded-full opacity-60 animate-pulse"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        {/* Course Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {courses.map((course, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === index 
                    ? 'bg-primary text-white shadow-md transform scale-105' 
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {course.title}
              </button>
            ))}
          </div>

          {/* Course Videos */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold p-6 bg-gradient-to-r from-primary to-orange-400 text-black">
              {courses[activeTab].title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {courses[activeTab].videos.map((video, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                >
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{video.title}</h3>
                    <button className="text-primary font-medium hover:text-orange-700 transition-colors flex items-center">
                      Watch Now
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Our Free English Courses?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Expert Instructors</h3>
              <p className="text-gray-600">Learn from certified English teachers with years of experience.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Flexible Learning</h3>
              <p className="text-gray-600">Study at your own pace, anytime and anywhere.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Community Support</h3>
              <p className="text-gray-600">Join thousands of learners in our supportive community.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
       <div className="bg-gradient-to-r from-primary to-orange rounded-2xl p-8 md:p-12 text-black text-center shadow-xl animate-pulse-slow">
  <h2 className="text-2xl md:text-4xl font-bold mb-4">
    Ready to Improve Your English?
  </h2>

  <p className="text-xl mb-8 max-w-2xl mx-auto">
    Join thousands of students who have transformed their English speaking skills with our free courses.
  </p>

  <Link to="/courses">
    <button className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
      Get Started Today
    </button>
  </Link>
</div>

      </main>

     

      {/* Custom CSS for animations */}
      <style>{`
        :root {
          --primary-color: #FD5A00;
        }
        
        .bg-primary {
          background-color: #FD5A00;
        }
        
        .text-primary {
          color: #FD5A00;
        }
        
        .border-primary {
          border-color: #FD5A00;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};

export default EnglishSpeaking;