import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FiCheck, FiChevronLeft, FiChevronRight, FiMenu, FiX, FiClock, FiBookOpen } from 'react-icons/fi';

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

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseRes = await api.get(`/courses/${courseId}`);
      setCourseName(courseRes.data.data.title);
      
      // Fetch sections and lessons
      const sectionsRes = await api.get(`/courses/${courseId}/sections`);
      const sections = sectionsRes.data.data;
      
      let allCourseLessons = [];
      for (const section of sections) {
        const lessonsRes = await api.get(`/courses/sections/${section._id}/lessons`);
        const sectionLessons = lessonsRes.data.data.map(lesson => ({
          ...lesson,
          sectionTitle: section.title
        }));
        allCourseLessons = [...allCourseLessons, ...sectionLessons];
      }
      
      // Fetch progress after we have all lessons
      const progressRes = await api.get(`/progress/course/${courseId}`);
      const progressData = progressRes.data.data;
      
      // Map isCompleted to each lesson
      const lessonsWithCompletion = allCourseLessons.map(lesson => {
        const lessonFromProgress = progressData?.lessons?.find(pl => pl._id === lesson._id);
        return {
          ...lesson,
          isCompleted: lessonFromProgress?.isCompleted || false
        };
      });
      
      console.log('Progress Data:', progressData);
      console.log('Lessons with completion:', lessonsWithCompletion);
      
      setAllLessons(lessonsWithCompletion);
      const currentLesson = lessonsWithCompletion.find(l => l._id === lessonId);
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
      const currentProgress = progress?.progress || 0;
      
      if (currentProgress < 90) {
        showPopupMessage(
          'Complete Course First',
          `You need to complete at least 90% of the course before marking lessons as complete. Current progress: ${currentProgress}%`
        );
        return;
      }

      await api.post(`/progress/lesson/${lessonId}/complete`);
      fetchLessonData();
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

      <div className="flex pt-4 lg:pt-6">
        {/* Main Content */}
        <main className="flex-1 lg:max-w-6xl lg:mx-auto">
          {/* Video Player - Reduced height */}
          <div className="relative bg-black" style={{ height: '65vh', maxHeight: '600px' }}>
            {lesson?.videoUrl ? (
              <iframe
                className="w-full h-full"
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
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FiBookOpen size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No video available</p>
                </div>
              </div>
            )}
          </div>

          {/* Course Name Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <Link 
                  to={`/courses/${courseId}`}
                  className="inline-flex items-center text-xs text-gray-500 hover:text-orange-600 mb-1"
                >
                  <FiChevronLeft className="mr-1" size={14} />
                  Back to Course
                </Link>
                <h2 className="text-lg font-bold text-gray-900">{courseName}</h2>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <span className="text-xs text-gray-500">Progress:</span>
                <span className="text-sm font-bold text-orange-600">{progress?.progress || 0}%</span>
              </div>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="p-4 lg:p-6 space-y-4">
            {/* Title & Description */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {lesson?.title}
              </h1>
              {lesson?.description && (
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  {lesson.description}
                </p>
              )}
            </div>

            {/* Progress Card - Compact */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">Progress</h3>
                  {isCourseCompleted && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Completed
                    </span>
                  )}
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {progress?.progress || 0}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress?.progress || 0}%` }}
                />
              </div>
              
              <p className="text-xs text-gray-500">
                {progress?.completedLessons || 0} of {progress?.totalLessons || 0} lessons completed
              </p>

              {progress?.progress >= 90 && !isCourseCompleted && (
                <button
                  onClick={markCourseAsComplete}
                  className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Mark Course as Complete
                </button>
              )}

              {progress?.progress < 90 && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  Complete {90 - Math.floor(progress?.progress || 0)}% more to unlock lesson completion
                </div>
              )}
            </div>

            {/* Action Button */}
            <div>
              {!isCompleted ? (
                <button
                  onClick={markAsComplete}
                  disabled={progress?.progress < 90}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                    progress?.progress >= 90
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FiCheck className="mr-2" />
                  Mark as Complete
                </button>
              ) : (
                <div className="w-full py-3 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center">
                  <FiCheck className="mr-2" />
                  Completed
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {prevLesson && (
                <Link
                  to={`/courses/${courseId}/lesson/${prevLesson._id}`}
                  className="flex-1 py-2.5 px-4 bg-white border border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 rounded-lg font-medium transition-all flex items-center justify-center"
                >
                  <FiChevronLeft className="mr-1" size={18} />
                  Previous
                </Link>
              )}
              {nextLesson && (
                <Link
                  to={`/courses/${courseId}/lesson/${nextLesson._id}`}
                  className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all flex items-center justify-center"
                >
                  Next
                  <FiChevronRight className="ml-1" size={18} />
                </Link>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar - Right Side */}
        <aside className={`
          fixed lg:sticky top-0 right-0 h-screen w-72 bg-white border-l border-gray-200
          transform transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
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

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {allLessons.map((l, index) => {
                const completed = l.isCompleted || false;
                const isCurrent = l._id === lessonId;
                
                return (
                  <Link
                    key={l._id}
                    to={`/courses/${courseId}/lesson/${l._id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      block p-3 rounded-lg transition-all
                      ${isCurrent 
                        ? 'bg-orange-50 border border-orange-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                        ${completed 
                          ? 'bg-green-500 text-white' 
                          : isCurrent
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {completed ? <FiCheck size={14} /> : index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium truncate ${isCurrent ? 'text-orange-700' : 'text-gray-900'}`}>
                            {l.title}
                          </h4>
                          {completed && (
                            <span className="flex-shrink-0 ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded flex items-center">
                              <FiCheck size={10} className="mr-0.5" />
                              Done
                            </span>
                          )}
                        </div>
                        {l.duration && (
                          <p className="text-xs text-gray-500 flex items-center mt-0.5">
                            <FiClock size={10} className="mr-1" />
                            {l.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LessonView;