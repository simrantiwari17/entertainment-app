/**
 * Search Page Component
 * 
 * Allows users to search for movies and TV shows.
 * Displays search results from TMDB API.
 */

import { useState } from 'react';
import { tmdbService } from '../services/tmdb';
import ContentCard from '../components/ContentCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await tmdbService.search(query);
      // Filter results to only show movies and TV shows (exclude people, etc.)
      const filteredResults = data.results.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      );
      setResults(filteredResults);
      setSearched(true);
    } catch (err) {
      console.error('Error searching:', err);
      setError('Failed to search. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-white mb-8">Search</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies or TV shows..."
              className="flex-1 bg-dark-light text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        {/* Search Results */}
        {searched && !loading && (
          <>
            {results.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Search Results ({results.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.map((item) => (
                    <ContentCard
                      key={`${item.media_type}-${item.id}`}
                      content={item}
                      contentType={item.media_type === 'movie' ? 'movie' : 'tv'}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-white text-xl text-center py-12">
                No results found. Try a different search term.
              </div>
            )}
          </>
        )}
        
        {/* Initial State */}
        {!searched && !loading && (
          <div className="text-dark-lighter text-center py-12">
            Enter a search query to find movies and TV shows
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;



