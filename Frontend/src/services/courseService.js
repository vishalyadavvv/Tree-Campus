// client/src/services/courseService.js
import api from './api';

export const courseService = {
  // Get all courses
  getAllCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/courses?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single course
  getCourse: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get course lessons
  getCourseLessons: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/lessons`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Enroll in course
  enrollCourse: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's enrolled courses
  getEnrolledCourses: async () => {
    try {
      const response = await api.get('/courses/my-courses');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Rate and review course
  reviewCourse: async (courseId, rating, comment) => {
    try {
      const response = await api.post(`/courses/${courseId}/review`, {
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};











