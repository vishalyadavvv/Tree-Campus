    import express from 'express';
    import { completeLesson, getCourseProgress } from '../controllers/progressController.js';
    import { protect } from '../middleware/auth.js';

    const router = express.Router();

    router.post('/lesson/:id/complete', protect, completeLesson);
    router.get('/course/:id', protect, getCourseProgress);

    export default router;
