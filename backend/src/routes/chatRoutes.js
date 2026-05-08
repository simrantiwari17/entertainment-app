/**
 * Chatbot Routes
 *
 * Public route for chatbot conversation.
 */

import express from 'express';
import { chatWithBot } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', chatWithBot);

export default router;
