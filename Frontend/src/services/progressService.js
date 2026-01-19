// client/src/services/progressService.js
import api from './api';

export const progressService = {
  // Get course progress
  getCourseProgress: async (courseId) => {
    try {
      const response = await api.get(`/progress/${courseId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get overall progress
  getOverallProgress: async () => {
    try {
      const response = await api.get('/progress/overall');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark lesson as complete
  completeLesson: async (lessonId) => {
    try {
      const response = await api.post(`/progress/lesson/${lessonId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Mark course as complete
  completeCourse: async (courseId) => {
    try {
      const response = await api.post(`/progress/course/${courseId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Track video watch time
  trackVideoTime: async (lessonId, watchTime) => {
    try {
      const response = await api.post(`/progress/lesson/${lessonId}/track-video`, {
        watchTime
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};