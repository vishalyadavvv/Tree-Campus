// client/src/utils/constants.js
export const API_URL = process.env.VITE_API_URL || 'https://tree-campus.onrender.com/api';

export const COURSE_LEVELS = {
  alllevels:'All Levels',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};

export const COURSE_LEVELS_HINDI = {
  alllevels:'सभी_स्तर',
  beginner: 'शुरुआती',
  intermediate: 'मध्यम',
  advanced: 'उन्नत'
};

export const COURSE_CATEGORIES = {
  'spoken-english': 'Spoken English',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  'business-english': 'Business English',
  writing: 'Writing Skills'
};

export const COURSE_CATEGORIES_HINDI = {
  'spoken-english': 'स्पोकन इंग्लिश',
  grammar: 'व्याकरण',
  vocabulary: 'शब्दावली',
  'business-english': 'बिजनेस इंग्लिश',
  writing: 'लेखन कौशल'
};

export const GAME_TYPES = {
  BIRD_SAVER: 'bird-saver',
  LOCK_KEY: 'lock-key',
  VOCABULARY: 'vocabulary'
};

export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  GAMES: '/games',
  LIVE_CLASSES: '/live-classes',
  SPOKEE: '/spokee',
  DASHBOARD: '/dashboard',
  
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register'
};
