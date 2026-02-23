import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly as admin } from '../middleware/adminMiddleware.js';
import { createExam, updateExam, deleteExam, getAdminExams, generateCoupons, getCoupons, processExpiredExams, deleteCoupon, toggleCouponStatus, bulkUploadCoupons } from '../controllers/adminContestController.js';

const router = express.Router();

router.route('/exams')
    .get(protect, admin, getAdminExams)
    .post(protect, admin, createExam);

router.route('/coupons')
    .get(protect, admin, getCoupons)
    .post(protect, admin, generateCoupons);

router.post('/coupons/bulk', protect, admin, bulkUploadCoupons);

router.route('/coupons/:id')
    .delete(protect, admin, deleteCoupon);

router.route('/coupons/:id/toggle')
    .put(protect, admin, toggleCouponStatus);

router.route('/process-expired-exams')
    .get(protect, admin, processExpiredExams);

router.route('/exams/:id')
    .put(protect, admin, updateExam)
    .delete(protect, admin, deleteExam);

export default router;
