/**
 * Movies Page Component
 * 
 * Displays popular movies from TMDB API.
 * Shows paginated list of movies.
 */

import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import ContentCard from '../components/ContentCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch popular movies when component mounts or page changes
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await tmdbService.getPopularMovies(page);
        setMovies(data.results);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
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
        <h1 className="text-4xl font-bold text-white mb-8">Popular Movies</h1>
        
        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {movies.map((movie) => (
            <ContentCard key={movie.id} content={movie} contentType="movie" />
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

export default Movies;



