import express from 'express';
import authenticate from '../middleware/auth.js';
import isAdmin from '../middleware/adminMiddleware.js';
import {
  getStats,
  getUsers,
  deleteUser,
  toggleUserBlock
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(authenticate, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/block', toggleUserBlock);

export default router;
