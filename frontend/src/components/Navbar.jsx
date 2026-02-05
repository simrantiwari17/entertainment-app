/**
 * Navigation Bar Component
 * 
 * Displays the main navigation bar with:
 * - Logo/App name
 * - Navigation links (Home, Movies, TV Series, Bookmarks)
 * - User info and logout button (if authenticated)
 */

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-dark-light p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
          🎬 Entertainment App
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-white hover:text-blue-400 transition"
          >
            Home
          </Link>
          <Link
            to="/movies"
            className="text-white hover:text-blue-400 transition"
          >
            Movies
          </Link>
          <Link
            to="/tv"
            className="text-white hover:text-blue-400 transition"
          >
            TV Series
          </Link>
          <Link
            to="/search"
            className="text-white hover:text-blue-400 transition"
          >
            Search
          </Link>
          <Link
            to="/suggest"
            className="text-white hover:text-blue-400 transition"
          >
            Suggest
          </Link>

          {/* Authentication Section */}
          {isAuthenticated ? (
            <>
              <Link
                to="/bookmarks"
                className="text-white hover:text-blue-400 transition"
              >
                Bookmarks
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-white hover:text-blue-400 transition"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center space-x-4">
                <span className="text-dark-lighter">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-blue-400 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



