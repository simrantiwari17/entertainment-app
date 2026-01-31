/**
 * TMDB API Service
 * 
 * Handles all requests to The Movie Database (TMDB) API.
 * Used for fetching movies, TV shows, search results, and content details.
 */

import axios from 'axios';

// TMDB API configuration from environment variables
const TMDB_BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

// Create axios instance for TMDB API
const tmdbAPI = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY
  }
});

/**
 * Get full image URL from TMDB image path
 * @param {string} path - Image path from TMDB API
 * @returns {string} Full image URL
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

/**
 * Get full backdrop image URL (larger, for hero images)
 * @param {string} path - Backdrop path from TMDB API
 * @returns {string} Full backdrop URL
 */
export const getBackdropUrl = (path) => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/w1280${path}`;
};

// TMDB API calls
export const tmdbService = {
  /**
   * Get trending movies and TV shows (for home page)
   * @param {string} timeWindow - 'day' or 'week'
   * @returns {Promise<Object>} Trending content
   */
  getTrending: async (timeWindow = 'day') => {
    try {
      const [moviesResponse, tvResponse] = await Promise.all([
        tmdbAPI.get(`/trending/movie/${timeWindow}`),
        tmdbAPI.get(`/trending/tv/${timeWindow}`)
      ]);
      
      return {
        movies: moviesResponse.data.results,
        tvShows: tvResponse.data.results
      };
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw error;
    }
  },
  
  /**
   * Get popular movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} Popular movies
   */
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbAPI.get('/movie/popular', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },
  
  /**
   * Get popular TV shows
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} Popular TV shows
   */
  getPopularTVShows: async (page = 1) => {
    try {
      const response = await tmdbAPI.get('/tv/popular', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },
  
  /**
   * Search movies and TV shows
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} Search results
   */
  search: async (query, page = 1) => {
    try {
      const response = await tmdbAPI.get('/search/multi', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  },
  
  /**
   * Get movie details by ID
   * @param {number} movieId - TMDB movie ID
   * @returns {Promise<Object>} Movie details
   */
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbAPI.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },
  
  /**
   * Get TV show details by ID
   * @param {number} tvId - TMDB TV show ID
   * @returns {Promise<Object>} TV show details
   */
  getTVDetails: async (tvId) => {
    try {
      const response = await tmdbAPI.get(`/tv/${tvId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  },

  /**
   * Get videos (trailers) for a movie or TV show
   * Returns YouTube keys for embedding trailers
   * @param {string} type - 'movie' or 'tv'
   * @param {number} id - TMDB content ID
   * @returns {Promise<Object>} Videos response with results array
   */
  getVideos: async (type, id) => {
    try {
      const endpoint = type === 'movie' ? `/movie/${id}/videos` : `/tv/${id}/videos`;
      const response = await tmdbAPI.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  /**
   * Get watch providers (where to stream) for a movie or TV show
   * @param {string} type - 'movie' or 'tv'
   * @param {number} id - TMDB content ID
   * @returns {Promise<Object>} Watch providers by country
   */
  getWatchProviders: async (type, id) => {
    try {
      const endpoint = type === 'movie' ? `/movie/${id}/watch/providers` : `/tv/${id}/watch/providers`;
      const response = await tmdbAPI.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      throw error;
    }
  },

  /**
   * Discover movies by genre and optional runtime (for mood + time suggestions)
   * @param {Object} params - { genreIds: string, runtimeGte: number, runtimeLte: number, page: number }
   * @returns {Promise<Object>} Discover response with results array
   */
  discoverMovies: async ({ genreIds, runtimeGte, runtimeLte, page = 1 } = {}) => {
    try {
      const params = { page, sort_by: 'popularity.desc' };
      if (genreIds && genreIds.length) params.with_genres = genreIds.join(',');
      if (runtimeGte != null) params['with_runtime.gte'] = runtimeGte;
      if (runtimeLte != null) params['with_runtime.lte'] = runtimeLte;
      const response = await tmdbAPI.get('/discover/movie', { params });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw error;
    }
  },

  /**
   * Discover TV shows by genre (for mood + weekend binge)
   * @param {Object} params - { genreIds: string, page: number }
   * @returns {Promise<Object>} Discover response with results array
   */
  discoverTV: async ({ genreIds, page = 1 } = {}) => {
    try {
      const params = { page, sort_by: 'popularity.desc' };
      if (genreIds && genreIds.length) params.with_genres = genreIds.join(',');
      const response = await tmdbAPI.get('/discover/tv', { params });
      return response.data;
    } catch (error) {
      console.error('Error discovering TV:', error);
      throw error;
    }
  }
};

export default tmdbService;

// --- Mood & time config for suggestions (reduces decision paralysis) ---
// TMDB movie genre IDs: 28 Action, 12 Adventure, 35 Comedy, 18 Drama, 99 Documentary, 10749 Romance, 53 Thriller, 10751 Family
export const MOOD_GENRE_IDS = {
  happy: [35, 10749],      // Comedy, Romance
  sad: [18],                // Drama
  relaxed: [99, 18],       // Documentary, Drama
  excited: [28, 53, 12]    // Action, Thriller, Adventure
};

export const TIME_PRESETS = {
  '20mins': { runtimeGte: 1, runtimeLte: 30, label: '20 mins', contentType: 'movie' },
  '1hour': { runtimeGte: 45, runtimeLte: 105, label: '1 hour', contentType: 'movie' },
  'binge': { label: 'Weekend binge', contentType: 'tv' }
};

