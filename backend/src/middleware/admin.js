/**
 * Admin-only middleware
 *
 * Requires `authenticate` to have run first so `req.user` is set.
 * Blocks access if the user is not an admin.
 */

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

export default adminOnly;

