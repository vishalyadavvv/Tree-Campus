import React, { useState, useEffect } from 'react';
import { Play, ChevronDown, ChevronRight, Lock, CheckCircle, Clock, BookOpen, Home, Menu, X } from 'lucide-react';

// STEP 1: Save this as 'courseData.js' in the same folder as your component
// Then import it: import { courseData } from './courseData';

const courseData = {
  courseInfo: {
    title: '30-Day English Speaking Course',
    totalSections: 30,
    totalLessons: 148,
    description: 'Master English in 30 days with structured lessons'
  },
  sections: [
    {
      id: 1,
      dayNumber: 1,
      title: 'परिचय + अभिवादन',
      titleEn: 'Introduction + Greetings',
      lessons: [
        { id: 1, title: 'Introduction', duration: '10:30', videoId: 'dQw4w9WgXcQ' },
        { id: 2, title: 'Greeting Part 1', duration: '8:45', videoId: 'dQw4w9WgXcQ' },
        { id: 3, title: 'Greeting Part 2', duration: '9:15', videoId: 'dQw4w9WgXcQ' },
        { id: 4, title: 'Synopsis', duration: '5:20', videoId: 'dQw4w9WgXcQ' },
        { id: 5, title: 'Word of the Day', duration: '3:10', videoId: 'dQw4w9WgXcQ' },
        { id: 6, title: 'Introduction Practice', duration: '12:00', videoId: 'dQw4w9WgXcQ' },
        { id: 7, title: 'Greetings Practice', duration: '7:30', videoId: 'dQw4w9WgXcQ' },
        { id: 8, title: 'Quiz – Day 1', duration: '15:00', type: 'quiz' }
      ]
    },
    {
      id: 2,
      dayNumber: 2,
      title: 'भाषा के भाग और इसका महत्व + बातचीत',
      titleEn: 'Parts of Speech & Conversation',
      lessons: [
        { id: 9, title: 'Parts of Speech', duration: '15:20', videoId: 'dQw4w9WgXcQ' },
        { id: 10, title: 'Conversation', duration: '10:30', videoId: 'dQw4w9WgXcQ' },
        { id: 11, title: 'Word of the Day', duration: '3:45', videoId: 'dQw4w9WgXcQ' },
        { id: 12, title: 'Parts of Speech Importance', duration: '12:15', videoId: 'dQw4w9WgXcQ' },
        { id: 13, title: 'Use in Conversations', duration: '14:00', videoId: 'dQw4w9WgXcQ' },
        { id: 14, title: 'Quiz – Day 2', duration: '20:00', type: 'quiz' }
      ]
    },
    {
      id: 3,
      dayNumber: 3,
      title: 'वाक्य और उसके प्रकार + वास्तविक जीवन',
      titleEn: 'Sentences & Types + Real-life',
      lessons: [
        { id: 15, title: 'Sentences and Types', duration: '13:30', videoId: 'dQw4w9WgXcQ' },
        { id: 16, title: 'Synopsis of Types', duration: '8:20', videoId: 'dQw4w9WgXcQ' },
        { id: 17, title: 'Word of the Day', duration: '3:10', videoId: 'dQw4w9WgXcQ' },
        { id: 18, title: 'Sentence Types Explained', duration: '11:45', videoId: 'dQw4w9WgXcQ' },
        { id: 19, title: 'Real-life Application', duration: '9:30', videoId: 'dQw4w9WgXcQ' },
        { id: 20, title: 'Quiz – Day 3', duration: '10:00', type: 'quiz' }
      ]
    },
    {
      id: 4,
      dayNumber: 4,
      title: 'प्रयोग इस/एम/आर + नाउन',
      titleEn: 'Use of Is/Am/Are + Noun',
      lessons: [
        { id: 21, title: 'Is/Am/Are Introduction', duration: '12:30', videoId: 'dQw4w9WgXcQ' },
        { id: 22, title: 'Noun', duration: '10:45', videoId: 'dQw4w9WgXcQ' },
        { id: 23, title: 'Synopsis Is/Am/Are', duration: '8:20', videoId: 'dQw4w9WgXcQ' },
        { id: 24, title: 'Noun Synopsis', duration: '7:15', videoId: 'dQw4w9WgXcQ' },
        { id: 25, title: 'Word of the Day', duration: '3:10', videoId: 'dQw4w9WgXcQ' },
        { id: 26, title: 'Use of Is/Am/Are', duration: '14:00', videoId: 'dQw4w9WgXcQ' },
        { id: 27, title: 'Noun Practice', duration: '11:30', videoId: 'dQw4w9WgXcQ' },
        { id: 28, title: 'Quiz – Day 4', duration: '15:00', type: 'quiz' }
      ]
    },
    {
      id: 5,
      dayNumber: 5,
      title: 'काउंटेबल व अनकाउंटेबल + प्रोनाउन',
      titleEn: 'Countable & Uncountable + Pronouns',
      lessons: [
        { id: 29, title: 'Countable Noun Part 1', duration: '14:20', videoId: 'dQw4w9WgXcQ' },
        { id: 30, title: 'Countable Noun Part 2', duration: '12:30', videoId: 'dQw4w9WgXcQ' },
        { id: 31, title: 'Pronoun', duration: '10:45', videoId: 'dQw4w9WgXcQ' },
        { id: 32, title: 'Singular & Plural Pronoun', duration: '9:20', videoId: 'dQw4w9WgXcQ' },
        { id: 33, title: 'Word of the Day', duration: '3:10', videoId: 'dQw4w9WgXcQ' },
        { id: 34, title: 'Countable Practice', duration: '13:00', videoId: 'dQw4w9WgXcQ' },
        { id: 35, title: 'Pronouns Practice', duration: '11:30', videoId: 'dQw4w9WgXcQ' },
        { id: 36, title: 'Quiz – Day 5', duration: '15:00', type: 'quiz' }
      ]
    }
  ]
};

const VideoPlayer = ({ videoId, title }) => {
  if (!videoId) {
    return (
      <div className="relative w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ paddingBottom: '56.25%', minHeight: '400px' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600">Video content coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const LessonItem = ({ lesson, isActive, onClick, isLocked }) => {
  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={`p-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-orange-50 border-l-4 border-[#FD5A00]' 
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 flex-shrink-0 ${isActive ? 'text-[#FD5A00]' : 'text-gray-400'}`}>
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : lesson.type === 'quiz' ? (
            <div className="w-4 h-4 border-2 border-current rounded flex items-center justify-center text-xs">?</div>
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${isActive ? 'text-[#FD5A00]' : 'text-gray-900'}`}>
            {lesson.title}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{lesson.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionAccordion = ({ section, expandedSections, toggleSection, activeLesson, setActiveLesson }) => {
  const isExpanded = expandedSections.includes(section.id);
  const totalLessons = section.lessons.length;

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleSection(section.id)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#FD5A00] bg-orange-50 px-2 py-1 rounded">
              Day {section.dayNumber}
            </span>
          </div>
          <div className="font-semibold text-gray-900 mt-2">{section.titleEn}</div>
          <div className="text-xs text-gray-500 mt-1">{section.title}</div>
          <div className="text-xs text-gray-500 mt-1">
            {totalLessons} lessons
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="pb-2 px-2 space-y-1 bg-gray-50">
          {section.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isActive={activeLesson?.id === lesson.id}
              onClick={() => setActiveLesson(lesson)}
              isLocked={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function EnglishCoursePlatform() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState([1]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (courseData.sections.length > 0 && courseData.sections[0].lessons.length > 0) {
      setActiveLesson(courseData.sections[0].lessons[0]);
    }
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const findAdjacentLesson = (direction) => {
    let allLessons = [];
    courseData.sections.forEach(section => {
      allLessons.push(...section.lessons);
    });
    
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
    if (direction === 'next' && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    } else if (direction === 'prev' && currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  };

  const goToNextLesson = () => {
    const next = findAdjacentLesson('next');
    if (next) setActiveLesson(next);
  };

  const goToPrevLesson = () => {
    const prev = findAdjacentLesson('prev');
    if (prev) setActiveLesson(prev);
  };

  if (!activeLesson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FD5A00]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FD5A00] to-orange-600 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Back to courses"
            >
              <Home className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{courseData.courseInfo.title}</h1>
              <p className="text-xs sm:text-sm text-orange-100 mt-0.5">
                {courseData.courseInfo.totalSections} Sections • {courseData.courseInfo.totalLessons} Lessons
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex relative">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out
        fixed lg:sticky top-[73px] left-0 w-80 lg:w-96 bg-white border-r border-gray-200 
        h-[calc(100vh-73px)] overflow-y-auto z-20 shadow-xl lg:shadow-none`}>
          
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 sticky top-0 z-10">
            <h2 className="font-bold text-lg text-gray-900">Course Syllabus</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track your progress through the course
            </p>
          </div>
          
          <div>
            {courseData.sections.map((section) => (
              <SectionAccordion
                key={section.id}
                section={section}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                activeLesson={activeLesson}
                setActiveLesson={setActiveLesson}
              />
            ))}
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-10 top-[73px]"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto h-[calc(100vh-73px)]">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              {/* Lesson Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {activeLesson.type === 'quiz' && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      📝 Quiz
                    </span>
                  )}
                  {!activeLesson.type && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      🎥 Video Lesson
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{activeLesson.duration}</span>
                  </div>
                </div>
              </div>

              {/* Video Player or Quiz */}
              {activeLesson.type === 'quiz' ? (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Time!</h3>
                  <p className="text-gray-600 mb-6">Test your knowledge from this section</p>
                  <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg">
                    Start Quiz
                  </button>
                </div>
              ) : (
                <VideoPlayer videoId={activeLesson.videoId} title={activeLesson.title} />
              )}

              {/* Lesson Navigation */}
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={goToPrevLesson}
                  disabled={!findAdjacentLesson('prev')}
                  className="flex-1 px-4 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button 
                  onClick={goToNextLesson}
                  disabled={!findAdjacentLesson('next')}
                  className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-[#FD5A00] to-orange-500 text-white rounded-lg hover:from-orange-600 hover:to-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Next →
                </button>
              </div>

              {/* Lesson Info */}
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#FD5A00]" />
                  About this lesson
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  This lesson is part of the comprehensive 30-day English speaking course. 
                  Complete all lessons in sequence to build a strong foundation in English communication.
                  Each video includes practical examples and real-life applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}