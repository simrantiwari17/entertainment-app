/**
 * Movies Page Component
 * 
 * Displays popular movies from TMDB API.
 * Shows paginated list of movies.
 */

import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import ContentCard from '../components/ContentCard';
import Spinner from '../components/Spinner';

const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

const LANGUAGES = [
  { code: '', label: 'All Languages' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'ko', label: 'Korean' },
  { code: 'ja', label: 'Japanese' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' }
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity (High to Low)' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'primary_release_date.desc', label: 'Latest Release' },
  { value: 'primary_release_date.asc', label: 'Oldest Release' }
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: '',
    genre: '',
    sortBy: 'popularity.desc'
  });
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await tmdbService.discoverMoviesAdvanced({
          page,
          sortBy: filters.sortBy,
          language: filters.language || undefined,
          genreIds: filters.genre ? [Number(filters.genre)] : undefined
        });
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
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({
      language: '',
      genre: '',
      sortBy: 'popularity.desc'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading movies..." />
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
        <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="bg-dark-light rounded-lg p-4 sticky top-24">
              <h2 className="text-white font-semibold mb-4">Filters</h2>
              <div className="space-y-3">
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full bg-dark text-white px-3 py-2 rounded"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code || 'all'} value={lang.code}>{lang.label}</option>
                  ))}
                </select>

                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full bg-dark text-white px-3 py-2 rounded"
                >
                  <option value="">All Genres</option>
                  {MOVIE_GENRES.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full bg-dark text-white px-3 py-2 rounded"
                >
                  {SORT_OPTIONS.map((sort) => (
                    <option key={sort.value} value={sort.value}>{sort.label}</option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
              {movies.map((movie) => (
                <ContentCard key={movie.id} content={movie} contentType="movie" />
              ))}
            </div>

            {movies.length === 0 && (
              <div className="text-center text-dark-lighter mb-8">
                No movies found for selected filters.
              </div>
            )}
          </section>
        </div>
        
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



