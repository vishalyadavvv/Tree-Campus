import express from 'express';
import { getCertificates, getCertificate, getCertificateStatus } from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getCertificates);
router.get('/status', getCertificateStatus);
router.get('/:id', getCertificate);

export default router;
