import express from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

export default router;
