/**
 * Admin Middleware
 * 
 * Checks if the authenticated user has 'admin' role.
 * Must be placed AFTER the auth middleware.
 */

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

export default isAdmin;
