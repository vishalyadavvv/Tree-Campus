// client/src/services/quizService.js
import api from './api';

export const quizService = {
  // Get quiz by lesson ID
  getQuiz: async (lessonId) => {
    try {
      const response = await api.get(`/quiz/${lessonId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Submit quiz answers
  submitQuiz: async (quizId, answers) => {
    try {
      const response = await api.post(`/quiz/${quizId}/submit`, { answers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get quiz results
  getQuizResults: async (quizId) => {
    try {
      const response = await api.get(`/quiz/${quizId}/results`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};