/**
 * Bookmarks Page Component
 * 
 * Displays all bookmarked movies and TV shows for the authenticated user.
 * Includes filtering by content type and watch status.
 * Users can edit notes and watch status, or delete bookmarks.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBookmarks, deleteBookmark, updateBookmark } from '../redux/slices/bookmarksSlice';
import { getImageUrl } from '../services/tmdb';
import Spinner from '../components/Spinner';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const { bookmarks, loading } = useSelector((state) => state.bookmarks);
  
  const [filterType, setFilterType] = useState('all'); // 'all', 'movie', 'tv'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'planned', 'watching', 'completed'
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('planned');
  
  useEffect(() => {
    // Fetch bookmarks when component mounts
    dispatch(fetchBookmarks());
  }, [dispatch]);
  
  // Filter bookmarks based on selected filters
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const typeMatch = filterType === 'all' || bookmark.contentType === filterType;
    const statusMatch = filterStatus === 'all' || bookmark.watchStatus === filterStatus;
    return typeMatch && statusMatch;
  });
  
  // Handle delete bookmark
  const handleDelete = async (bookmarkId) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      await dispatch(deleteBookmark(bookmarkId));
    }
  };
  
  // Start editing bookmark
  const startEditing = (bookmark) => {
    setEditingId(bookmark._id);
    setEditNotes(bookmark.notes || '');
    setEditStatus(bookmark.watchStatus || 'planned');
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditNotes('');
    setEditStatus('planned');
  };
  
  // Save bookmark changes
  const handleSave = async (bookmarkId) => {
    await dispatch(
      updateBookmark({
        bookmarkId,
        updateData: { notes: editNotes, watchStatus: editStatus }
      })
    );
    cancelEditing();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading bookmarks..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-white mb-8">My Bookmarks</h1>
        
        {/* Filters */}
        <div className="bg-dark-light p-4 rounded-lg mb-8 flex flex-wrap gap-4">
          {/* Content Type Filter */}
          <div>
            <label className="text-white mr-2">Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-dark text-white px-4 py-2 rounded"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>
          
          {/* Watch Status Filter */}
          <div>
            <label className="text-white mr-2">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-dark text-white px-4 py-2 rounded"
            >
              <option value="all">All</option>
              <option value="planned">Planned</option>
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* Bookmark Count */}
          <div className="ml-auto text-dark-lighter">
            {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="bg-dark-light rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <Link
                  to={`/${bookmark.contentType}/${bookmark.contentId}`}
                  className="block"
                >
                  {bookmark.posterPath ? (
                    <img
                      src={getImageUrl(bookmark.posterPath)}
                      alt={bookmark.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-dark-lighter flex items-center justify-center">
                      <span className="text-white">No Image</span>
                    </div>
                  )}
                </Link>
                
                <div className="p-4">
                  <Link to={`/${bookmark.contentType}/${bookmark.contentId}`}>
                    <h3 className="text-white font-semibold mb-2 hover:text-blue-400 transition">
                      {bookmark.title}
                    </h3>
                  </Link>
                  
                  {/* Watch Status Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        bookmark.watchStatus === 'completed'
                          ? 'bg-green-600 text-white'
                          : bookmark.watchStatus === 'watching'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {bookmark.watchStatus?.charAt(0).toUpperCase() +
                        bookmark.watchStatus?.slice(1)}
                    </span>
                  </div>
                  
                  {/* Notes */}
                  {editingId === bookmark._id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add notes..."
                        rows="3"
                        className="w-full bg-dark text-white px-3 py-2 rounded text-sm resize-none"
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full bg-dark text-white px-3 py-2 rounded text-sm"
                      >
                        <option value="planned">Planned</option>
                        <option value="watching">Watching</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSave(bookmark._id);
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            cancelEditing();
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {bookmark.notes && (
                        <p className="text-dark-lighter text-sm mb-3 line-clamp-2">
                          {bookmark.notes}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            startEditing(bookmark);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(bookmark._id);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-lighter text-xl mb-4">
              {bookmarks.length === 0
                ? 'No bookmarks yet. Start bookmarking your favorite content!'
                : 'No bookmarks match your filters.'}
            </p>
            {bookmarks.length === 0 && (
              <Link
                to="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
              >
                Browse Content
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;



