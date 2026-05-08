import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import ThemeToggle from './ThemeToggle';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-dark-light p-4 sticky top-0 z-50 border-b border-dark-lighter">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/admin/dashboard" className="text-2xl font-bold text-white hover:text-blue-400 transition">
          Admin Panel
        </Link>

        <div className="flex items-center gap-4 md:gap-6 text-sm md:text-base">
          <Link to="/admin/dashboard" className="text-white hover:text-blue-400 transition">Dashboard</Link>
          <Link to="/admin/users" className="text-white hover:text-blue-400 transition">User Management</Link>
          <span className="text-white">Analytics</span>
          <ThemeToggle />
          <span className="text-dark-lighter hidden md:inline">{user?.name || user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
