/**
 * Content Card Component
 * 
 * Displays a single movie/TV show card with:
 * - Poster image
 * - Title
 * - Release date
 * - Bookmark button (if user is authenticated)
 */

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getImageUrl } from '../services/tmdb';
import { createBookmark, deleteBookmark } from '../redux/slices/bookmarksSlice';
import { useToast } from './ToastProvider';

const ContentCard = ({ content, contentType = 'movie' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { bookmarks } = useSelector((state) => state.bookmarks);
  const { showToast } = useToast();
  
  // Check if this content is already bookmarked
  const isBookmarked = bookmarks.some(
    (bookmark) =>
      bookmark.contentId === content.id && bookmark.contentType === contentType
  );
  
  // Get bookmark ID if it exists
  const bookmark = bookmarks.find(
    (b) => b.contentId === content.id && b.contentType === contentType
  );
  
  // Handle bookmark toggle
  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showToast('Please login to bookmark content', 'error');
      return;
    }
    
    if (isBookmarked) {
      // Delete bookmark
      await dispatch(deleteBookmark(bookmark._id));
      showToast('Bookmark removed', 'success');
    } else {
      // Create bookmark
      await dispatch(
        createBookmark({
          contentId: content.id,
          contentType: contentType,
          title: content.title || content.name,
          posterPath: content.poster_path,
          releaseDate: content.release_date || content.first_air_date
        })
      );
      showToast('Bookmark added', 'success');
    }
  };
  
  // Determine the URL path based on content type
  const detailPath = contentType === 'movie' 
    ? `/movie/${content.id}` 
    : `/tv/${content.id}`;
  
  // Get poster image URL
  const posterUrl = getImageUrl(content.poster_path);
  
  // Format release date
  const releaseDate = content.release_date || content.first_air_date || 'N/A';
  const formattedDate = releaseDate !== 'N/A' 
    ? new Date(releaseDate).getFullYear() 
    : 'N/A';
  
  return (
    <Link to={detailPath} className="group">
      <div className="bg-dark-light rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 relative">
        {/* Poster Image */}
        <div className="relative">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={content.title || content.name}
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
          
          {/* Bookmark Button */}
          {isAuthenticated && (
            <button
              onClick={handleBookmarkToggle}
              className="absolute top-2 right-2 bg-dark-light bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full transition"
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? (
                <span className="text-yellow-400 text-xl">★</span>
              ) : (
                <span className="text-white text-xl">☆</span>
              )}
            </button>
          )}
        </div>
        
        {/* Content Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition line-clamp-2">
            {content.title || content.name}
          </h3>
          <p className="text-dark-lighter text-sm">{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;



