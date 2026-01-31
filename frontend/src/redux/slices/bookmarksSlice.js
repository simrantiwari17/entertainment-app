/**
 * Bookmarks Redux Slice
 * 
 * Manages bookmarks state:
 * - List of bookmarked movies/TV shows
 * - CRUD operations for bookmarks
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookmarksAPI } from '../../services/api';

const initialState = {
  bookmarks: [],
  loading: false,
  error: null
};

/**
 * Async thunk for fetching all bookmarks
 */
export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookmarksAPI.getBookmarks();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookmarks'
      );
    }
  }
);

/**
 * Async thunk for creating a bookmark
 */
export const createBookmark = createAsyncThunk(
  'bookmarks/createBookmark',
  async (bookmarkData, { rejectWithValue }) => {
    try {
      const response = await bookmarksAPI.createBookmark(bookmarkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create bookmark'
      );
    }
  }
);

/**
 * Async thunk for deleting a bookmark
 */
export const deleteBookmark = createAsyncThunk(
  'bookmarks/deleteBookmark',
  async (bookmarkId, { rejectWithValue }) => {
    try {
      await bookmarksAPI.deleteBookmark(bookmarkId);
      return bookmarkId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete bookmark'
      );
    }
  }
);

/**
 * Async thunk for updating a bookmark (notes/status)
 */
export const updateBookmark = createAsyncThunk(
  'bookmarks/updateBookmark',
  async ({ bookmarkId, updateData }, { rejectWithValue }) => {
    try {
      const response = await bookmarksAPI.updateBookmark(bookmarkId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update bookmark'
      );
    }
  }
);

// Create bookmarks slice with reducers
const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    /**
     * Clear error messages
     */
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchBookmarks pending
    builder.addCase(fetchBookmarks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    // Handle fetchBookmarks success
    builder.addCase(fetchBookmarks.fulfilled, (state, action) => {
      state.loading = false;
      state.bookmarks = action.payload;
      state.error = null;
    });
    
    // Handle fetchBookmarks error
    builder.addCase(fetchBookmarks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Handle createBookmark pending
    builder.addCase(createBookmark.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    // Handle createBookmark success
    builder.addCase(createBookmark.fulfilled, (state, action) => {
      state.loading = false;
      state.bookmarks.unshift(action.payload); // Add to beginning of array
      state.error = null;
    });
    
    // Handle createBookmark error
    builder.addCase(createBookmark.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Handle deleteBookmark pending
    builder.addCase(deleteBookmark.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    // Handle deleteBookmark success
    builder.addCase(deleteBookmark.fulfilled, (state, action) => {
      state.loading = false;
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark._id !== action.payload
      );
      state.error = null;
    });
    
    // Handle deleteBookmark error
    builder.addCase(deleteBookmark.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Handle updateBookmark pending
    builder.addCase(updateBookmark.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    // Handle updateBookmark success
    builder.addCase(updateBookmark.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.bookmarks.findIndex(
        (bookmark) => bookmark._id === action.payload._id
      );
      if (index !== -1) {
        state.bookmarks[index] = action.payload;
      }
      state.error = null;
    });
    
    // Handle updateBookmark error
    builder.addCase(updateBookmark.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

// Export actions
export const { clearError } = bookmarksSlice.actions;

// Export reducer
export default bookmarksSlice.reducer;



