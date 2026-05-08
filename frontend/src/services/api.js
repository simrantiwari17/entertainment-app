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
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const isNetworkError = !error.response;
    const localPorts = [5000, 5001, 5002, 5003, 5004, 5005];
    const baseURL = typeof originalRequest.baseURL === 'string' ? originalRequest.baseURL : '';
    const localhostMatch = baseURL.match(/localhost:(\d+)/);

    if (isNetworkError && localhostMatch) {
      const currentPort = Number(localhostMatch[1]);
      const triedPorts = Array.isArray(originalRequest.__triedPorts) ? originalRequest.__triedPorts : [currentPort];
      originalRequest.__triedPorts = triedPorts;

      const nextPort = localPorts.find((port) => !triedPorts.includes(port));
      if (nextPort) {
        originalRequest.__triedPorts = [...triedPorts, nextPort];
        originalRequest.baseURL = baseURL.replace(`localhost:${currentPort}`, `localhost:${nextPort}`);
        return api(originalRequest);
      }
    }

    if (status === 401) {
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
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (payload) => {
    const response = await api.put('/auth/profile', payload);
    return response.data;
  },

  // Get profile summary stats
  getProfileSummary: async () => {
    const response = await api.get('/auth/profile-summary');
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

// Admin API calls
export const adminAPI = {
  // Get system stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  toggleBlockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  }
};

export const recentAPI = {
  add: async (payload) => {
    const response = await api.post('/recent', payload);
    return response.data;
  },
  list: async () => {
    const response = await api.get('/recent');
    return response.data;
  }
};

// Chatbot API calls (public)
export const chatAPI = {
  sendMessage: async (message) => {
    const response = await api.post('/chat', { message });
    return response.data;
  }
};

export default api;
