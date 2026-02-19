import express from 'express';
import { 
  createAssessment, 
  getUserAssessments, 
  deleteAssessment 
} from '../controllers/assessmentController.js';
import { validateAssessment } from '../utils/validators.js';

const router = express.Router();

/**
 * @route   POST /api/assessment
 * @desc    Create health assessment and get risk predictions
 * @access  Protected
 */
router.post('/', validateAssessment, createAssessment);

/**
 * @route   GET /api/assessment/user/:userId
 * @desc    Get all assessments for a user
 * @access  Protected
 */
router.get('/user/:userId', getUserAssessments);

/**
 * @route   DELETE /api/assessment/:id
 * @desc    Delete an assessment
 * @access  Protected
 */
router.delete('/:id', deleteAssessment);

export default router;

