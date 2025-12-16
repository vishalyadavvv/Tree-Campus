import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../services/api';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSave, FiChevronDown, FiChevronUp, 
  FiVideo, FiFileText, FiCheckCircle, FiArrowLeft, FiX, FiClock,
  FiSettings, FiInfo, FiBookOpen, FiBarChart2, FiUsers, FiGlobe,
  FiUpload, FiImage, FiYoutube, FiExternalLink, FiEye, FiEyeOff,FiAward
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Course categories based on your backend enum
const COURSE_CATEGORIES = [
  'Spoken English Part-1',
  'Spoken English Part-2',
  'Spoken English Part-3',
  'Other',
 
];

const COURSE_LEVELS = ['All Levels','Beginner', 'Intermediate', 'Advanced'];
const COURSE_LANGUAGES = ['english','hindi'];

const CourseBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  
  // Modal states
  const [showCourseEditModal, setShowCourseEditModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  
  // Assignment states
  const [assignments, setAssignments] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    fetchCourseStructure();
  }, [id]);

  const fetchCourseStructure = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}/structure`);
      setCourse(response.data.data.course);
      setSections(response.data.data.sections);
      
      // Fetch assignments separately since they are course-level, not section-level
      try {
        const assignmentsRes = await api.get(`/assignments/course/${id}`);
        setAssignments(assignmentsRes.data.data || []);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }

      const expanded = {};
      response.data.data.sections.forEach(section => {
        expanded[section._id] = true;
      });
      setExpandedSections(expanded);
    } catch (error) {
      console.error('Error fetching course structure:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Course Management
  const handleEditCourse = () => {
    setEditingCourse(course);
    setShowCourseEditModal(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      const formattedData = {
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        category: courseData.category,
        language: courseData.language,
        duration: courseData.duration,
        price: parseFloat(courseData.price) || 0,
        discountPrice: parseFloat(courseData.discountPrice) || 0,
        featured: courseData.featured || false,
        requirements: courseData.requirements || [],
        learningOutcomes: courseData.learningOutcomes || [],
        tags: courseData.tags || []
      };
      console.log('Level being sent:', courseData.level); // ✅ Add this
    console.log('Full data:', formattedData); // ✅ Add this

      const response = await api.put(`/courses/${id}`, formattedData);
      
      if (response.data.success) {
        await fetchCourseStructure();
        setShowCourseEditModal(false);
        setEditingCourse(null);
      } else {
        toast.error(response.data.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update course. Please check the form data.';
      toast.error(errorMessage);
    }
  };

 const handleThumbnailUpload = async (file) => {
  try {
    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    const response = await api.post(`/courses/${id}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.success) {
      await fetchCourseStructure();
      toast.success('Thumbnail uploaded successfully!');
    } else {
      toast.error('Failed to upload thumbnail');
    }
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    toast.error(error.response?.data?.message || 'Error uploading thumbnail');
  } finally {
    setUploadingThumbnail(false);
  }
};

  // Section Management
  const handleAddSection = () => {
    setEditingSection({ 
      title: '', 
      description: '', 
      order: sections.length
    });
    setShowSectionModal(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setShowSectionModal(true);
  };

  const handleSaveSection = async (sectionData) => {
    try {
      const formattedData = {
        title: sectionData.title,
        description: sectionData.description || '',
        order: parseInt(sectionData.order) || 0
      };

      if (sectionData._id) {
        await api.put(`/courses/sections/${sectionData._id}`, formattedData);
      } else {
        await api.post(`/courses/${id}/sections`, formattedData);
      }
      await fetchCourseStructure();
      setShowSectionModal(false);
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error(error.response?.data?.message || 'Failed to save section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section and all its content?')) return;
    try {
      await api.delete(`/courses/sections/${sectionId}`);
      await fetchCourseStructure();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
    }
  };

  // Lesson Management
  const handleAddLesson = (sectionId) => {
    const section = sections.find(s => s._id === sectionId);
    setCurrentSectionId(sectionId);
    setEditingLesson({
      title: '',
      videoUrl: '',
      duration: '',
      description: '',
      content: ''
    });
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson, sectionId) => {
    setCurrentSectionId(sectionId);
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  const handleSaveLesson = async (lessonData) => {
    try {
      const formData = new FormData();
      formData.append('title', lessonData.title);
      formData.append('videoUrl', lessonData.videoUrl);
      formData.append('duration', lessonData.duration);
      formData.append('description', lessonData.description || '');
      formData.append('content', lessonData.content || '');
      formData.append('textContent', lessonData.textContent || '');

      // Add PDF file if present
      if (lessonData.pdfFile) {
        formData.append('pdf', lessonData.pdfFile);
      }

      if (lessonData._id) {
        await api.put(`/courses/lessons/${lessonData._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post(`/courses/sections/${currentSectionId}/lessons`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      await fetchCourseStructure();
      setShowLessonModal(false);
      setEditingLesson(null);
      setCurrentSectionId(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error(error.response?.data?.message || 'Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/courses/lessons/${lessonId}`);
      await fetchCourseStructure();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  };

  // Quiz Management
  const handleAddQuiz = (sectionId) => {
    setCurrentSectionId(sectionId);
    setEditingQuiz({ 
      sectionId, 
      isNew: true, 
      title: '', 
      description: '',
      passingScore: 70,
      timeLimit: 30,
      questions: []
    });
    setShowQuizModal(true);
  };

  const handleEditQuiz = (quiz, sectionId) => {
    setCurrentSectionId(sectionId);
    setEditingQuiz({ ...quiz, sectionId });
    setShowQuizModal(true);
  };

const handleSaveQuiz = async (quizData) => {
  try {
    // Data is already formatted correctly from the modal
    const formattedData = {
      title: quizData.title,
      description: quizData.description || '',
      passingScore: parseInt(quizData.passingScore) || 70,
      timeLimit: parseInt(quizData.timeLimit) || 30,
      questions: quizData.questions // Already transformed
    };

    if (quizData.isNew) {
      await api.post(`/courses/sections/${quizData.sectionId}/quiz`, formattedData);
    } else {
      await api.put(`/courses/quiz/${quizData._id}`, formattedData);
    }
    await fetchCourseStructure();
    setShowQuizModal(false);
    setEditingQuiz(null);
    setCurrentSectionId(null);
  } catch (error) {
    console.error('Error saving quiz:', error);
    toast.error(error.response?.data?.message || 'Failed to save quiz');
  }
};

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/courses/quiz/${quizId}`);
      await fetchCourseStructure();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    }
  };

  // Assignment Management
  const handleAddAssignment = () => {
    setEditingAssignment({
      title: '',
      description: '',
      passingScore: 60,
      timeLimit: 60,
      questions: []
    });
    setShowAssignmentModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (assignmentData._id) {
        await api.put(`/assignments/${assignmentData._id}`, assignmentData);
      } else {
        await api.post(`/assignments/course/${id}`, assignmentData);
      }
      await fetchCourseStructure(); // Will re-fetch assignments too
      setShowAssignmentModal(false);
      setEditingAssignment(null);
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to save assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.delete(`/assignments/${assignmentId}`);
      await fetchCourseStructure();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  // Calculate course statistics
  const calculateStats = () => {
    const totalLessons = sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0);
    const totalQuizzes = sections.filter(s => s.quiz).length;
    const totalDuration = sections.reduce((acc, section) => {
      const sectionDuration = section.lessons?.reduce((lessonAcc, lesson) => {
        return lessonAcc + (parseInt(lesson.duration?.split(':')[0]) || 0);
      }, 0) || 0;
      return acc + sectionDuration;
    }, 0);

    return { totalLessons, totalQuizzes, totalDuration };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            <p className="text-gray-600 animate-pulse">Loading course structure...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Course Edit Modal */}
      {showCourseEditModal && (
        <CourseEditModal
          course={editingCourse}
          onSave={handleSaveCourse}
          onClose={() => {
            setShowCourseEditModal(false);
            setEditingCourse(null);
          }}
          onThumbnailUpload={handleThumbnailUpload}
          uploadingThumbnail={uploadingThumbnail}
        />
      )}

      {/* Section Modal */}
      {showSectionModal && (
        <SectionModal
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => {
            setShowSectionModal(false);
            setEditingSection(null);
          }}
        />
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <LessonModal
          lesson={editingLesson}
          onSave={handleSaveLesson}
          onClose={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
            setCurrentSectionId(null);
          }}
        />
      )}

      {/* Quiz Editor Modal */}
      {showQuizModal && (
        <QuizEditorModal
          quiz={editingQuiz}
          onSave={handleSaveQuiz}
          onClose={() => {
            setShowQuizModal(false);
            setEditingQuiz(null);
            setCurrentSectionId(null);
          }}
        />
      )}

      <div className="space-y-6 animate-fade-in">
        {/* Course Header with Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <button 
                  className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors group"
                  onClick={() => navigate('/admin/courses')}
                >
                  <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Courses</span>
                </button>
                
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-4">
                      {course?.thumbnail && (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-20 h-20 rounded-xl object-cover border-2 border-white/20"
                        />
                      )}
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{course?.title}</h1>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                            {course?.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'Beginner'}
                          </span>
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                            {course?.category ? course.category.charAt(0).toUpperCase() + course.category.slice(1) : 'General'}
                          </span>
                          {course?.featured && (
                            <span className="px-3 py-1 bg-yellow-500/80 backdrop-blur-sm rounded-full text-sm">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 mb-4 max-w-2xl">{course?.description}</p>
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center space-x-2">
                            <FiBookOpen className="w-4 h-4" />
                            <span>{stats.totalLessons} Lessons</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiFileText className="w-4 h-4" />
                            <span>{stats.totalQuizzes} Quizzes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiClock className="w-4 h-4" />
                            <span>{stats.totalDuration} mins</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiUsers className="w-4 h-4" />
                            <span>{course?.enrollmentCount || 0} Students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                      onClick={handleEditCourse}
                    >
                      <FiSettings className="w-4 h-4" />
                      <span>Edit Course</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
                      onClick={handleAddSection}
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Section</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Sections</p>
                <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FiBookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FiVideo className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiFileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Duration</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDuration} mins</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <FiClock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

      {/* Course Assignments Section - Moved to Top */}
      <div className="mt-8 mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course Assignments (Tests)</h2>
            <p className="text-gray-600">Create final assessments for certification</p>
          </div>
          <button 
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={handleAddAssignment}
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Assignment</span>
          </button>
        </div>

        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-white rounded-xl border border-orange-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 bg-white/80 backdrop-blur-sm rounded-bl-xl">
                  <button 
                    onClick={() => handleEditAssignment(assignment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                    <FiAward className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">{assignment.questions.length} Questions</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-bold text-gray-900">{assignment.passingScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-bold text-gray-900">{assignment.timeLimit} mins</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    Last updated
                  </span>
                  <span>{new Date(assignment.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-orange-50 rounded-xl border-2 border-dashed border-orange-200">
            <FiAward className="w-12 h-12 text-orange-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No Assignments Yet</h3>
            <p className="text-gray-500">Create an assignment for students to earn their certificate.</p>
          </div>
        )}
      </div>

      {showAssignmentModal && (
        <QuizEditorModal
          quiz={editingAssignment}
          onSave={handleSaveAssignment}
          onClose={() => {
            setShowAssignmentModal(false);
            setEditingAssignment(null);
          }}
          title={editingAssignment?._id ? "Edit Assignment" : "New Assignment"}
          isAssignment={true}
        />
      )}

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={section._id} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Section Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div 
                    className="flex-1 cursor-pointer group"
                    onClick={() => toggleSection(section._id)}
                  >
                    <div className="flex items-start space-x-4 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {sectionIndex + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {section.title}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {section.lessons?.length || 0} Lessons
                          </span>
                        </div>
                        {section.description && (
                          <p className="text-gray-600 mb-3">{section.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center space-x-1 text-gray-500">
                            <FiVideo className="w-4 h-4" />
                            <span>{section.lessons?.length || 0} lessons</span>
                          </span>
                          <span className="flex items-center space-x-1 text-gray-500">
                            <FiFileText className="w-4 h-4" />
                            <span>{section.quiz ? '1 quiz' : 'No quiz'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                    <button 
                      className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-105"
                      onClick={() => handleEditSection(section)}
                      title="Edit Section"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-105"
                      onClick={() => handleDeleteSection(section._id)}
                      title="Delete Section"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105"
                      onClick={() => toggleSection(section._id)}
                      title={expandedSections[section._id] ? "Collapse" : "Expand"}
                    >
                      {expandedSections[section._id] ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              {expandedSections[section._id] && (
                <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white">
                  {/* Lessons Section Card */}
                  <div className="mb-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 shadow-lg p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                          <FiVideo className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">Lessons</h4>
                          <p className="text-sm text-gray-500">Add and manage video lessons</p>
                        </div>
                      </div>
                      <button 
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={() => handleAddLesson(section._id)}
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Lesson</span>
                      </button>
                    </div>
                    
                    {section.lessons && section.lessons.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div 
                            key={lesson._id}
                            className="bg-white rounded-xl border border-blue-200 p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                          >
                            <div className="flex flex-col h-full">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold">
                                      {lessonIndex + 1}
                                    </span>
                                    <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                                      {lesson.title}
                                    </h5>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <button 
                                      className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                                      onClick={() => handleEditLesson(lesson, section._id)}
                                      title="Edit Lesson"
                                    >
                                      <FiEdit2 className="w-3 h-3" />
                                    </button>
                                    <button 
                                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                                      onClick={() => handleDeleteLesson(lesson._id)}
                                      title="Delete Lesson"
                                    >
                                      <FiTrash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 text-xs">
                                  {lesson.duration && (
                                    <div className="flex items-center space-x-1.5 text-gray-600">
                                      <FiClock className="w-3 h-3 flex-shrink-0" />
                                      <span>{lesson.duration}</span>
                                    </div>
                                  )}
                                  
                                  {lesson.videoUrl && (
                                    <div>
                                      <div className="flex items-center space-x-1 text-gray-500 mb-0.5">
                                        <FiYoutube className="w-3 h-3" />
                                        <span className="font-medium">Video</span>
                                      </div>
                                      <a 
                                        href={lesson.videoUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 hover:underline truncate block flex items-center space-x-1"
                                      >
                                        <span>{lesson.videoUrl.length > 30 ? `${lesson.videoUrl.substring(0, 30)}...` : lesson.videoUrl}</span>
                                        <FiExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  )}
                                  
                                  {lesson.textContent && (
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                      <p className="text-gray-700 line-clamp-2">{lesson.textContent}</p>
                                    </div>
                                  )}
                                  
                                  {lesson.pdfUrl && (
                                    <div>
                                      <a 
                                        href={lesson.pdfUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1.5 text-red-600 hover:text-red-700 hover:underline"
                                      >
                                        <FiFileText className="w-3 h-3" />
                                        <span className="truncate">{lesson.pdfFileName || 'Download PDF'}</span>
                                        <FiExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-dashed border-blue-300">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiVideo className="w-10 h-10 text-blue-500" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">No Lessons Yet</h5>
                        <p className="text-gray-500 mb-6">Add your first lesson to get started</p>
                        <button 
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                          onClick={() => handleAddLesson(section._id)}
                        >
                          <FiPlus className="w-4 h-4" />
                          <span>Create First Lesson</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quiz Section Card */}
                  <div className="bg-gradient-to-br from-white to-green-50 rounded-xl border border-green-100 shadow-md p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                          <FiFileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Quiz</h4>
                          <p className="text-xs text-gray-500">Test student knowledge</p>
                        </div>
                      </div>
                      {!section.quiz && (
                        <button 
                          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105"
                          onClick={() => handleAddQuiz(section._id)}
                        >
                          <FiPlus className="w-3 h-3" />
                          <span>Add Quiz</span>
                        </button>
                      )}
                    </div>
                    
                    {section.quiz ? (
                      <div className="bg-white rounded-lg border border-green-200 p-3 hover:shadow-md transition-all duration-300 hover:border-green-300">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className="text-base font-bold text-gray-900">{section.quiz.title}</h5>
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                {section.quiz.questions?.length || 0}Q
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2 text-xs">
                              <div className="flex items-center space-x-1 text-gray-600">
                                <FiBarChart2 className="w-3 h-3" />
                                <span><strong>{section.quiz.passingScore}%</strong> pass</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-600">
                                <FiClock className="w-3 h-3" />
                                <span><strong>{section.quiz.timeLimit || 30}</strong>m</span>
                              </div>
                            </div>
                            
                            {section.quiz.description && (
                              <p className="text-gray-600 text-xs line-clamp-1">{section.quiz.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 mt-2 lg:mt-0 lg:ml-3">
                            <button 
                              className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                              onClick={() => handleEditQuiz(section.quiz, section._id)}
                            >
                              <FiEdit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button 
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                              onClick={() => handleDeleteQuiz(section.quiz._id)}
                              title="Delete Quiz"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gradient-to-br from-green-50 to-white rounded-lg border-2 border-dashed border-green-300">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FiFileText className="w-7 h-7 text-green-500" />
                        </div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">No Quiz</h5>
                        <p className="text-gray-500 mb-3 text-xs">Add a quiz to test knowledge</p>
                        <button 
                          className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-xs hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105"
                          onClick={() => handleAddQuiz(section._id)}
                        >
                          <FiPlus className="w-3 h-3" />
                          <span>Create Quiz</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {sections.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPlus className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Building Your Course</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create sections to organize your content. Each section can contain multiple lessons and a quiz.
            </p>
            <button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg font-semibold"
              onClick={handleAddSection}
            >
              Create Your First Section
            </button>
          </div>
        )}
      </div>



    </DashboardLayout>
  );
};

// Course Edit Modal Component
const CourseEditModal = ({ course, onSave, onClose, onThumbnailUpload, uploadingThumbnail }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    level: course?.level || 'All Levels',
    category: course?.category || 'Spoken English',
    language: course?.language || 'english',
    duration: course?.duration || '',
    price: course?.price || 0,
    discountPrice: course?.discountPrice || 0,
    featured: course?.featured || false,
    requirements: Array.isArray(course?.requirements) ? course.requirements : [],
    learningOutcomes: Array.isArray(course?.learningOutcomes) ? course.learningOutcomes : [],
    tags: Array.isArray(course?.tags) ? course.tags : []
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };


// 2️⃣ handleThumbnailChange function (just calls onThumbnailUpload)
const handleThumbnailChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size should be less than 5MB");
    return;
  }
  if (!file.type.startsWith("image/")) {
    toast.error("Please upload an image file");
    return;
  }

  onThumbnailUpload(file); // ✅ call the prop function// ✅ call existing function
};



 

  return (
   


        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4 z-[9999]"
  onClick={onClose}
>
  <div 
    className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" 
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <FiSettings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              <p className="text-gray-600">Update course details and settings</p>
            </div>
          </div>
          <button 
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300 hover:scale-105" 
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Complete JavaScript Mastery"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Level *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
              >
                {COURSE_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {COURSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Language *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
              >
                {COURSE_LANGUAGES.map(language => (
                  <option key={language} value={language}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                required
                placeholder="Describe your course in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                placeholder="e.g., 8 weeks, 30 hours"
              />
            </div>
{/* Thumbnail Upload Section */}
<div className="md:col-span-2">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Course Thumbnail
  </label>

  <div className="flex items-center space-x-4">
    
    {/* Thumbnail Preview */}
    <div className="w-32 h-20 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      {course?.thumbnail ? (
        <img 
          src={course.thumbnail} 
          alt="Thumbnail" 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-500 text-sm">No Image</span>
      )}
    </div>

    {/* Upload Button */}
    <div>
      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all text-sm">
        {uploadingThumbnail ? "Uploading..." : "Change Thumbnail"}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleThumbnailChange} 
          disabled={uploadingThumbnail}
        />
      </label>

      <p className="text-xs text-gray-500 mt-2">
        Supported formats: JPG, PNG — Max size: 5MB
      </p>
    </div>
  </div>
</div>

           
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                Featured Course
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">Feature this course on the homepage</p>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 font-semibold flex items-center justify-center space-x-2"
            >
              <FiSave className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
            <button 
              type="button" 
              className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    
  );
};

// Section Modal Component - Simplified
const SectionModal = ({ section, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: section?.title || '',
    description: section?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...section, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {section?._id ? 'Edit Section' : 'Add New Section'}
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-105" onClick={onClose}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Spoken English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="Brief description of this section..."
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <FiSave className="w-4 h-4" />
              <span>Save Section</span>
            </button>
            <button type="button" className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Lesson Modal Component - Simplified
const LessonModal = ({ lesson, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    videoUrl: lesson?.videoUrl || '',
    duration: lesson?.duration || '',
    content: lesson?.content || '',
    textContent: lesson?.textContent || '',
    pdfUrl: lesson?.pdfUrl || '',
    pdfFileName: lesson?.pdfFileName || ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setFormData({ ...formData, pdfFileName: file.name });
    } else {
      toast.error('Please select a valid PDF file');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...lesson, ...formData };
    if (pdfFile) {
      submitData.pdfFile = pdfFile;
    }
    onSave(submitData);
  };

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {lesson?._id ? 'Edit Lesson' : 'Add New Lesson'}
          </h2>
          <button 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all" 
            onClick={onClose}
          >
           <FiX className="w-5 h-5" />

          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Lesson Title *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Your Lesson Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                required
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1.5">
                YouTube, Vimeo, or direct video URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                placeholder="e.g., Time/Date"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Text Content (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                rows="2"
                placeholder="Add text notes, lecture content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Upload PDF (Optional)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                 className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
transition-all cursor-pointer hover:bg-red-100"

                />
              </div>
              {formData.pdfFileName && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                  <FiCheckCircle className="w-4 h-4" />
                  <span>{formData.pdfFileName}</span>
                </div>
              )}
            </div>

            
          </div>

          {/* Footer - Fixed */}
          <div className="flex space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 font-medium text-sm"
            >
              <FiSave className="w-4 h-4" />

              <span>Save Lesson</span>
            </button>
            <button 
              type="button" 
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium text-sm" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Quiz Editor Modal Component - Fixed
const QuizEditorModal = ({ quiz, onSave, onClose, ...props }) => {
  const [formData, setFormData] = useState({
    title: quiz.title || '',
    description: quiz.description || '',
    passingScore: quiz.passingScore || 70,
    timeLimit: quiz.timeLimit || 30,
    questions: quiz.questions?.map(q => ({
      questionText: q.questionText || '',
      options: q.options && Array.isArray(q.options)
        ? q.options.map((optText, index) => ({
            optionText: optText || '',
            isCorrect: index === q.correctAnswer
          }))
        : [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ],
      points: q.points || 1,
      explanation: q.explanation || ''
    })) || []
  });

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        questionText: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ],
        points: 1,
        explanation: ''
      }]
    }));
  };

  const updateQuestion = (qIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex][field] = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === 'isCorrect' && value) {
      // Set only one option as correct
      newQuestions[qIndex].options.forEach((opt, i) => {
        opt.isCorrect = i === oIndex;
      });
    } else {
      newQuestions[qIndex].options[oIndex][field] = value;
    }
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const deleteQuestion = (qIndex) => {
    // Remove question from local state
    const updatedQuestions = formData.questions.filter((_, i) => i !== qIndex);
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ 1. VALIDATE FORM
  if (!formData.title.trim()) {
    toast.error("Please enter a quiz title");
    return;
  }

  if (formData.questions.length === 0) {
    toast.error("Please add at least one question");
    return;
  }

  // ✅ 2. VALIDATE EACH QUESTION
  let validationErrors = [];
  
  formData.questions.forEach((q, qIndex) => {
    if (!q.questionText.trim()) {
      validationErrors.push(`Question ${qIndex + 1}: Please enter question text`);
    }

    q.options.forEach((option, oIndex) => {
      if (!option.optionText.trim()) {
        validationErrors.push(`Question ${qIndex + 1}, Option ${String.fromCharCode(65 + oIndex)}: Please enter option text`);
      }
    });

    const correctIndex = q.options.findIndex(opt => opt.isCorrect);
    if (correctIndex === -1) {
      validationErrors.push(`Question ${qIndex + 1}: Please select a correct answer`);
    }
  });

  if (validationErrors.length > 0) {
    toast.error("Please fix the following errors:\n\n" + validationErrors.join("\n"));
    return;
  }

  // ✅ 3. TRANSFORM DATA FOR BACKEND
  const transformedQuestions = formData.questions.map(q => {
    const correctIndex = q.options.findIndex(opt => opt.isCorrect);
    
    return {
      questionText: q.questionText.trim(),
      options: q.options.map(opt => opt.optionText.trim()), // Convert objects to strings
      correctAnswer: correctIndex, // Save numeric index as per schema
      points: q.points || 1,
      explanation: q.explanation?.trim() || ''
    };
  });

  // ✅ 4. PREPARE QUIZ DATA WITH TRANSFORMED QUESTIONS
  const quizData = {
    title: formData.title.trim(),
    description: formData.description?.trim() || '',
    passingScore: formData.passingScore,
    timeLimit: formData.timeLimit,
    questions: transformedQuestions
  };

  // Include quiz metadata
  if (quiz._id) {
    quizData._id = quiz._id;
  }
  if (quiz.isNew) {
    quizData.isNew = quiz.isNew;
  }
  if (quiz.sectionId) {
    quizData.sectionId = quiz.sectionId;
  }

  console.log("Transformed quiz data:", JSON.stringify(quizData, null, 2));

  // ✅ 5. CALL onSave WITH TRANSFORMED DATA
  try {
    await onSave(quizData);
  } catch (error) {
    console.error("Failed to save quiz:", error);
    toast.error(error.response?.data?.message || "Failed to save quiz. Please try again.");
  }
};
  // Render JSX remains the same...
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {props.title || (quiz.isNew ? 'Create Quiz' : 'Edit Quiz')}
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-105" onClick={onClose}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="e.g., Section 1 Quiz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="2"
                placeholder="Brief description of the quiz..."
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                <button 
                  type="button" 
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={addQuestion}
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Question {qIndex + 1}</h4>
                    <button 
                      type="button" 
                      className="text-red-600 hover:text-red-700 transition-colors"
                      onClick={() => deleteQuestion(qIndex)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={question.questionText}
                        onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        required
                        placeholder="Enter your question..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options (select the correct answer) *</label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              checked={option.isCorrect}
                              onChange={(e) => updateOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                              value={option.optionText}
                              onChange={(e) => updateOption(qIndex, oIndex, 'optionText', e.target.value)}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          value={question.points}
                          onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={question.explanation}
                        onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                        rows="2"
                        placeholder="Explain the correct answer..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.questions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No questions yet. Click "Add Question" to get started.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <FiSave className="w-4 h-4" />
              <span>Save Quiz</span>
            </button>
            <button type="button" className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CourseBuilder;