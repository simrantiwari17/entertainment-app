/**
 * Express Server Entry Point
 * 
 * This is the main server file that:
 * - Initializes Express app
 * - Connects to MongoDB database
 * - Sets up middleware (CORS, JSON parsing, etc.)
 * - Defines API routes
 * - Handles errors
 * - Starts the server
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware
// CORS: Allow requests from frontend (React app)
app.use(cors());

// JSON parser: Parse JSON request bodies
app.use(express.json());

// URL-encoded parser: Parse form data
app.use(express.urlencoded({ extended: true }));

// Health check route (optional - useful for deployment)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler: Handle requests to undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Get port from environment variables or use default
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
