import React, { useState, useEffect, useContext } from 'react';
import CourseList from '../components/courses/CourseList';
import CourseFilter from '../components/courses/CourseFilter';
import { CourseContext } from '../context/CourseContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enrolledCourses, fetchEnrolledCourses } = useContext(CourseContext);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    lang: 'all',
    search: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [visibleStats, setVisibleStats] = useState([]);

  // API Base URL - adjust this to match your backend
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Trigger animations
    setIsVisible(true);
    
    // Stagger stats animations
    [0, 1, 2, 3].forEach((index) => {
      setTimeout(() => {
        setVisibleStats(prev => [...prev, index]);
      }, 300 + (index * 150));
    });
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/courses`);
      
      console.log('API Response:', response.data);
      
      // Handle the response based on your API structure
      let coursesData = response.data.data || response.data.courses || response.data;
      
      // Sort courses alphabetically by title (so Part-1 comes before Part-2)
      if (Array.isArray(coursesData)) {
          coursesData = coursesData.sort((a, b) => a.title.localeCompare(b.title));
      }

      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || 'Failed to fetch courses');
      setLoading(false);
    }
  };

  useEffect(() => {
    filterCourses();
  }, [filters, courses, enrolledCourses]);

  const filterCourses = () => {
    let filtered = [...courses];

    // Level Filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    // Category Filter
    if (filters.category !== 'all') {
      if (filters.category === 'spoken-english') {
        // Show courses that start with "Spoken English" OR are in enrolled courses
        filtered = filtered.filter(course => {
          const isSpokenEnglish = course.category && course.category.toLowerCase().startsWith('spoken english');
          const isEnrolled = enrolledCourses.some(enrolled => enrolled._id === course._id);
          return isSpokenEnglish || isEnrolled;
        });
      } else if (filters.category === 'other') {
        filtered = filtered.filter(course => course.category === 'Other');
      } else {
        // Fallback for any other specific categories if added later
        filtered = filtered.filter(course => course.category === filters.category);
      }
    }

    // Language Filter
    if (filters.lang !== 'all') {
      filtered = filtered.filter(course => course.lang === filters.lang);
    }

    // Search Filter
    if (filters.search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="min-h-screen ">
      <div className="bg-teal-200/50 py-12 mb-8 border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#14B8A6] text-center drop-shadow-sm">
            Explore Our Courses
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-bold">Error Loading Courses</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchCourses}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Course Filter with Animation */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CourseFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Course List with Animation */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CourseList courses={filteredCourses} loading={loading} />
        </div>

        {/* No Results Message */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;