/**
 * Bookmark Controller
 * 
 * Handles CRUD operations for bookmarks:
 * - Create bookmark (POST)
 * - Get all bookmarks for a user (GET)
 * - Delete bookmark (DELETE)
 * - Update bookmark notes/status (PUT)
 */

import Bookmark from '../models/Bookmark.js';

/**
 * @route   POST /api/bookmarks
 * @desc    Create a new bookmark
 * @access  Private (requires authentication)
 */
export const createBookmark = async (req, res, next) => {
  try {
    const { contentId, contentType, title, posterPath, releaseDate, notes, watchStatus } = req.body;
    const userId = req.user.userId;
    
    // Validation: Check if required fields are provided
    if (!contentId || !contentType || !title) {
      return res.status(400).json({
        success: false,
        message: 'contentId, contentType, and title are required'
      });
    }
    
    // Check if bookmark already exists for this user
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      contentId,
      contentType
    });
    
    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'This item is already bookmarked'
      });
    }
    
    // Create new bookmark
    const bookmark = await Bookmark.create({
      user: userId,
      contentId,
      contentType,
      title,
      posterPath: posterPath || null,
      releaseDate: releaseDate || null,
      notes: notes || null,
      watchStatus: watchStatus || 'planned'
    });
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Bookmark created successfully',
      data: bookmark
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * @route   GET /api/bookmarks
 * @desc    Get all bookmarks for the authenticated user
 * @access  Private (requires authentication)
 */
export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    // Optional query parameters for filtering
    const { contentType, watchStatus } = req.query;
    
    // Build filter object
    const filter = { user: userId };
    if (contentType) filter.contentType = contentType;
    if (watchStatus) filter.watchStatus = watchStatus;
    
    // Find all bookmarks for this user (sorted by newest first)
    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Bookmarks retrieved successfully',
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * @route   DELETE /api/bookmarks/:id
 * @desc    Delete a bookmark by ID
 * @access  Private (requires authentication)
 */
export const deleteBookmark = async (req, res, next) => {
  try {
    const bookmarkId = req.params.id;
    const userId = req.user.userId;
    
    // Find bookmark and verify it belongs to the authenticated user
    const bookmark = await Bookmark.findOne({
      _id: bookmarkId,
      user: userId
    });
    
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found or you do not have permission to delete it'
      });
    }
    
    // Delete bookmark
    await Bookmark.findByIdAndDelete(bookmarkId);
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Bookmark deleted successfully',
      data: {}
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * @route   PUT /api/bookmarks/:id
 * @desc    Update bookmark notes and/or watch status
 * @access  Private (requires authentication)
 */
export const updateBookmark = async (req, res, next) => {
  try {
    const bookmarkId = req.params.id;
    const userId = req.user.userId;
    const { notes, watchStatus } = req.body;
    
    // Build update object (only include fields that are provided)
    const updateData = {};
    if (notes !== undefined) updateData.notes = notes;
    if (watchStatus !== undefined) {
      // Validate watchStatus value
      if (!['planned', 'watching', 'completed'].includes(watchStatus)) {
        return res.status(400).json({
          success: false,
          message: 'watchStatus must be one of: planned, watching, completed'
        });
      }
      updateData.watchStatus = watchStatus;
    }
    
    // If no update data provided, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide notes and/or watchStatus to update'
      });
    }
    
    // Find bookmark and verify it belongs to the authenticated user
    const bookmark = await Bookmark.findOne({
      _id: bookmarkId,
      user: userId
    });
    
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found or you do not have permission to update it'
      });
    }
    
    // Update bookmark
    const updatedBookmark = await Bookmark.findByIdAndUpdate(
      bookmarkId,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Bookmark updated successfully',
      data: updatedBookmark
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};



