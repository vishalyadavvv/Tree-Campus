import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
