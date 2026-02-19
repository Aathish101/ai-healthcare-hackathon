import express from 'express';
import {
  createAssessment,
  getUserAssessments,
  deleteAssessment
} from '../controllers/assessmentController.js';
import { validateAssessment } from '../utils/validators.js';

const router = express.Router();

/**
 * @route   POST /api/assessment/submit
 * @desc    Create health assessment and get risk predictions
 * @access  Protected
 */
router.post('/submit', validateAssessment, createAssessment);

/**
 * @route   GET /api/assessment/:profileId
 * @desc    Get all assessments for a specific profile
 * @access  Protected
 */
router.get('/:profileId', getUserAssessments); // We will update controller to use profileId

/**
 * @route   DELETE /api/assessment/:id
 * @desc    Delete an assessment
 * @access  Protected
 */
router.delete('/:id', deleteAssessment);

export default router;

