import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up real-time refresh every 30 seconds
    refreshIntervalRef.current = setInterval(() => {
      fetchAnalyticsData();
    }, 30000);
    
    // Fetch student details if studentId is provided
    if (studentId) {
      fetchStudentData(studentId);
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [studentId]);

  const fetchAnalyticsData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // Get overview and enrollment trend data concurrently
      const [overviewRes, enrollmentRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/enrollments')
      ]);
      
      const overviewData = overviewRes.data.data;
      const enrollmentTrend = enrollmentRes.data.data;
      
      // Generate analytics data using real trend data
      const generatedData = processAnalyticsData(overviewData, enrollmentTrend);
      setAnalyticsData(generatedData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data');
      setAnalyticsData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStudentData = async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      setSelectedStudent(response.data.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  // Process analytics data from API responses
  const processAnalyticsData = (overviewData, enrollmentTrendData) => {
    if (!overviewData) return null;

    // Use enrollment trend directly from API
    const enrollmentTrend = enrollmentTrendData || [];

    // Generate course category data from all courses
    const courseCategories = overviewData.allCourses?.reduce((acc, course) => {
      const category = course.category || 'General';
      const existing = acc.find(item => item._id === category);
      
      if (existing) {
        existing.count += 1;
        existing.totalEnrollments += course.enrollmentCount || 0;
      } else {
        acc.push({
          _id: category,
          count: 1,
          totalEnrollments: course.enrollmentCount || 0
        });
      }
      return acc;
    }, []) || [];

    // Generate enrollment by course data
    const enrollmentByCourse = overviewData.allCourses?.map(course => ({
      courseName: course.title || course.name || 'Untitled Course',
      enrollments: course.enrollmentCount || 0
    })) || [];

    // Calculate total enrollments from actual course data
    const totalEnrollments = overviewData.stats?.totalEnrollments || 0;

    return {
      enrollmentTrend,
      courseCategories,
      enrollmentByCourse,
      overview: overviewData,
      totalEnrollments
    };
  };

  const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const { enrollmentTrend, courseCategories, enrollmentByCourse, totalEnrollments } = analyticsData || { enrollmentTrend: [], courseCategories: [], enrollmentByCourse: [], totalEnrollments: 0 };

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center min-h-96">
          <p className="text-red-600 mb-4 text-lg">Failed to load analytics data</p>
          <button
            onClick={() => fetchAnalyticsData()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedStudent ? `${selectedStudent.name}'s Analytics` : 'Analytics Dashboard'}
            </h1>
            <p className="text-gray-600 mt-1">
              {selectedStudent 
                ? `Student enrollment and progress tracking` 
                : 'Track your platform\'s performance and growth metrics'}
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            {error && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                {error}
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Student Info Card (if viewing specific student) */}
        {selectedStudent && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedStudent.profilePicture || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(selectedStudent.name || 'User')}`}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full border-2 border-blue-300"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                <p className="text-sm text-gray-600">{selectedStudent.phone || 'No phone'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Joined</p>
                <p className="font-semibold text-gray-900">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {(analyticsData.overview?.stats?.totalStudents || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {(analyticsData.overview?.stats?.totalEnrollments || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {(analyticsData.overview?.stats?.totalCourses || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analyticsData.overview?.stats?.categoriesCount || courseCategories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {Math.max(...enrollmentTrend.map(item => item.enrollments), 0)}
            </div>
            <div className="text-sm text-gray-600">Peak Enrollments</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Trend */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trend</h3>
            {enrollmentTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="enrollments" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#6366f1' }}
                    name="Enrollments"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No enrollment data available
              </div>
            )}
          </div>

          {/* Course Categories */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses by Category</h3>
            {courseCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ _id, count }) => `${_id}: ${count}`}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="_id"
                  >
                    {courseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, 'Courses']}
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No course category data available
              </div>
            )}
          </div>
        </div>

        {/* Enrollment by Course */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollments by Course</h3>
          {enrollmentByCourse.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={enrollmentByCourse}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="courseName" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [value, 'Enrollments']}
                />
                <Legend />
                <Bar 
                  dataKey="enrollments" 
                  fill="#ec4899" 
                  radius={[4, 4, 0, 0]}
                  name="Enrollments"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No enrollment data by course available
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;