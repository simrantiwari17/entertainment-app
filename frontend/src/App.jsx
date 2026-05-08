/**
 * Main App Component
 * 
 * Sets up React Router and renders the main application structure.
 * Includes Navbar on all pages and routes to different pages.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import UserNavbar from './components/UserNavbar';
import AdminNavbar from './components/AdminNavbar';
import PrivateRoute from './components/PrivateRoute';
import UserRouteGuard from './components/UserRouteGuard';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVSeries from './pages/TVSeries';
import Search from './pages/Search';
import Suggest from './pages/Suggest';
import Details from './pages/Details';
import Bookmarks from './pages/Bookmarks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';

function App() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <div className="min-h-screen bg-dark">
        {isAdmin ? <AdminNavbar /> : <UserNavbar />}

        <main>
          <Routes>
            {isAdmin ? (
              <>
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>
              </>
            ) : (
              <>
                <Route path="/login" element={<UserRouteGuard><Login /></UserRouteGuard>} />
                <Route path="/signup" element={<UserRouteGuard><Signup /></UserRouteGuard>} />
                <Route path="/" element={<UserRouteGuard><Home /></UserRouteGuard>} />
                <Route path="/movies" element={<UserRouteGuard><Movies /></UserRouteGuard>} />
                <Route path="/tv" element={<UserRouteGuard><TVSeries /></UserRouteGuard>} />
                <Route path="/search" element={<UserRouteGuard><Search /></UserRouteGuard>} />
                <Route path="/suggest" element={<UserRouteGuard><Suggest /></UserRouteGuard>} />
                <Route path="/movie/:id" element={<UserRouteGuard><Details /></UserRouteGuard>} />
                <Route path="/tv/:id" element={<UserRouteGuard><Details /></UserRouteGuard>} />
                <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </>
            )}
            <Route path="*" element={<Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />} />
          </Routes>
        </main>

        {!isAdmin && <Chatbot />}
      </div>
    </Router >
  );
}

export default App;



