import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { useSelector } from 'react-redux';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        blocked: '',
        dateFrom: '',
        dateTo: ''
    });
    const { user: currentUser } = useSelector(state => state.auth);

    const fetchUsers = useCallback(async (page = 1, nextFilters = {
        search: '',
        role: '',
        blocked: '',
        dateFrom: '',
        dateTo: ''
    }) => {
        try {
            setLoading(true);
            const params = { page, limit: 10, ...nextFilters };
            const cleaned = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value !== '')
            );
            const data = await adminAPI.getUsers(cleaned);
            if (data.success) {
                setUsers(data.data);
                setPagination(data.pagination || { page: 1, totalPages: 1 });
                setError(null);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error connecting to server');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(1, {
            search: '',
            role: '',
            blocked: '',
            dateFrom: '',
            dateTo: ''
        });
    }, [fetchUsers]);

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

        try {
            await adminAPI.deleteUser(userId);
            fetchUsers(pagination.page, filters);
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting user');
        }
    };

    const handleToggleBlock = async (userId) => {
        try {
            await adminAPI.toggleBlockUser(userId);
            fetchUsers(pagination.page, filters);
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating block status');
        }
    };

    if (loading) return <div className="text-white text-center">Loading users...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-light text-white mb-8">User Management</h1>

            <div className="bg-dark-light rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search name/email"
                    className="bg-dark text-white px-3 py-2 rounded"
                />
                <select
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    className="bg-dark text-white px-3 py-2 rounded"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <select
                    value={filters.blocked}
                    onChange={(e) => setFilters({ ...filters, blocked: e.target.value })}
                    className="bg-dark text-white px-3 py-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="true">Blocked</option>
                    <option value="false">Active</option>
                </select>
                <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="bg-dark text-white px-3 py-2 rounded"
                />
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        className="bg-dark text-white px-3 py-2 rounded flex-1"
                    />
                    <button
                        onClick={() => fetchUsers(1, filters)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded"
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="bg-dark-light rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user._id} className="text-gray-300 hover:bg-gray-700 transition">
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.name || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded ${user.role === 'admin' ? 'bg-purple-900 text-purple-200' : 'bg-gray-700 text-gray-300'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded ${user.isBlocked ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {user._id !== currentUser.id && (
                                            <div className="inline-flex gap-4">
                                                <button
                                                    onClick={() => handleToggleBlock(user._id)}
                                                    className="text-yellow-400 hover:text-yellow-300 transition text-sm"
                                                >
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-400 hover:text-red-300 transition text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
                <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchUsers(pagination.page - 1, filters)}
                    className="px-3 py-1 rounded bg-dark-light border border-gray-600 text-white disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-gray-300 text-sm">
                    Page {pagination.page} of {pagination.totalPages || 1}
                </span>
                <button
                    disabled={pagination.page >= (pagination.totalPages || 1)}
                    onClick={() => fetchUsers(pagination.page + 1, filters)}
                    className="px-3 py-1 rounded bg-dark-light border border-gray-600 text-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Users;
