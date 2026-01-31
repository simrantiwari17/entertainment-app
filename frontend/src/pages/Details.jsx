/**
 * Details Page Component
 * 
 * Displays detailed information about a movie or TV show.
 * Includes bookmark functionality with notes and watch status.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { tmdbService, getImageUrl, getBackdropUrl } from '../services/tmdb';
import { createBookmark, updateBookmark, deleteBookmark } from '../redux/slices/bookmarksSlice';

const Details = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Determine content type from URL path (/movie/:id or /tv/:id)
  const type = location.pathname.startsWith('/movie/') ? 'movie' : 'tv';
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { bookmarks } = useSelector((state) => state.bookmarks);
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [watchStatus, setWatchStatus] = useState('planned');
  const [isEditing, setIsEditing] = useState(false);
  const [videos, setVideos] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  
  // Find if this content is bookmarked
  const bookmark = bookmarks.find(
    (b) => b.contentId === parseInt(id) && b.contentType === type
  );
  const isBookmarked = !!bookmark;
  
  useEffect(() => {
    // Fetch content details when component mounts
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = type === 'movie'
          ? await tmdbService.getMovieDetails(id)
          : await tmdbService.getTVDetails(id);
        setContent(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id, type]);

  // Fetch trailer and watch providers for logged-in users
  useEffect(() => {
    if (!content || !isAuthenticated) return;
    const fetchWatchData = async () => {
      try {
        const [videosRes, providersRes] = await Promise.all([
          tmdbService.getVideos(type, id),
          tmdbService.getWatchProviders(type, id)
        ]);
        setVideos(videosRes);
        setWatchProviders(providersRes);
      } catch (err) {
        console.error('Error fetching watch data:', err);
      }
    };
    fetchWatchData();
  }, [content, isAuthenticated, id, type]);
  
  useEffect(() => {
    // Set notes and watch status from bookmark if it exists
    if (bookmark) {
      setNotes(bookmark.notes || '');
      setWatchStatus(bookmark.watchStatus || 'planned');
    }
  }, [bookmark]);
  
  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark content');
      navigate('/login');
      return;
    }
    
    if (isBookmarked) {
      // Delete bookmark
      await dispatch(deleteBookmark(bookmark._id));
      setNotes('');
      setWatchStatus('planned');
      setIsEditing(false);
    } else {
      // Create bookmark
      await dispatch(
        createBookmark({
          contentId: content.id,
          contentType: type,
          title: content.title || content.name,
          posterPath: content.poster_path,
          releaseDate: content.release_date || content.first_air_date,
          notes: notes || '',
          watchStatus: watchStatus
        })
      );
    }
  };
  
  // Handle update bookmark (notes/status)
  const handleUpdateBookmark = async () => {
    if (!bookmark) return;
    
    await dispatch(
      updateBookmark({
        bookmarkId: bookmark._id,
        updateData: { notes, watchStatus }
      })
    );
    setIsEditing(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || 'Content not found'}</div>
      </div>
    );
  }
  
  const backdropUrl = getBackdropUrl(content.backdrop_path);
  const posterUrl = getImageUrl(content.poster_path);
  const releaseDate = content.release_date || content.first_air_date || 'N/A';
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      {backdropUrl && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={backdropUrl}
            alt={content.title || content.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>
      )}
      
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={content.title || content.name}
                className="w-64 rounded-lg"
              />
            ) : (
              <div className="w-64 h-96 bg-dark-light rounded-lg flex items-center justify-center">
                <span className="text-white">No Image</span>
              </div>
            )}
          </div>
          
          {/* Content Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">
              {content.title || content.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-4 text-dark-lighter">
              <span>{new Date(releaseDate).getFullYear()}</span>
              {content.runtime && <span>{content.runtime} min</span>}
              {content.vote_average != null && (
                <span title="Rating shown after you select this title">⭐ {content.vote_average.toFixed(1)} / 10</span>
              )}
            </div>
            
            {/* Overview */}
            <p className="text-white mb-6 leading-relaxed">
              {content.overview || 'No overview available.'}
            </p>
            
            {/* Genres */}
            {content.genres && content.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {content.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Watch Section: full movie/series, trailer, and where to watch (for registered users) */}
            {isAuthenticated ? (
              <div className="bg-dark-light p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Watch</h3>

                {/* Watch full movie/series – link to streaming services via JustWatch */}
                {(() => {
                  const title = content.title || content.name;
                  const justWatchSearchUrl = `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`;
                  const isSeries = type === 'tv';
                  return (
                    <div className="mb-6 p-4 rounded-lg bg-dark border border-green-600/50">
                      <p className="text-white font-medium mb-2">
                        {isSeries ? 'Watch full series' : 'Watch full movie'}
                      </p>
                      <p className="text-dark-lighter text-sm mb-4">
                        Find where to stream the full {isSeries ? 'series' : 'movie'} and open it on Netflix, Prime Video, and more.
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={justWatchSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
                        >
                          <span>Watch on streaming services</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <a
                          href={`https://reelgood.com/search?q=${encodeURIComponent(content.title || content.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          Also try Reelgood →
                        </a>
                      </div>
                    </div>
                  );
                })()}

                {/* Trailer */}
                {videos?.results?.length > 0 && (() => {
                  const trailer = videos.results.find(
                    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
                  ) || videos.results[0];
                  const trailerKey = trailer?.key;
                  return trailerKey ? (
                    <div className="mb-6">
                      <p className="text-white mb-2">Trailer</p>
                      <div className="aspect-video max-w-2xl rounded-lg overflow-hidden bg-black">
                        <iframe
                          title="Trailer"
                          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    </div>
                  ) : null;
                })()}
                {/* Where to watch – clickable links to find full movie/series on these providers */}
                {watchProviders?.results?.US && (() => {
                  const title = content.title || content.name;
                  const justWatchUrl = `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`;
                  return (
                  <div>
                    <p className="text-white mb-2">Where to watch (US) – click to open and stream full {type === 'tv' ? 'series' : 'movie'}</p>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.results.US.flatrate?.map((p) => (
                        <a
                          key={p.provider_id}
                          href={justWatchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark text-white px-3 py-2 rounded flex items-center gap-2 hover:ring-2 hover:ring-green-500 transition"
                        >
                          {p.logo_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                              alt={p.provider_name}
                              className="w-6 h-6 rounded"
                            />
                          )}
                          <span>{p.provider_name}</span>
                        </a>
                      ))}
                      {watchProviders.results.US.rent?.map((p) => (
                        <a
                          key={p.provider_id}
                          href={justWatchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark text-white px-3 py-2 rounded flex items-center gap-2 text-sm hover:ring-2 hover:ring-green-500 transition"
                        >
                          {p.logo_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                              alt={p.provider_name}
                              className="w-6 h-6 rounded"
                            />
                          )}
                          <span>{p.provider_name} (rent)</span>
                        </a>
                      ))}
                      {watchProviders.results.US.buy?.map((p) => (
                        <a
                          key={p.provider_id}
                          href={justWatchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark text-white px-3 py-2 rounded flex items-center gap-2 text-sm hover:ring-2 hover:ring-green-500 transition"
                        >
                          {p.logo_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                              alt={p.provider_name}
                              className="w-6 h-6 rounded"
                            />
                          )}
                          <span>{p.provider_name} (buy)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-dark-light p-6 rounded-lg mb-6 border border-blue-600/50">
                <p className="text-white mb-2">Sign in to watch trailers and see where to stream.</p>
                <Link
                  to="/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Login
                </Link>
                <span className="text-white mx-2">or</span>
                <Link
                  to="/signup"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Bookmark Section (only if authenticated) */}
            {isAuthenticated && (
              <div className="bg-dark-light p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Bookmark</h3>
                  <button
                    onClick={handleBookmarkToggle}
                    className={`px-4 py-2 rounded transition ${
                      isBookmarked
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                  </button>
                </div>
                
                {isBookmarked && (
                  <div className="space-y-4">
                    {/* Watch Status */}
                    <div>
                      <label className="block text-white mb-2">Watch Status</label>
                      <select
                        value={watchStatus}
                        onChange={(e) => {
                          setWatchStatus(e.target.value);
                          setIsEditing(true);
                        }}
                        className="w-full bg-dark text-white px-4 py-2 rounded"
                      >
                        <option value="planned">Planned</option>
                        <option value="watching">Watching</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                    {/* Notes */}
                    <div>
                      <label className="block text-white mb-2">Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                          setIsEditing(true);
                        }}
                        placeholder="Add your notes about this content..."
                        rows="4"
                        className="w-full bg-dark text-white px-4 py-2 rounded resize-none"
                      />
                    </div>
                    
                    {/* Update Button */}
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateBookmark}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setNotes(bookmark.notes || '');
                            setWatchStatus(bookmark.watchStatus || 'planned');
                            setIsEditing(false);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;

