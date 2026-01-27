import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAllExams, getExamById, submitExam, getLeaderboard } from '../controllers/contestController.js';

const router = express.Router();

router.get('/exams', protect, getAllExams);
router.get('/exams/:id', protect, getExamById);
router.post('/exams/:id/submit', protect, submitExam);
router.get('/leaderboard/:id', protect, getLeaderboard);

export default router;
