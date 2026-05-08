import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminAPI.getStats();
                if (response.success) {
                    setStats(response.data);
                } else {
                    setError('Failed to fetch stats');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error connecting to server');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-white text-center">Loading stats...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!stats) return null;

    return (
        <div>
            <h1 className="text-3xl font-light text-white mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-light p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Users</h3>
                    <p className="text-4xl text-white font-bold">{stats.totalUsers}</p>
                </div>

                <div className="bg-dark-light p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Bookmarks</h3>
                    <p className="text-4xl text-white font-bold">{stats.totalBookmarks}</p>
                </div>

                <div className="bg-dark-light p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Users (7 Days)</h3>
                    <p className="text-4xl text-white font-bold">{stats.activeUsers || 0}</p>
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-dark-light rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl text-white font-bold">Recent Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {stats.recentUsers.map((user) => (
                                <tr key={user._id} className="text-gray-300 hover:bg-gray-700 transition">
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.name || '-'}</td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {stats.recentUsers.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-400">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-dark-light rounded-lg shadow-lg overflow-hidden mt-8">
                <div className="p-6">
                    <h2 className="text-xl text-white font-bold mb-2">Content Source</h2>
                    <p className="text-gray-300">
                        Content is fetched dynamically from TMDB API. Manual content management is disabled.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
