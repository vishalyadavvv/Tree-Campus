import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, Users, Settings, BarChart3, Plus, Edit2, Trash2, 
  Eye, Menu, Home, GraduationCap, FileText, ChevronDown, ChevronUp, 
  Save, ArrowLeft, Search, Filter, Download, Upload, Calendar, Clock,
  DollarSign, TrendingUp, UserCheck, MessageCircle, Bell, Shield,
  CreditCard, Database, Server, Cpu, Zap, Target, Award, Star,
  Heart, Share, Bookmark, PlayCircle, Youtube, ExternalLink,
  MapPin, Clock as ClockIcon, Calendar as CalendarIcon, Link2,
  Mic, MicOff, Video as VideoIcon, Users as UsersIcon
} from 'lucide-react';

// API Service Layer
const apiService = {
  // Courses API
  async getCourses() {
    const response = await fetch('/api/courses');
    return response.json();
  },

  async saveCourse(courseData) {
    const response = await fetch('/api/courses', {
      method: courseData.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    return response.json();
  },

  async deleteCourse(courseId) {
    await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
  },

  // Students API
  async getStudents() {
    const response = await fetch('/api/students');
    return response.json();
  },

  // Live Classes API
  async getLiveClasses() {
    const response = await fetch('/api/live-classes');
    return response.json();
  },

  async saveLiveClass(classData) {
    const response = await fetch('/api/live-classes', {
      method: classData.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    });
    return response.json();
  },

  async deleteLiveClass(classId) {
    await fetch(`/api/live-classes/${classId}`, { method: 'DELETE' });
  },

  // Analytics API
  async getPlatformStats() {
    const response = await fetch('/api/analytics/stats');
    return response.json();
  }
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [loading, setLoading] = useState(false);
  
  // State for all data
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [platformStats, setPlatformStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);

  // Form states
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLiveClass, setEditingLiveClass] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    status: 'Draft',
    category: 'Development',
    instructor: '',
    level: 'Beginner',
    duration: '',
    sections: []
  });

  const [liveClassFormData, setLiveClassFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    platform: 'zoom',
    meetingLink: '',
    meetingId: '',
    passcode: '',
    date: '',
    time: '',
    duration: '60',
    maxParticipants: 100,
    status: 'scheduled'
  });

  const navItems = [
    { icon: Home, label: 'Dashboard', value: 'dashboard' },
    { icon: BookOpen, label: 'Courses', value: 'courses' },
    { icon: Video, label: 'Live Classes', value: 'live-classes' },
    { icon: Users, label: 'Students', value: 'students' },
    { icon: FileText, label: 'Content', value: 'content' },
    { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ];

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const mockData = await getMockData();
      setCourses(mockData.courses);
      setStudents(mockData.students);
      setLiveClasses(mockData.liveClasses);
      setPlatformStats(mockData.platformStats);
      setRecentActivities(mockData.recentActivities);
      setPopularCourses(mockData.popularCourses);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator
  const getMockData = async () => {
    return {
      courses: [
        {
          id: 1,
          title: 'Web Development Fundamentals',
          description: 'Learn HTML, CSS, and JavaScript basics to start your web development journey',
          totalSections: 4,
          totalLessons: 12,
          thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
          status: 'Published',
          price: 0,
          students: 1247,
          rating: 4.8,
          category: 'Development',
          createdAt: '2024-01-15',
          instructor: 'Sarah Johnson',
          level: 'Beginner',
          duration: '8 hours',
          popularity: 95,
          sections: [
            {
              id: 's1',
              title: 'Introduction to Web Development',
              lessons: [
                { id: 'l1', title: 'What is Web Development?', youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', description: 'Overview of web development', duration: '10:30' },
                { id: 'l2', title: 'HTML Basics', youtubeUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE', description: 'Learn HTML fundamentals', duration: '25:45' }
              ]
            }
          ]
        },
        {
          id: 2,
          title: 'Python for Beginners',
          description: 'Master Python programming basics with hands-on projects and exercises',
          totalSections: 3,
          totalLessons: 8,
          thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
          status: 'Published',
          price: 0,
          students: 892,
          rating: 4.6,
          category: 'Programming',
          createdAt: '2024-02-10',
          instructor: 'Michael Chen',
          level: 'Beginner',
          duration: '6 hours',
          popularity: 88,
          sections: []
        },
        {
          id: 3,
          title: 'Graphic Design Basics',
          description: 'Learn design principles, color theory, and typography for stunning visuals',
          totalSections: 5,
          totalLessons: 15,
          thumbnail: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=400',
          status: 'Published',
          price: 0,
          students: 1563,
          rating: 4.9,
          category: 'Design',
          createdAt: '2024-01-28',
          instructor: 'Alex Rodriguez',
          level: 'Beginner',
          duration: '10 hours',
          popularity: 92,
          sections: []
        }
      ],
      students: [
        { id: 1, name: 'John Smith', email: 'john@example.com', joined: '2024-01-15', courses: 3, progress: 78, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', lastActive: '2 hours ago' },
        { id: 2, name: 'Emma Wilson', email: 'emma@example.com', joined: '2024-02-03', courses: 5, progress: 92, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', lastActive: '30 minutes ago' }
      ],
      liveClasses: [
        {
          id: 1,
          title: 'Advanced JavaScript Workshop',
          description: 'Deep dive into modern JavaScript features and best practices',
          instructor: 'Sarah Johnson',
          platform: 'zoom',
          meetingLink: 'https://zoom.us/j/123456789',
          meetingId: '123 456 789',
          passcode: '123456',
          date: '2024-03-20',
          time: '14:00',
          duration: '90',
          maxParticipants: 50,
          enrolled: 42,
          status: 'scheduled',
          thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400'
        },
        {
          id: 2,
          title: 'React Hooks Masterclass',
          description: 'Learn to use React Hooks effectively in your projects',
          instructor: 'Mike Chen',
          platform: 'google-meet',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          meetingId: 'abc-defg-hij',
          passcode: '',
          date: '2024-03-22',
          time: '16:00',
          duration: '120',
          maxParticipants: 30,
          enrolled: 28,
          status: 'scheduled',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
        }
      ],
      platformStats: {
        totalStudents: 4231,
        activeStudents: 2847,
        totalCourses: 15,
        publishedCourses: 12,
        completionRate: 68,
        averageRating: 4.7,
        totalLessons: 145,
        totalHours: 89,
        monthlyGrowth: 24,
        liveClassesScheduled: 8,
        liveClassesCompleted: 45
      },
      recentActivities: [
        { id: 1, user: 'John Smith', action: 'completed', course: 'Web Development Fundamentals', time: '2 hours ago', type: 'success' },
        { id: 2, user: 'Emma Wilson', action: 'enrolled', course: 'Python for Beginners', time: '5 hours ago', type: 'info' }
      ],
      popularCourses: [
        { id: 1, title: 'Web Development Fundamentals', enrolled: 1247, completion: 78, rating: 4.8 },
        { id: 2, title: 'Graphic Design Basics', enrolled: 1563, completion: 82, rating: 4.9 }
      ]
    };
  };

  // Filter courses based on search
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Responsive sidebar handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Courses Functions
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const addNewCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      description: '',
      thumbnail: '',
      status: 'Draft',
      category: 'Development',
      instructor: '',
      level: 'Beginner',
      duration: '',
      sections: []
    });
    setActiveView('course-form');
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail || '',
      status: course.status,
      category: course.category,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      sections: course.sections || []
    });
    setActiveView('course-form');
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await apiService.deleteCourse(id);
        setCourses(courses.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const addSection = () => {
    setCourseFormData({
      ...courseFormData,
      sections: [...courseFormData.sections, { id: Date.now(), title: '', lessons: [] }]
    });
  };

  const removeSection = (sectionId) => {
    setCourseFormData({
      ...courseFormData,
      sections: courseFormData.sections.filter(s => s.id !== sectionId)
    });
  };

  const updateSection = (sectionId, field, value) => {
    setCourseFormData({
      ...courseFormData,
      sections: courseFormData.sections.map(s => 
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    });
  };

  const addLesson = (sectionId) => {
    setCourseFormData({
      ...courseFormData,
      sections: courseFormData.sections.map(s => 
        s.id === sectionId 
          ? { ...s, lessons: [...s.lessons, { id: Date.now(), title: '', youtubeUrl: '', description: '', duration: '' }] }
          : s
      )
    });
  };

  const removeLesson = (sectionId, lessonId) => {
    setCourseFormData({
      ...courseFormData,
      sections: courseFormData.sections.map(s => 
        s.id === sectionId 
          ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) }
          : s
      )
    });
  };

  const updateLesson = (sectionId, lessonId, field, value) => {
    setCourseFormData({
      ...courseFormData,
      sections: courseFormData.sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              lessons: s.lessons.map(l => 
                l.id === lessonId ? { ...l, [field]: value } : l
              ) 
            }
          : s
      )
    });
  };

  const calculateTotals = () => {
    const totalSections = courseFormData.sections.length;
    const totalLessons = courseFormData.sections.reduce((sum, section) => sum + section.lessons.length, 0);
    return { totalSections, totalLessons };
  };

  const saveCourse = async () => {
    try {
      const { totalSections, totalLessons } = calculateTotals();
      const courseData = {
        ...courseFormData,
        totalSections,
        totalLessons,
        price: 0,
        students: editingCourse ? editingCourse.students : 0,
        rating: editingCourse ? editingCourse.rating : 0,
        popularity: editingCourse ? editingCourse.popularity : 0,
        createdAt: editingCourse ? editingCourse.createdAt : new Date().toISOString().split('T')[0]
      };

      const savedCourse = await apiService.saveCourse(courseData);
      
      if (editingCourse) {
        setCourses(courses.map(c => c.id === editingCourse.id ? savedCourse : c));
      } else {
        setCourses([...courses, { ...savedCourse, id: Date.now() }]);
      }
      
      setActiveView('courses');
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  // Live Classes Functions
  const addNewLiveClass = () => {
    setEditingLiveClass(null);
    setLiveClassFormData({
      title: '',
      description: '',
      instructor: '',
      platform: 'zoom',
      meetingLink: '',
      meetingId: '',
      passcode: '',
      date: '',
      time: '',
      duration: '60',
      maxParticipants: 100,
      status: 'scheduled'
    });
    setActiveView('live-class-form');
  };

  const editLiveClass = (liveClass) => {
    setEditingLiveClass(liveClass);
    setLiveClassFormData({
      title: liveClass.title,
      description: liveClass.description,
      instructor: liveClass.instructor,
      platform: liveClass.platform,
      meetingLink: liveClass.meetingLink,
      meetingId: liveClass.meetingId,
      passcode: liveClass.passcode,
      date: liveClass.date,
      time: liveClass.time,
      duration: liveClass.duration,
      maxParticipants: liveClass.maxParticipants,
      status: liveClass.status
    });
    setActiveView('live-class-form');
  };

  const deleteLiveClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this live class?')) {
      try {
        await apiService.deleteLiveClass(id);
        setLiveClasses(liveClasses.filter(lc => lc.id !== id));
      } catch (error) {
        console.error('Error deleting live class:', error);
      }
    }
  };

  const saveLiveClass = async () => {
    try {
      const savedClass = await apiService.saveLiveClass(liveClassFormData);
      
      if (editingLiveClass) {
        setLiveClasses(liveClasses.map(lc => lc.id === editingLiveClass.id ? savedClass : lc));
      } else {
        setLiveClasses([...liveClasses, { ...savedClass, id: Date.now() }]);
      }
      
      setActiveView('live-classes');
      setEditingLiveClass(null);
    } catch (error) {
      console.error('Error saving live class:', error);
    }
  };

  // Platform-specific configuration
  const platformConfig = {
    zoom: {
      name: 'Zoom Meeting',
      icon: '🔷',
      linkPlaceholder: 'https://zoom.us/j/...',
      idPlaceholder: 'Meeting ID'
    },
    'google-meet': {
      name: 'Google Meet',
      icon: '🔴',
      linkPlaceholder: 'https://meet.google.com/...',
      idPlaceholder: 'Meeting Code'
    },
    teams: {
      name: 'Microsoft Teams',
      icon: '🔵',
      linkPlaceholder: 'https://teams.microsoft.com/...',
      idPlaceholder: 'Team Code'
    },
    custom: {
      name: 'Custom Platform',
      icon: '⚡',
      linkPlaceholder: 'Enter meeting URL...',
      idPlaceholder: 'Meeting ID'
    }
  };

  // Course Card Component
  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            course.status === 'Published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {course.status}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
            {course.level}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{course.rating}</span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
            FREE
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex-1 line-clamp-2">{course.title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-700">
              <BookOpen size={16} />
              <span className="font-semibold">{course.totalSections}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Video size={16} />
              <span className="font-semibold">{course.totalLessons}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Users size={16} />
              <span className="font-semibold">{course.students}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">{course.duration}</div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => editCourse(course)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button 
            onClick={() => deleteCourse(course.id)}
            className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Live Class Card Component
  const LiveClassCard = ({ liveClass }) => {
    const platform = platformConfig[liveClass.platform];
    const classDateTime = new Date(`${liveClass.date}T${liveClass.time}`);
    const isUpcoming = new Date() < classDateTime;
    const isLive = new Date() >= classDateTime && new Date() < new Date(classDateTime.getTime() + liveClass.duration * 60000);
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
        <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 overflow-hidden relative">
          <img 
            src={liveClass.thumbnail} 
            alt={liveClass.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isLive ? 'bg-red-100 text-red-800' :
              isUpcoming ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isLive ? 'LIVE NOW' : isUpcoming ? 'UPCOMING' : 'COMPLETED'}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
            <span className="text-lg">{platform.icon}</span>
            <span className="text-sm font-medium">{platform.name}</span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{liveClass.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{liveClass.description}</p>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon size={16} />
                <span>{new Date(liveClass.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon size={16} />
                <span>{liveClass.time}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <UsersIcon size={16} />
                <span>{liveClass.enrolled}/{liveClass.maxParticipants} enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon size={16} />
                <span>{liveClass.duration} min</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserCheck size={16} />
              <span>Instructor: {liveClass.instructor}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => editLiveClass(liveClass)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button 
              onClick={() => deleteLiveClass(liveClass.id)}
              className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
            >
              <Trash2 size={16} />
            </button>
            {isUpcoming && (
              <a
                href={liveClass.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center gap-1"
              >
                <ExternalLink size={16} />
                Join
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Course Form Component
  const CourseForm = () => {
    const { totalSections, totalLessons } = calculateTotals();
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('courses')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveView('courses')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={saveCourse}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              <Save size={18} />
              Save Course
            </button>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{totalSections}</div>
            <div className="text-sm text-gray-600">Total Sections</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{totalLessons}</div>
            <div className="text-sm text-gray-600">Total Lessons</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600">FREE</div>
            <div className="text-sm text-gray-600">Course Price</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <select 
              value={courseFormData.status}
              onChange={(e) => setCourseFormData({...courseFormData, status: e.target.value})}
              className="w-full p-2 border rounded-lg bg-white"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <div className="text-sm text-gray-600 mt-1">Status</div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input 
                type="text"
                value={courseFormData.title}
                onChange={(e) => setCourseFormData({...courseFormData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., Web Development Fundamentals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
              <input 
                type="text"
                value={courseFormData.instructor}
                onChange={(e) => setCourseFormData({...courseFormData, instructor: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., Sarah Johnson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select 
                value={courseFormData.category}
                onChange={(e) => setCourseFormData({...courseFormData, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Development">Development</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
              <select 
                value={courseFormData.level}
                onChange={(e) => setCourseFormData({...courseFormData, level: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input 
                type="text"
                value={courseFormData.duration}
                onChange={(e) => setCourseFormData({...courseFormData, duration: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., 8 hours"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea 
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows="4"
                placeholder="Describe what students will learn in this course..."
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL (optional)</label>
              <input 
                type="text"
                value={courseFormData.thumbnail}
                onChange={(e) => setCourseFormData({...courseFormData, thumbnail: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Course Structure */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Course Structure</h3>
            <button 
              onClick={addSection}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <Plus size={18} />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {courseFormData.sections.map((section, sIndex) => (
              <div key={section.id} className="border border-gray-300 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section {sIndex + 1} Title
                    </label>
                    <input 
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="e.g., Introduction to HTML"
                    />
                  </div>
                  <button 
                    onClick={() => removeSection(section.id)}
                    className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Lessons */}
                <div className="ml-4 space-y-3">
                  {section.lessons.map((lesson, lIndex) => (
                    <div key={lesson.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Lesson {lIndex + 1}</h4>
                        <button 
                          onClick={() => removeLesson(section.id, lesson.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Lesson Title</label>
                          <input 
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="e.g., HTML Tags Explained"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">YouTube URL</label>
                          <input 
                            type="text"
                            value={lesson.youtubeUrl}
                            onChange={(e) => updateLesson(section.id, lesson.id, 'youtubeUrl', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                          {lesson.youtubeUrl && extractYouTubeId(lesson.youtubeUrl) && (
                            <div className="mt-2">
                              <iframe 
                                width="100%" 
                                height="200" 
                                src={`https://www.youtube.com/embed/${extractYouTubeId(lesson.youtubeUrl)}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                            <input 
                              type="text"
                              value={lesson.duration}
                              onChange={(e) => updateLesson(section.id, lesson.id, 'duration', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 transition-colors"
                              placeholder="e.g., 15:30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                            <input 
                              type="text"
                              value={lesson.description}
                              onChange={(e) => updateLesson(section.id, lesson.id, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 transition-colors"
                              placeholder="Brief description"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addLesson(section.id)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>

          {courseFormData.sections.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
              <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">No sections yet</p>
              <p className="text-sm">Click "Add Section" to start building your course</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Live Class Form Component
  const LiveClassForm = () => {
    const platform = platformConfig[liveClassFormData.platform];
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('live-classes')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {editingLiveClass ? 'Edit Live Class' : 'Schedule Live Class'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveView('live-classes')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={saveLiveClass}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              <Save size={18} />
              {editingLiveClass ? 'Update Class' : 'Schedule Class'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Class Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Title *</label>
                  <input 
                    type="text"
                    value={liveClassFormData.title}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Advanced JavaScript Workshop"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea 
                    value={liveClassFormData.description}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    rows="3"
                    placeholder="Describe what will be covered in this live class..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
                  <input 
                    type="text"
                    value={liveClassFormData.instructor}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, instructor: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input 
                    type="date"
                    value={liveClassFormData.date}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input 
                    type="time"
                    value={liveClassFormData.time}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <select 
                    value={liveClassFormData.duration}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, duration: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <input 
                    type="number"
                    value={liveClassFormData.maxParticipants}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, maxParticipants: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Platform */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Meeting Platform</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
                  <select 
                    value={liveClassFormData.platform}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, platform: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="zoom">Zoom Meeting</option>
                    <option value="google-meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="custom">Custom Platform</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link *</label>
                  <input 
                    type="url"
                    value={liveClassFormData.meetingLink}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, meetingLink: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={platform.linkPlaceholder}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{platform.idPlaceholder}</label>
                  <input 
                    type="text"
                    value={liveClassFormData.meetingId}
                    onChange={(e) => setLiveClassFormData({...liveClassFormData, meetingId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={`Enter ${platform.idPlaceholder.toLowerCase()}...`}
                  />
                </div>
                
                {liveClassFormData.platform === 'zoom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passcode (Optional)</label>
                    <input 
                      type="text"
                      value={liveClassFormData.passcode}
                      onChange={(e) => setLiveClassFormData({...liveClassFormData, passcode: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter passcode if required"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Meeting Details Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-medium">{platform.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {liveClassFormData.date && liveClassFormData.time 
                      ? `${new Date(liveClassFormData.date).toLocaleDateString()} at ${liveClassFormData.time}`
                      : 'Not set'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{liveClassFormData.duration} minutes</span>
                </div>
                {liveClassFormData.meetingLink && (
                  <a 
                    href={liveClassFormData.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Test Meeting Link
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
      } fixed lg:relative bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-hidden flex flex-col z-30 h-full`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl">
              <GraduationCap size={32} className="text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">LearnFree</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setActiveView(item.value);
                if (window.innerWidth < 1024) {
                  setMobileMenuOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                activeView === item.value 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center font-bold text-white">
              A
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium text-sm">Admin User</p>
                <p className="text-xs text-gray-400">admin@learnfree.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors hidden lg:block"
            >
              {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeView === 'courses' && 'Course Management'}
              {activeView === 'course-form' && (editingCourse ? 'Edit Course' : 'Add New Course')}
              {activeView === 'live-classes' && 'Live Classes Management'}
              {activeView === 'live-class-form' && (editingLiveClass ? 'Edit Live Class' : 'Schedule Live Class')}
              {activeView === 'dashboard' && 'Dashboard Overview'}
              {activeView === 'students' && 'Student Management'}
              {activeView === 'content' && 'Content Library'}
              {activeView === 'analytics' && 'Analytics & Reports'}
              {activeView === 'settings' && 'Platform Settings'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            {(activeView === 'courses' || activeView === 'students' || activeView === 'live-classes') && (
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors w-64"
                />
              </div>
            )}

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={24} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {activeView === 'courses' && (
              <button 
                onClick={addNewCourse}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
              >
                <Plus size={20} />
                Add New Course
              </button>
            )}

            {activeView === 'live-classes' && (
              <button 
                onClick={addNewLiveClass}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
              >
                <Plus size={20} />
                Schedule Class
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              {/* Dashboard View */}
              {activeView === 'dashboard' && (
                <div className="space-y-6">
                  {/* Welcome Banner */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
                        <p className="text-green-100">
                          You have {platformStats.activeStudents} active students and {platformStats.liveClassesScheduled} live classes scheduled
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                        <TrendingUp size={32} />
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Total Students</p>
                          <p className="text-3xl font-bold text-gray-800">{platformStats.totalStudents?.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                          <Users size={24} className="text-green-600" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp size={16} className="text-green-500" />
                        <span className="text-sm text-green-600">+{platformStats.monthlyGrowth}% this month</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Active Courses</p>
                          <p className="text-3xl font-bold text-gray-800">{platformStats.publishedCourses}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <BookOpen size={24} className="text-blue-600" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {platformStats.totalCourses} total courses
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Live Classes</p>
                          <p className="text-3xl font-bold text-gray-800">{platformStats.liveClassesScheduled}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <Video size={24} className="text-purple-600" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {platformStats.liveClassesCompleted} completed
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Avg. Rating</p>
                          <p className="text-3xl font-bold text-gray-800">{platformStats.averageRating}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-xl">
                          <Star size={24} className="text-yellow-600 fill-yellow-500" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Based on 2.4k reviews
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Recent Activities</h3>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">View All</button>
                      </div>
                      <div className="space-y-4">
                        {recentActivities.map(activity => (
                          <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.type === 'success' ? 'bg-green-100' : 
                              activity.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                              {activity.action === 'completed' && <Award size={20} className="text-green-600" />}
                              {activity.action === 'enrolled' && <UserCheck size={20} className="text-blue-600" />}
                              {activity.action === 'submitted' && <FileText size={20} className="text-yellow-600" />}
                              {activity.action === 'achieved' && <Star size={20} className="text-green-600" />}
                              {activity.action === 'asked' && <MessageCircle size={20} className="text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                <span className="font-semibold">{activity.user}</span> {activity.action} {activity.course}
                              </p>
                              <p className="text-sm text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Live Classes */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Upcoming Live Classes</h3>
                        <button 
                          onClick={addNewLiveClass}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          Schedule
                        </button>
                      </div>
                      <div className="space-y-4">
                        {liveClasses.filter(lc => new Date(`${lc.date}T${lc.time}`) > new Date())
                         .slice(0, 3)
                         .map(liveClass => (
                          <div key={liveClass.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <Video size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 line-clamp-1">{liveClass.title}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{new Date(liveClass.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{liveClass.time}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-purple-600">{liveClass.enrolled}</div>
                              <div className="text-xs text-gray-500">enrolled</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {liveClasses.filter(lc => new Date(`${lc.date}T${lc.time}`) > new Date()).length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          <Video size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No upcoming classes</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Management View */}
              {activeView === 'courses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">All Courses ({courses.length})</h3>
                      <p className="text-gray-600">Manage and organize your free course content</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter size={18} />
                        Filter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download size={18} />
                        Export
                      </button>
                      <button 
                        onClick={addNewCourse}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                      >
                        <Plus size={20} />
                        Add New Course
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                  {filteredCourses.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your search or create a new course</p>
                      <button 
                        onClick={addNewCourse}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                      >
                        Create Your First Course
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Course Form View */}
              {activeView === 'course-form' && <CourseForm />}

              {/* Live Classes Management View */}
              {activeView === 'live-classes' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Live Classes Management</h3>
                      <p className="text-gray-600">Schedule and manage interactive live sessions</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter size={18} />
                        Filter
                      </button>
                      <button 
                        onClick={addNewLiveClass}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                      >
                        <Plus size={20} />
                        Schedule Class
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {liveClasses.map(liveClass => (
                      <LiveClassCard key={liveClass.id} liveClass={liveClass} />
                    ))}
                  </div>

                  {liveClasses.length === 0 && (
                    <div className="text-center py-12">
                      <Video size={64} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No live classes scheduled</h3>
                      <p className="text-gray-500 mb-4">Start scheduling live classes to engage with your students</p>
                      <button 
                        onClick={addNewLiveClass}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                      >
                        Schedule Your First Class
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Live Class Form View */}
              {activeView === 'live-class-form' && <LiveClassForm />}

              {/* Other views (students, content, analytics, settings) remain the same */}
              {/* ... (students, content, analytics, settings views would go here) */}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Add missing icon components
function ChevronLeft(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}