import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import ThemeToggle from './ThemeToggle';

const UserNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-dark-light p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
          Entertainment App
        </Link>

        <div className="flex items-center gap-4 md:gap-6 text-sm md:text-base">
          <Link to="/" className="text-white hover:text-blue-400 transition">Home</Link>
          <Link to="/movies" className="text-white hover:text-blue-400 transition">Movies</Link>
          <Link to="/tv" className="text-white hover:text-blue-400 transition">TV Series</Link>
          <Link to="/search" className="text-white hover:text-blue-400 transition">Search</Link>
          <Link to="/suggest" className="text-white hover:text-blue-400 transition">Suggest</Link>

          {isAuthenticated ? (
            <>
              <Link to="/bookmarks" className="text-white hover:text-blue-400 transition">Bookmarks</Link>
              <Link to="/profile" className="text-white hover:text-blue-400 transition">Profile</Link>
              <span className="text-dark-lighter hidden md:inline">{user?.name || user?.email}</span>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/login" className="text-white hover:text-blue-400 transition">Login</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
