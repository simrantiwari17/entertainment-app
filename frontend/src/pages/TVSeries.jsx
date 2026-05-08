/**
 * TV Series Page Component
 * 
 * Displays popular TV shows from TMDB API.
 * Shows paginated list of TV shows.
 */

import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import ContentCard from '../components/ContentCard';
import Spinner from '../components/Spinner';

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 10764, name: 'Reality' },
  { id: 10768, name: 'War & Politics' }
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
  { value: 'first_air_date.desc', label: 'Latest First Air Date' },
  { value: 'first_air_date.asc', label: 'Oldest First Air Date' }
];

const TVSeries = () => {
  const [tvShows, setTVShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: '',
    genre: '',
    sortBy: 'popularity.desc'
  });
  
  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        const data = await tmdbService.discoverTVAdvanced({
          page,
          sortBy: filters.sortBy,
          language: filters.language || undefined,
          genreIds: filters.genre ? [Number(filters.genre)] : undefined
        });
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
        <Spinner label="Loading TV shows..." />
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
        <h1 className="text-4xl font-bold text-white mb-8">TV Series</h1>

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
                  {TV_GENRES.map((genre) => (
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
              {tvShows.map((tv) => (
                <ContentCard key={tv.id} content={tv} contentType="tv" />
              ))}
            </div>

            {tvShows.length === 0 && (
              <div className="text-center text-dark-lighter mb-8">
                No TV shows found for selected filters.
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

export default TVSeries;



