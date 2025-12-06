import express from 'express';
import {
  createSchoolRegistration,
  getAllSchoolRegistrations,
  getSchoolRegistrationById,
  updateSchoolRegistrationStatus,
  deleteSchoolRegistration
} from '../controllers/schoolRegistration.js';
// import { validateSchoolRegistration } from '../middleware/schoolRegistrationValidator.js';

const router = express.Router();

// POST /api/registerSchool - Submit school registration
router.post('/',  createSchoolRegistration);

// GET /api/registerSchool - Get all school registrations
router.get('/', getAllSchoolRegistrations);

// GET /api/registerSchool/:id - Get school registration by ID
router.get('/:id', getSchoolRegistrationById);

// PATCH /api/registerSchool/:id/status - Update school registration status
router.patch('/:id/status', updateSchoolRegistrationStatus);

// DELETE /api/registerSchool/:id - Delete school registration
router.delete('/:id', deleteSchoolRegistration);

export default router;
