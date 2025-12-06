import express from 'express';
import { getOverview, getCourseAnalytics, getEnrollmentAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/overview', getOverview);
router.get('/courses', getCourseAnalytics);
router.get('/enrollments', getEnrollmentAnalytics);

export default router;
