/**
 * Admin Controller
 * 
 * Handles admin-only operations:
 * - System statistics
 * - User management
 */

import User from '../models/User.js';
import Bookmark from '../models/Bookmark.js';

/**
 * Get system statistics
 * Returns counts of users and bookmarks
 */
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookmarks = await Bookmark.countDocuments();

        // Get recent users (last 5)
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalBookmarks,
                recentUsers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching admin stats',
            error: error.message
        });
    }
};

/**
 * Get all users
 */
export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own admin account'
            });
        }

        // Delete user's bookmarks first (optional since we don't have cascade in Mongoose Schema usually, but good practice)
        await Bookmark.deleteMany({ user: user._id });

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};
