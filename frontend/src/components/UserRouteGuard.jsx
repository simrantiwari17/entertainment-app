import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserRouteGuard = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default UserRouteGuard;
