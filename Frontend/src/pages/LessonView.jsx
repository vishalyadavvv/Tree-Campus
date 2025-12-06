import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FiCheck, FiChevronLeft, FiChevronRight, FiMenu, FiX, FiClock, FiBookOpen, FiChevronDown } from 'react-icons/fi';

const PopupMessage = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [sectionsWithLessons, setSectionsWithLessons] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [popupMessage, setPopupMessage] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchLessonData();
    setSidebarOpen(false);
    
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lessonId]);

  const showPopupMessage = (title, message) => {
    setPopupMessage({ isOpen: true, title, message });
  };

  const fetchLessonData = async (skipLoading = false) => {
    try {
      if (!skipLoading) {
        setLoading(true);
      }
      
      // Fetch course details
      const courseRes = await api.get(`/courses/${courseId}`);
      setCourseName(courseRes.data.data.title);
      
      // Fetch sections and lessons
      const sectionsRes = await api.get(`/courses/${courseId}/sections`);
      const sections = sectionsRes.data.data;
      
      // Fetch progress
      const progressRes = await api.get(`/progress/course/${courseId}`);
      const progressData = progressRes.data.data;
      const lessonsFromProgress = progressData.lessons || [];
      
      // Create completion map
      const completionMap = new Map();
      lessonsFromProgress.forEach(pl => {
        completionMap.set(String(pl._id), pl.isCompleted);
      });
      
      // Fetch lessons for each section and build structured data
      let allCourseLessons = [];
      const sectionsData = [];
      let currentLessonSectionId = null;
      
      for (const section of sections) {
        const lessonsRes = await api.get(`/courses/sections/${section._id}/lessons`);
        const sectionLessons = lessonsRes.data.data.map(lesson => ({
          ...lesson,
          sectionId: section._id,
          sectionTitle: section.title,
          isCompleted: completionMap.get(String(lesson._id)) || false
        }));
        
        allCourseLessons = [...allCourseLessons, ...sectionLessons];
        
        // Check if current lesson is in this section
        if (sectionLessons.some(l => l._id === lessonId)) {
          currentLessonSectionId = section._id;
        }
        
        // Calculate section progress
        const completedInSection = sectionLessons.filter(l => l.isCompleted).length;
        
        sectionsData.push({
          _id: section._id,
          title: section.title,
          lessons: sectionLessons,
          totalLessons: sectionLessons.length,
          completedLessons: completedInSection
        });
      }
      
      // Auto-expand the section containing the current lesson
      const initialExpanded = {};
      if (currentLessonSectionId) {
        initialExpanded[currentLessonSectionId] = true;
      }
      
      setSectionsWithLessons(sectionsData);
      setExpandedSections(initialExpanded);
      setAllLessons(allCourseLessons);
      const currentLesson = allCourseLessons.find(l => l._id === lessonId);
      setLesson(currentLesson);
      setProgress(progressData);

    } catch (error) {
      console.error('Error fetching lesson data:', error);
      showPopupMessage('Error', 'Failed to load lesson data');
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    try {
      await api.post(`/progress/lesson/${lessonId}/complete`);
      fetchLessonData(true);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      showPopupMessage('Error', 'Unable to mark lesson as complete. Please try again.');
    }
  };

  const markCourseAsComplete = async () => {
    try {
      await api.post(`/progress/course/${courseId}/complete`);
      fetchLessonData();
    } catch (error) {
      console.error('Error marking course complete:', error);
      showPopupMessage('Error', 'Failed to mark course as complete');
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return '';
    }
  };

  const getVimeoEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    } catch (error) {
      console.error('Error parsing Vimeo URL:', error);
      return '';
    }
  };

  const isYouTube = (url) => url?.includes('youtube.com') || url?.includes('youtu.be');
  const isVimeo = (url) => url?.includes('vimeo.com');

  const currentIndex = allLessons.findIndex(l => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCompleted = allLessons.find(l => l._id === lessonId)?.isCompleted || false;
  const isCourseCompleted = progress?.progress === 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <svg className="h-12 w-12 text-orange-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
          <p className="text-gray-600 mb-4 text-sm">
            The lesson you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <FiChevronLeft className="mr-2" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PopupMessage
        isOpen={popupMessage.isOpen}
        onClose={() => setPopupMessage({ ...popupMessage, isOpen: false })}
        title={popupMessage.title}
        message={popupMessage.message}
      />

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <Link 
          to={`/courses/${courseId}`}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Exit Lesson
        </Link>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar with Back to Course */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Link 
                to={`/courses/${courseId}`}
                className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                <FiChevronLeft className="mr-1" size={16} />
                Back to Course
              </Link>
              <div className="hidden lg:flex items-center space-x-2">
                <span className="text-xs text-gray-500">Progress:</span>
                <span className="text-sm font-bold text-orange-600">{progress?.progress || 0}%</span>
              </div>
            </div>
          </div>

          {/* Video Player - Reduced height */}
          <div className="bg-white overflow-hidden" style={{ height: '90vh' }}>
            {lesson?.videoUrl ? (
              <div className="w-full h-full max-w-4xl mx-auto px-4 py-4">
                <iframe
                  className="w-full h-full rounded-lg shadow-lg"
                  src={
                    isYouTube(lesson.videoUrl) 
                      ? getYouTubeEmbedUrl(lesson.videoUrl)
                      : isVimeo(lesson.videoUrl)
                      ? getVimeoEmbedUrl(lesson.videoUrl)
                      : lesson.videoUrl
                  }
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-400">
                  <FiBookOpen size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No video available</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Details - Fixed content with proper spacing */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200">
            <div className="p-4 lg:p-6 max-w-4xl mx-auto">
              {/* Course and Section Info */}
              <div className="space-y-1">
                <h2 className="text-base font-medium text-gray-600">
                  {courseName}
                </h2>
                
                {lesson?.sectionTitle && (
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                    {lesson.sectionTitle}
                  </h3>
                )}
              </div>

              {/* Lesson Title */}
              <div className="mt-3">
                <h1 className="text-base lg:text-lg font-bold text-gray-900 mb-1">
                  {lesson?.title}
                </h1>
                {lesson?.description && (
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {lesson.description}
                  </p>
                )}
              </div>

              {/* Progress and Actions - Compact */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                {/* Progress Card */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-semibold text-gray-900 text-sm">Course Progress</h3>
                    <span className="text-xs font-bold text-orange-600">
                      {progress?.progress || 0}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div 
                      className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress?.progress || 0}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    {progress?.completedLessons || 0} of {progress?.totalLessons || 0} lessons completed
                  </p>

                  {progress?.progress >= 90 && !isCourseCompleted && (
                    <button
                      onClick={markCourseAsComplete}
                      className="mt-1.5 w-full py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-colors"
                    >
                      Mark Course as Complete
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex justify-center">
                    {!isCompleted ? (
                      <button
                        onClick={markAsComplete}
                        className="w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md cursor-pointer text-sm"
                      >
                        <FiCheck className="mr-2" size={16} />
                        Mark as Complete
                      </button>
                    ) : (
                      <div className="w-full py-2 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center shadow-sm text-sm">
                        <FiCheck className="mr-2" size={16} />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    {prevLesson && (
                      <Link
                        to={`/courses/${courseId}/lesson/${prevLesson._id}`}
                        className="flex-1 py-1.5 px-3 bg-white border border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 rounded-lg font-medium transition-all flex items-center justify-center text-xs"
                      >
                        <FiChevronLeft className="mr-1" size={14} />
                        Previous
                      </Link>
                    )}
                    {nextLesson && (
                      <Link
                        to={`/courses/${courseId}/lesson/${nextLesson._id}`}
                        className="flex-1 py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all flex items-center justify-center text-xs"
                      >
                        Next
                        <FiChevronRight className="ml-1" size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar - Fixed width with scroll */}
        <aside className={`
          fixed lg:sticky top-0 right-0 h-screen w-96 bg-white border-l border-gray-200
          transform transition-transform duration-300 z-40 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Course Content</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {progress?.completedLessons || 0}/{progress?.totalLessons || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress?.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {sectionsWithLessons.map((section) => {
                  const isExpanded = expandedSections[section._id];
                  const sectionProgress = section.totalLessons > 0 
                    ? Math.round((section.completedLessons / section.totalLessons) * 100)
                    : 0;
                  
                  return (
                    <div key={section._id} className="mb-2">
                      {/* Section Header */}
                      <button
                        onClick={() => setExpandedSections(prev => ({
                          ...prev,
                          [section._id]: !prev[section._id]
                        }))}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {isExpanded ? (
                            <FiChevronDown size={16} className="flex-shrink-0 text-gray-500" />
                          ) : (
                            <FiChevronRight size={16} className="flex-shrink-0 text-gray-500" />
                          )}
                          <div className="text-left flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {section.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {section.completedLessons}/{section.totalLessons} lessons
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${sectionProgress}%` }}
                            />
                          </div>
                        </div>
                      </button>
                      
                      {/* Lessons List */}
                      {isExpanded && (
                        <div className="space-y-1.5 mt-2 ml-4">
                          {section.lessons.map((l, index) => {
                            const completed = l.isCompleted || false;
                            const isCurrent = l._id === lessonId;
                            
                            return (
                              <Link
                                key={l._id}
                                to={`/courses/${courseId}/lesson/${l._id}`}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                  block p-2.5 rounded-lg transition-all
                                  ${isCurrent 
                                    ? 'bg-orange-50 border border-orange-200' 
                                    : 'hover:bg-gray-50 border border-transparent'
                                  }
                                `}
                              >
                                <div className="flex items-start space-x-2">
                                  <div className={`
                                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5
                                    ${completed 
                                      ? 'bg-green-500 text-white' 
                                      : isCurrent
                                      ? 'bg-orange-500 text-white'
                                      : 'bg-gray-100 text-gray-600'
                                    }
                                  `}>
                                    {completed ? <FiCheck size={12} /> : index + 1}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h5 className={`text-sm font-medium ${isCurrent ? 'text-orange-700' : 'text-gray-900'} truncate`}>
                                      {l.title}
                                    </h5>
                                    <div className="flex items-center mt-0.5">
                                      <span className="text-xs text-gray-500 truncate flex-1">
                                        {l.sectionTitle}
                                      </span>
                                      {l.duration && (
                                        <span className="text-xs text-gray-500 flex items-center ml-2">
                                          <FiClock size={10} className="mr-1" />
                                          {l.duration}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LessonView;