import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// @desc    Upload thumbnail
// @route   POST /api/upload/thumbnail
// @access  Private/Admin
router.post('/thumbnail', protect, adminOnly, upload.single('thumbnail'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the file URL
    const fileUrl = `/uploads/thumbnails/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        url: fileUrl,
        path: req.file.path
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
