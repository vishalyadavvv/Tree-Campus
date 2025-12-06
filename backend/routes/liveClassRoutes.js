import express from 'express';
import { getLiveClasses, getLiveClass, createLiveClass, updateLiveClass, deleteLiveClass } from '../controllers/liveClassController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getLiveClasses)
  .post(protect, adminOnly, createLiveClass);

router.route('/:id')
  .get(getLiveClass)
  .put(protect, adminOnly, updateLiveClass)
  .delete(protect, adminOnly, deleteLiveClass);

export default router;
