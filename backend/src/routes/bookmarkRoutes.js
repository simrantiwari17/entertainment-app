/**
 * Bookmark Routes
 * 
 * Defines all routes related to bookmarks:
 * - POST /api/bookmarks - Create new bookmark
 * - GET /api/bookmarks - Get all bookmarks for authenticated user
 * - DELETE /api/bookmarks/:id - Delete bookmark by ID
 * - PUT /api/bookmarks/:id - Update bookmark notes/status
 */

import express from 'express';
import authenticate from '../middleware/auth.js';
import {
  createBookmark,
  getBookmarks,
  deleteBookmark,
  updateBookmark
} from '../controllers/bookmarkController.js';

const router = express.Router();

// All bookmark routes require authentication
router.use(authenticate);

// Bookmark CRUD routes
router.post('/', createBookmark);
router.get('/', getBookmarks);
router.delete('/:id', deleteBookmark);
router.put('/:id', updateBookmark);

export default router;



