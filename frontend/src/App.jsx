/**
 * Main App Component
 * 
 * Sets up React Router and renders the main application structure.
 * Includes Navbar on all pages and routes to different pages.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVSeries from './pages/TVSeries';
import Search from './pages/Search';
import Suggest from './pages/Suggest';
import Details from './pages/Details';
import Bookmarks from './pages/Bookmarks';
import Login from './pages/Login';

import Signup from './pages/Signup';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        {/* Navigation Bar - visible on all pages */}
        <Navbar />

        {/* Main Content */}
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVSeries />} />
            <Route path="/search" element={<Search />} />
            <Route path="/suggest" element={<Suggest />} />
            <Route path="/movie/:id" element={<Details />} />
            <Route path="/tv/:id" element={<Details />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes (require authentication) */}
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes (require auth + admin role) */}
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
              {/* Redirect /admin to /admin/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router >
  );
}

export default App;



