/**
 * Redux Store Configuration
 * 
 * Configures the Redux store with all reducers (auth, bookmarks).
 * Uses Redux Toolkit for simplified store setup.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookmarksReducer from './slices/bookmarksSlice';

// Configure and create Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    bookmarks: bookmarksReducer
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;



