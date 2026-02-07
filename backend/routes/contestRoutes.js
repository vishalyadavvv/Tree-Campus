import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAllExams, getExamById, submitExam, getLeaderboard, claimGameReward, getCouponStatus, redeemCoupon } from '../controllers/contestController.js';

const router = express.Router();

router.get('/exams', protect, getAllExams);
router.get('/exams/:id', protect, getExamById);
router.post('/exams/:id/submit', protect, submitExam);
router.get('/leaderboard/:id', protect, getLeaderboard);

// Game Reward API
router.post('/game-reward', protect, claimGameReward);

// Public Validation APIs (Internal Partner Key check inside controllers)
router.get('/public/validate/:couponCode', getCouponStatus);
router.post('/public/redeem/:couponCode', redeemCoupon);

export default router;
