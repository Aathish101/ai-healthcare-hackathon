import express from 'express';
import { chatWithAI } from '../controllers/chatController.js';

const router = express.Router();

/**
 * @route   POST /api/chat
 * @desc    Chat with AI health assistant
 * @access  Protected
 */
router.post('/', chatWithAI);

export default router;

