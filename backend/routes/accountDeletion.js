import express from 'express';
import {
  createDeletionRequest,
  verifyDeletionRequest,
  getAllDeletionRequests,
  getDeletionRequestById,
  updateDeletionStatus,
  cancelDeletionRequest
} from '../controllers/accountDeletion.js';


const router = express.Router();

// POST /api/account-deletion-request - Submit deletion request
router.post('/', createDeletionRequest);

// GET /api/account-deletion-request/verify/:token - Verify email
router.get('/verify/:token', verifyDeletionRequest);

// GET /api/account-deletion-requests - Get all requests (Admin)
router.get('/all', getAllDeletionRequests);

// GET /api/account-deletion-request/:id - Get request by ID
router.get('/:id', getDeletionRequestById);

// PATCH /api/account-deletion-request/:id/status - Update status (Admin)
router.patch('/:id/status', updateDeletionStatus);

// DELETE /api/account-deletion-request/:id - Cancel request
router.delete('/:id', cancelDeletionRequest);

export default router;
