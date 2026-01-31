/**
 * API Service
 * 
 * Handles all HTTP requests to the backend API.
 * Uses Axios for making requests with automatic token injection.
 */

import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor to add JWT token to all requests
 * Gets token from localStorage and adds it to Authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor to handle token expiration
 * If token is invalid/expired, clear localStorage and redirect to login
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login (handled by React Router in App.jsx)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Sign up new user
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },
  
  // Login existing user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
};

// Bookmarks API calls
export const bookmarksAPI = {
  // Get all bookmarks for authenticated user
  getBookmarks: async () => {
    const response = await api.get('/bookmarks');
    return response.data;
  },
  
  // Create new bookmark
  createBookmark: async (bookmarkData) => {
    const response = await api.post('/bookmarks', bookmarkData);
    return response.data;
  },
  
  // Delete bookmark by ID
  deleteBookmark: async (bookmarkId) => {
    const response = await api.delete(`/bookmarks/${bookmarkId}`);
    return response.data;
  },
  
  // Update bookmark notes/status
  updateBookmark: async (bookmarkId, updateData) => {
    const response = await api.put(`/bookmarks/${bookmarkId}`, updateData);
    return response.data;
  }
};

export default api;



