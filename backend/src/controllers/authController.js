/**
 * Authentication Controller
 * 
 * Handles user authentication operations:
 * - Sign up (register new users)
 * - Login (authenticate existing users)
 */

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Bookmark from '../models/Bookmark.js';
import RecentlyViewed from '../models/RecentlyViewed.js';
import { getMovieDetails, getTVDetails } from '../services/tmdbService.js';

/**
 * Generate JWT token for authenticated user
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validation: Check if required fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password will be hashed automatically by pre-save hook)
    const user = await User.create({
      email,
      password,
      name: name || undefined
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send success response with token and user info (without password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation: Check if required fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account is blocked. Please contact admin.'
      });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send success response with token and user info (without password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update authenticated user profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/auth/profile-summary
 * @desc    Get user profile summary stats
 * @access  Private
 */
export const getProfileSummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const [bookmarks, recentActivity] = await Promise.all([
      Bookmark.find({ user: userId }).sort({ createdAt: -1 }).limit(12),
      RecentlyViewed.find({ userId }).sort({ viewedAt: -1 }).limit(10)
    ]);

    const totalBookmarks = bookmarks.length;
    const activitySummary = {
      recentViews: recentActivity.length,
      completedBookmarks: bookmarks.filter((item) => item.watchStatus === 'completed').length
    };

    const genreCountMap = {};

    if (process.env.TMDB_API_KEY) {
      const genrePromises = bookmarks.slice(0, 8).map(async (bookmark) => {
        try {
          const data =
            bookmark.contentType === 'tv'
              ? await getTVDetails(bookmark.contentId)
              : await getMovieDetails(bookmark.contentId);
          return Array.isArray(data?.genres)
            ? data.genres.map((genre) => genre.name)
            : [];
        } catch {
          return [];
        }
      });

      const genreLists = await Promise.allSettled(genrePromises);
      genreLists.forEach((result) => {
        if (result.status === 'fulfilled') {
          result.value.forEach((genreName) => {
            genreCountMap[genreName] = (genreCountMap[genreName] || 0) + 1;
          });
        }
      });
    }

    const favoriteGenres = Object.entries(genreCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    return res.status(200).json({
      success: true,
      data: {
        totalBookmarks,
        favoriteGenres,
        activitySummary
      }
    });
  } catch (error) {
    return next(error);
  }
};
