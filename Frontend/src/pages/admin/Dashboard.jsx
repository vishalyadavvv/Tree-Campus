  import { useState, useEffect, useRef } from 'react';
  import DashboardLayout from '../../components/Layout/DashboardLayout';
  import Modal from '../../components/common/Modal';
  import api from '../../services/api';
  import { FiUsers, FiBook, FiFileText, FiVideo, FiTrendingUp, FiArrowUp, FiArrowDown, FiEye, FiCalendar, FiRefreshCw, FiPhone, FiSearch } from 'react-icons/fi';
  
  const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [studentModalOpen, setStudentModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');
    const studentIntervalRef = useRef(null);
  
    useEffect(() => {
      fetchOverview();
      
      // Real-time refresh every 30 seconds
      const interval = setInterval(fetchOverview, 30000);
      return () => {
        clearInterval(interval);
        if (studentIntervalRef.current) {
          clearInterval(studentIntervalRef.current);
        }
      };
    }, []);
  
    const fetchOverview = async () => {
      try {
        setRefreshing(true);
        const response = await api.get('/analytics/overview');
        setStats(response.data.data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching overview:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
  
    const handleRefresh = () => {
      fetchOverview();
    };
  
    const fetchStudent = async (studentId) => {
      try {
        setStudentLoading(true);
        const response = await api.get(`/students/${studentId}`);
        setSelectedStudent(response.data.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setStudentLoading(false);
      }
    };
  
    const handleViewStudent = async (studentId) => {
      setStudentModalOpen(true);
      await fetchStudent(studentId);
  
      if (studentIntervalRef.current) clearInterval(studentIntervalRef.current);
      studentIntervalRef.current = setInterval(() => fetchStudent(studentId), 15000);
    };
  
    const closeStudentModal = () => {
      setStudentModalOpen(false);
      setSelectedStudent(null);
      if (studentIntervalRef.current) {
        clearInterval(studentIntervalRef.current);
        studentIntervalRef.current = null;
      }
    };
  
    if (loading) {
      return (
        <DashboardLayout>
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      );
    }
  
    const data = stats || { stats: {}, growth: {}, recentStudents: [], allCourses: [] };
    const s = data.stats || {};
    const g = data.growth || {};

    // Filter students based on search
    const filteredStudents = (data.recentStudents || []).filter(student => {
      if (!studentSearch.trim()) return true;
      const q = studentSearch.toLowerCase();
      return (
        (student.name || '').toLowerCase().includes(q) ||
        (student.email || '').toLowerCase().includes(q) ||
        (student.phone || '').includes(q)
      );
    });

    // Growth trend helper
    const getGrowthTrend = (growthStr) => {
      if (!growthStr) return 'neutral';
      return growthStr.startsWith('-') ? 'down' : 'up';
    };
  
    const statCards = [
      { 
        icon: FiUsers, 
        label: 'Total Students', 
        value: s.totalStudents || 0, 
        change: g.students || '0%',
        sub: `${g.studentsThisMonth || 0} this month`,
        trend: getGrowthTrend(g.students)
      },
      { 
        icon: FiBook, 
        label: 'Total Courses', 
        value: s.totalCourses || 0, 
        change: g.courses || '0%',
        sub: `${s.publishedCourses || 0} published · ${s.draftCourses || 0} draft`,
        trend: getGrowthTrend(g.courses)
      },
      { 
        icon: FiFileText, 
        label: 'Total Blogs', 
        value: s.totalBlogs || 0, 
        change: g.blogs || '0%',
        sub: `${s.publishedBlogs || 0} published · ${s.draftBlogs || 0} draft`,
        trend: getGrowthTrend(g.blogs)
      },
      { 
        icon: FiVideo, 
        label: 'Live Classes', 
        value: s.totalLiveClasses || 0, 
        change: g.liveClasses || '0%',
        sub: `${s.scheduledClasses || 0} scheduled · ${s.liveNow || 0} live now`,
        trend: getGrowthTrend(g.liveClasses)
      }
    ];
  
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Real-time platform analytics and metrics</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg">
                <FiCalendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center space-x-2 bg-blue-100 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
  
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              const isDown = stat.trend === 'down';
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.label}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </h3>
                      <div className="flex items-center">
                        {isDown ? (
                          <FiArrowDown className="w-4 h-4 text-red-500 mr-1" />
                        ) : (
                          <FiArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${isDown ? 'text-red-600' : 'text-green-600'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                      {stat.sub && (
                        <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                      )}
                    </div>
                    <div className="hidden sm:block p-3 rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
  
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* All Students */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Students
                    </h3>
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search recent..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {filteredStudents.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredStudents.map((student, index) => (
                        <div 
                          key={student._id || index}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={student.profilePicture || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(student.name || 'User')}`}
                                alt={student.name || 'Student'}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className={`absolute bottom-0 right-0 w-3 h-3 ${student.enrolledCourses?.length > 0 ? 'bg-green-400' : 'bg-gray-300'} border-2 border-white rounded-full`}></div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {student.name || 'Unknown Student'}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center">
                                {student.email || 'No email'}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                <FiPhone className="w-3 h-3 mr-1" />
                                {student.phone || 'No phone'}
                              </p>
                              {student.createdAt && (
                                <p className="text-xs text-gray-500">
                                  Joined {new Date(student.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button onClick={() => handleViewStudent(student._id)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                              <FiEye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">{studentSearch ? 'No students match your search' : 'No students yet'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* All Courses */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Courses ({s.totalCourses || 0})
                  </h3>
                </div>
                <div className="p-6">
                  {data.allCourses && data.allCourses.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {data.allCourses.map((course, index) => (
                        <div 
                          key={course._id || index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <FiBook className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {course.title || 'Untitled Course'}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {(course.enrollmentCount || 0).toLocaleString()} students
                              </p>
                              {course.instructor && (
                                <p className="text-xs text-gray-500">
                                  By {course.instructor}
                                </p>
                              )}
                              {!course.isPublished && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">Draft</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded">
                            <span className="text-amber-500 text-sm">★</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {course.rating || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FiBook className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No courses available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* Quick Stats — ALL REAL DATA */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Statistics
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    title: 'Avg. Course Rating', 
                    value: s.avgRating || '0', 
                    change: '',
                    icon: FiTrendingUp,
                    color: 'green'
                  },
                  { 
                    title: 'Total Enrollments', 
                    value: (s.totalEnrollments || 0).toLocaleString(), 
                    change: g.enrollments || '0%',
                    icon: FiUsers,
                    color: 'blue'
                  },
                  { 
                    title: 'Live Now', 
                    value: s.liveNow || 0, 
                    change: `${s.scheduledClasses || 0} upcoming`,
                    icon: FiVideo,
                    color: 'orange'
                  },
                  { 
                    title: 'Completed Classes', 
                    value: s.completedClasses || 0, 
                    change: `${g.liveClassesThisMonth || 0} this month`,
                    icon: FiBook,
                    color: 'purple'
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  const colorClasses = {
                    green: 'bg-green-50 text-green-600',
                    blue: 'bg-blue-50 text-blue-600',
                    purple: 'bg-purple-50 text-purple-600',
                    orange: 'bg-teal-50 text-teal-600'
                  };
  
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${colorClasses[item.color]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {item.change && (
                          <span className="text-xs font-medium text-gray-500">
                            {item.change}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{item.value}</h4>
                      <p className="text-sm text-gray-600">{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <Modal
          isOpen={studentModalOpen}
          onClose={closeStudentModal}
          title={studentLoading ? 'Loading...' : selectedStudent?.name || 'Student Details'}
          maxWidth="max-w-xl"
        >
          <div className="mt-4">
            {studentLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedStudent?.profilePicture || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(selectedStudent?.name || 'User')}`}
                    alt={selectedStudent?.name}
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{selectedStudent?.name}</p>
                    <p className="text-sm text-gray-600">{selectedStudent?.email}</p>
                    <p className="text-sm text-gray-600">{selectedStudent?.phone || 'No phone'}</p>
                  </div>
                </div>
  
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Student Analytics</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-blue-600 font-medium">Enrolled Courses</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedStudent?.enrolledCourses?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">Certificates</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedStudent?.certificates?.length || 0}</p>
                    </div>
                  </div>
                </div>
  
                <div className="mt-4">
                  <h4 className="font-semibold">Enrolled Courses</h4>
                  {selectedStudent?.enrolledCourses?.length > 0 ? (
                    <ul className="mt-2 space-y-2 max-h-40 overflow-auto">
                      {selectedStudent.enrolledCourses.map((en, i) => (
                        <li key={i} className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium">{en.courseId?.title || 'Unknown Course'}</p>
                          <p className="text-xs text-gray-500">Enrolled {new Date(en.enrolledAt || en.enrolledAt).toLocaleDateString()}</p>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-gray-500 mt-2">No enrolled courses</p>}
                </div>
  
                <div className="mt-6">
                  <button onClick={closeStudentModal} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Close</button>
                </div>
              </>
            )}
          </div>
        </Modal>
  
      </DashboardLayout>
    );
  };
  
  export default Dashboard;