import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAPI, recentAPI } from '../services/api';
import { setUser } from '../redux/slices/authSlice';
import Spinner from '../components/Spinner';
import { useToast } from '../components/ToastProvider';
import { Link } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '' });
  const [summary, setSummary] = useState({
    totalBookmarks: 0,
    favoriteGenres: [],
    activitySummary: { recentViews: 0, completedBookmarks: 0 }
  });
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileResponse, summaryResponse] = await Promise.all([
          authAPI.getProfile(),
          authAPI.getProfileSummary()
        ]);
        const recentResponse = await recentAPI.list();

        setForm({
          name: profileResponse?.data?.name || '',
          email: profileResponse?.data?.email || ''
        });
        setSummary(summaryResponse?.data || {
          totalBookmarks: 0,
          favoriteGenres: [],
          activitySummary: { recentViews: 0, completedBookmarks: 0 }
        });
        setTimeline(recentResponse?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await authAPI.updateProfile(form);
      dispatch(setUser(response.data));
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-light rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-dark-lighter mb-6">Update your personal details</p>

          {error && <div className="bg-red-600 text-white p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-dark text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-dark text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition font-semibold"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="bg-dark-light rounded-lg p-6 shadow-lg h-fit">
          <h2 className="text-xl font-semibold text-white mb-4">Your Stats</h2>
          <div className="space-y-4">
            <div className="bg-dark rounded p-3">
              <p className="text-dark-lighter text-sm">Total Bookmarks</p>
              <p className="text-white text-2xl font-bold">{summary.totalBookmarks}</p>
            </div>
            <div className="bg-dark rounded p-3">
              <p className="text-dark-lighter text-sm mb-1">Favorite Genres</p>
              <p className="text-white">
                {summary.favoriteGenres?.length ? summary.favoriteGenres.join(', ') : 'Not enough data yet'}
              </p>
            </div>
            <div className="bg-dark rounded p-3">
              <p className="text-dark-lighter text-sm">Recent Views</p>
              <p className="text-white text-xl font-semibold">{summary.activitySummary?.recentViews || 0}</p>
              <p className="text-dark-lighter text-sm mt-2">Completed Bookmarks</p>
              <p className="text-white text-xl font-semibold">{summary.activitySummary?.completedBookmarks || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 bg-dark-light rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">Watch History Timeline</h2>
        {timeline.length > 0 ? (
          <div className="space-y-4">
            {timeline.map((item) => (
              <div key={item._id} className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-blue-500 shrink-0" />
                <div className="flex-1 border-l border-dark-lighter pl-4 pb-2">
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-dark-lighter text-sm">
                    {new Date(item.viewedAt).toLocaleString()} • {item.type.toUpperCase()}
                  </p>
                  <Link
                    to={item.type === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`}
                    className="text-blue-400 text-sm hover:text-blue-300"
                  >
                    Open title
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-lighter">No watch history yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
