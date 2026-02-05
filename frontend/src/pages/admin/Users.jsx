import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useSelector } from 'react-redux';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currentUser } = useSelector(state => state.auth);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getUsers();
            if (response.success) {
                setUsers(response.data);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

        try {
            await adminAPI.deleteUser(userId);
            // Remove user from local state
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting user');
        }
    };

    if (loading) return <div className="text-white text-center">Loading users...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-light text-white mb-8">User Management</h1>

            <div className="bg-dark-light rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Role</th>
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
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {user._id !== currentUser.id && (
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-400 hover:text-red-300 transition text-sm"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
