/**
 * TV Series Page Component
 * 
 * Displays popular TV shows from TMDB API.
 * Shows paginated list of TV shows.
 */

import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import ContentCard from '../components/ContentCard';

const TVSeries = () => {
  const [tvShows, setTVShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch popular TV shows when component mounts or page changes
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        const data = await tmdbService.getPopularTVShows(page);
        setTVShows(data.results);
        setError(null);
      } catch (err) {
        console.error('Error fetching TV shows:', err);
        setError('Failed to load TV shows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTVShows();
  }, [page]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-white mb-8">Popular TV Series</h1>
        
        {/* TV Shows Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {tvShows.map((tv) => (
            <ContentCard key={tv.id} content={tv} contentType="tv" />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition"
          >
            Previous
          </button>
          <span className="text-white">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TVSeries;



