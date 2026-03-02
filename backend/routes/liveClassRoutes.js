import express from 'express';
import { getLiveClasses, getLiveClass, createLiveClass, updateLiveClass, deleteLiveClass, deleteLiveClassSeries, getMeetingSignature } from '../controllers/liveClassController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getLiveClasses)
  .post(protect, adminOnly, createLiveClass);

// Series route MUST come before /:id to avoid "series" being treated as an id
router.route('/series/:seriesId')
  .delete(protect, adminOnly, deleteLiveClassSeries);

router.route('/:id')
  .get(getLiveClass)
  .put(protect, adminOnly, updateLiveClass)
  .delete(protect, adminOnly, deleteLiveClass);

router.post('/:id/signature', protect, getMeetingSignature);

export default router;
