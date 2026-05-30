/**
 * TMDB service (frontend)
 *
 * All TMDB API calls go through the Express backend (/api/tmdb) so the browser
 * never hits api.themoviedb.org directly — fixes ISP DNS / IPv6 issues.
 * Poster images still use the TMDB CDN.
 */

import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TMDB_IMAGE_BASE_URL =
  process.env.REACT_APP_TMDB_IMAGE_BASE_URL ||
  'https://image.tmdb.org/t/p/w500';

const tmdbAPI = axios.create({
  baseURL: `${API_BASE_URL}/tmdb`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

const unwrap = (response) => {
  if (response.data?.success === false) {
    throw new Error(response.data.message || 'TMDB request failed');
  }
  return response.data?.data ?? response.data;
};

const logAndThrow = (label, error) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    'Failed to load content';
  console.error(`[TMDB client] ${label}:`, message, {
    status: error.response?.status,
    url: error.config?.url
  });
  throw new Error(message);
};

const request = async (label, config) => {
  try {
    return unwrap(await tmdbAPI.request(config));
  } catch (error) {
    logAndThrow(label, error);
  }
};

export const getImageUrl = (path) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

export const getBackdropUrl = (path) => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/w1280${path}`;
};

export const tmdbService = {
  getTrending: (timeWindow = 'day') =>
    request('getTrending', {
      method: 'GET',
      url: '/trending',
      params: { timeWindow }
    }),

  getPopularMovies: (page = 1) =>
    request('getPopularMovies', {
      method: 'GET',
      url: '/movies/popular',
      params: { page }
    }),

  getPopularTVShows: (page = 1) =>
    request('getPopularTVShows', {
      method: 'GET',
      url: '/tv/popular',
      params: { page }
    }),

  search: (query, page = 1) =>
    request('search', {
      method: 'GET',
      url: '/search',
      params: { q: query, page }
    }),

  getMovieDetails: (movieId) =>
    request('getMovieDetails', { method: 'GET', url: `/movies/${movieId}` }),

  getTVDetails: (tvId) =>
    request('getTVDetails', { method: 'GET', url: `/tv/${tvId}` }),

  getVideos: (type, id) =>
    request('getVideos', { method: 'GET', url: `/${type}/${id}/videos` }),

  getWatchProviders: (type, id) =>
    request('getWatchProviders', {
      method: 'GET',
      url: `/${type}/${id}/watch-providers`
    }),

  getSimilar: (type, id, page = 1) =>
    request('getSimilar', {
      method: 'GET',
      url: `/${type}/${id}/similar`,
      params: { page }
    }),

  discoverMovies: ({ genreIds, runtimeGte, runtimeLte, page = 1 } = {}) =>
    request('discoverMovies', {
      method: 'GET',
      url: '/discover/movie',
      params: {
        page,
        genreIds: genreIds?.length ? genreIds.join(',') : undefined,
        runtimeGte,
        runtimeLte
      }
    }),

  discoverTV: ({ genreIds, page = 1 } = {}) =>
    request('discoverTV', {
      method: 'GET',
      url: '/discover/tv',
      params: {
        page,
        genreIds: genreIds?.length ? genreIds.join(',') : undefined
      }
    }),

  discoverMoviesAdvanced: ({
    page = 1,
    sortBy = 'popularity.desc',
    language,
    genreIds,
    ratingGte,
    ratingLte,
    voteCountGte,
    runtimeGte,
    runtimeLte,
    year
  } = {}) =>
    request('discoverMoviesAdvanced', {
      method: 'GET',
      url: '/discover/movie',
      params: {
        advanced: true,
        page,
        sortBy,
        language,
        genreIds: genreIds?.length ? genreIds.join(',') : undefined,
        ratingGte,
        ratingLte,
        voteCountGte,
        runtimeGte,
        runtimeLte,
        year
      }
    }),

  discoverTVAdvanced: ({
    page = 1,
    sortBy = 'popularity.desc',
    language,
    genreIds,
    ratingGte,
    ratingLte,
    voteCountGte,
    year
  } = {}) =>
    request('discoverTVAdvanced', {
      method: 'GET',
      url: '/discover/tv',
      params: {
        advanced: true,
        page,
        sortBy,
        language,
        genreIds: genreIds?.length ? genreIds.join(',') : undefined,
        ratingGte,
        ratingLte,
        voteCountGte,
        year
      }
    })
};

export default tmdbService;

export const MOOD_GENRE_IDS = {
  happy: [35, 10749],
  sad: [18],
  relaxed: [99, 18],
  excited: [28, 53, 12]
};

export const TIME_PRESETS = {
  '20mins': {
    runtimeGte: 1,
    runtimeLte: 30,
    label: '20 mins',
    contentType: 'movie'
  },
  '1hour': {
    runtimeGte: 45,
    runtimeLte: 105,
    label: '1 hour',
    contentType: 'movie'
  },
  binge: { label: 'Weekend binge', contentType: 'tv' }
};
