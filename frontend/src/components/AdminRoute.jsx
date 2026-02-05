import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Admin Route Component
 * 
 * Protects routes that require admin privileges.
 * Redirects to login if not authenticated.
 * Redirects to home if authenticated but not an admin.
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <div className="text-white text-center mt-10">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
