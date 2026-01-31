/**
 * Authentication Routes
 * 
 * Defines all routes related to user authentication:
 * - POST /api/auth/signup - Register new user
 * - POST /api/auth/login - Login existing user
 */

import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);

export default router;



