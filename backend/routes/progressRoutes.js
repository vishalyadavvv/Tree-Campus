const express = require('express');
const router = express.Router();
const {
  markLessonComplete,
  getCourseProgress,
  getUserAnalytics,
  issueCertificate,
  getUserCertificates,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

// All routes are protected (student only)
router.post('/lesson/:lessonId/complete', protect, markLessonComplete);
router.get('/course/:courseId', protect, getCourseProgress);
router.get('/analytics', protect, getUserAnalytics);
router.post('/course/:courseId/certificate', protect, issueCertificate);
router.get('/certificates', protect, getUserCertificates);

module.exports = router;
