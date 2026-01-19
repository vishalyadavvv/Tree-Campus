    import express from 'express';
    import { completeLesson, completeCourse, getCourseProgress, trackVideoTime } from '../controllers/progressController.js';
    import { protect } from '../middleware/auth.js';

    const router = express.Router();

    router.post('/lesson/:id/complete', protect, completeLesson);
    router.post('/lesson/:id/track-video', protect, trackVideoTime);
    router.post('/course/:id/complete', protect, completeCourse);
    router.get('/course/:id', protect, getCourseProgress);

    export default router;
