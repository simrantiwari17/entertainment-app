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
import connectDB from './src/config/database.js';
import errorHandler from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import bookmarkRoutes from './src/routes/bookmarkRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import recentRoutes from './src/routes/recentRoutes.js';
import tmdbRoutes from './src/routes/tmdbRoutes.js';
import { verifyTmdbConnection } from './src/services/tmdbService.js';

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
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recent', recentRoutes);



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
const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    verifyTmdbConnection();
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`⚠️ Port ${port} is busy. Trying port ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    throw error;
  });
};

// Start server with automatic port fallback
startServer(DEFAULT_PORT);
