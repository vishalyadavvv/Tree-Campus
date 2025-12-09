import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
});

router.post('/file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'generic/uploads',
      resource_type: 'image'
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({
          success: false,
          message: 'Error uploading to Cloudinary'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id
        }
      });
    }
  );

  Readable.from(req.file.buffer).pipe(uploadStream);
});

export default router;