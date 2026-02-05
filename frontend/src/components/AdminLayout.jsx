import { Link, Outlet, useLocation } from 'react-router-dom';

/**
 * Admin Layout Component
 * 
 * Provides the structure for admin pages with a sidebar navigation.
 */
const AdminLayout = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-dark text-white pt-20"> {/* pt-20 to account for fixed Navbar */}
            {/* Sidebar */}
            <aside className="w-64 bg-dark-light border-r border-gray-700 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-400 uppercase tracking-wider text-sm">Admin Panel</h2>
                    <nav className="space-y-2">
                        <Link
                            to="/admin/dashboard"
                            className={`block px-4 py-2 rounded transition ${isActive('/admin/dashboard')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/users"
                            className={`block px-4 py-2 rounded transition ${isActive('/admin/users')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            Users
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
