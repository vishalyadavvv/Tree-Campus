import express from 'express';
import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer
} from '../controllers/volunteerController.js';


const router = express.Router();

// POST /api/volunteer - Submit volunteer application
router.post('/', createVolunteer);

// GET /api/volunteers - Get all volunteers
router.get('/', getAllVolunteers);

// GET /api/volunteer/:id - Get volunteer by ID
router.get('/:id', getVolunteerById);

// PATCH /api/volunteer/:id/status - Update volunteer status
router.patch('/:id/status', updateVolunteerStatus);

// DELETE /api/volunteer/:id - Delete volunteer
router.delete('/:id', deleteVolunteer);

export default router;
