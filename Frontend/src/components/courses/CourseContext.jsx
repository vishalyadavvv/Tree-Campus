// client/src/context/CourseContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { courseService } from '../services/courseService';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all courses
  const fetchCourses = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAllCourses(filters);
      setCourses(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getEnrolledCourses();
      setEnrolledCourses(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  // Get single course
  const getCourse = async (id) => {
    try {
      setLoading(true);
      const data = await courseService.getCourse(id);
      setCurrentCourse(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Enroll in course
  const enrollInCourse = async (courseId) => {
    try {
      await courseService.enrollCourse(courseId);
      await fetchEnrolledCourses();
    } catch (err) {
      setError(err.message || 'Failed to enroll in course');
      throw err;
    }
  };

  const value = {
    courses,
    enrolledCourses,
    currentCourse,
    loading,
    error,
    fetchCourses,
    fetchEnrolledCourses,
    getCourse,
    enrollInCourse,
    setCurrentCourse
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
