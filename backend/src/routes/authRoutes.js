/**
 * Authentication Routes
 * 
 * Defines all routes related to user authentication:
 * - POST /api/auth/signup - Register new user
 * - POST /api/auth/login - Login existing user
 */

import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  getProfileSummary
} from '../controllers/authController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/profile-summary', authenticate, getProfileSummary);

export default router;



