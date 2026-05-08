/**
 * Admin Controller
 * 
 * Handles admin-only operations:
 * - System statistics
 * - User management
 */

import User from '../models/User.js';
import Bookmark from '../models/Bookmark.js';

const buildDateFilter = (dateFrom, dateTo) => {
    if (!dateFrom && !dateTo) return null;
    const createdAt = {};
    if (dateFrom) createdAt.$gte = new Date(dateFrom);
    if (dateTo) createdAt.$lte = new Date(`${dateTo}T23:59:59.999Z`);
    return { createdAt };
};

/**
 * Get system statistics
 * Returns counts of users and bookmarks
 */
export const getStats = async (req, res) => {
    try {
        const [totalUsers, totalBookmarks, activeUsers] = await Promise.all([
            User.countDocuments(),
            Bookmark.countDocuments(),
            User.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
        ]);

        // Get recent users (last 5)
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalBookmarks,
                activeUsers,
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
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const { search, role, blocked, dateFrom, dateTo } = req.query;

        const filter = {};
        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) filter.role = role;
        if (blocked === 'true') filter.isBlocked = true;
        if (blocked === 'false') filter.isBlocked = false;
        const dateFilter = buildDateFilter(dateFrom, dateTo);
        if (dateFilter) Object.assign(filter, dateFilter);

        const [users, total] = await Promise.all([
            User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

export const toggleUserBlock = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot block/unblock your own account'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: { id: user._id, isBlocked: user.isBlocked }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating user block status',
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
