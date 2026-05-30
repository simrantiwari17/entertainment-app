/**
 * TMDB API client (server-side)
 *
 * All TMDB traffic goes through Node with reliable DNS + IPv4 so the app
 * works without changing system DNS to Google (8.8.8.8).
 */

import dns from 'node:dns';
import https from 'node:https';
import axios from 'axios';

const TMDB_BASE_URL =
  process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_TIMEOUT_MS = Number(process.env.TMDB_TIMEOUT_MS) || 30000;
const TMDB_MAX_RETRIES = Number(process.env.TMDB_MAX_RETRIES) || 4;
const TMDB_DNS_TIMEOUT_MS = Number(process.env.TMDB_DNS_TIMEOUT_MS) || 8000;
const TMDB_HOST = 'api.themoviedb.org';

const TMDB_DNS_SERVERS = (
  process.env.TMDB_DNS_SERVERS || '8.8.8.8,8.8.4.4,1.1.1.1'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (TMDB_DNS_SERVERS.length > 0) {
  dns.setServers(TMDB_DNS_SERVERS);
}

dns.setDefaultResultOrder('ipv4first');

const resolveIPv4 = (hostname) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`DNS lookup timed out after ${TMDB_DNS_TIMEOUT_MS}ms`));
    }, TMDB_DNS_TIMEOUT_MS);

    const done = (err, address) => {
      clearTimeout(timer);
      if (err) reject(err);
      else if (!address) reject(new Error(`No IPv4 address for ${hostname}`));
      else resolve(address);
    };

    dns.resolve4(hostname, (err, addresses) => {
      if (!err && addresses?.length) {
        done(null, addresses[0]);
        return;
      }
      dns.lookup(
        hostname,
        { family: 4, hints: dns.ADDRCONFIG },
        (lookupErr, address) => done(lookupErr, address)
      );
    });
  });

const tmdbHttpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
  lookup: (hostname, options, callback) => {
    if (hostname !== TMDB_HOST) {
      dns.lookup(hostname, options, callback);
      return;
    }
    resolveIPv4(hostname)
      .then((address) => {
        if (options?.all) {
          callback(null, [{ address, family: 4 }]);
        } else {
          callback(null, address, 4);
        }
      })
      .catch((err) => callback(err));
  }
});

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: TMDB_TIMEOUT_MS,
  httpsAgent: tmdbHttpsAgent,
  proxy: false,
  params: { api_key: TMDB_API_KEY },
  headers: { Accept: 'application/json' }
});

const RETRYABLE_CODES = new Set([
  'ECONNABORTED',
  'ECONNRESET',
  'ECONNREFUSED',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'ENETUNREACH',
  'EHOSTUNREACH',
  'ERR_INVALID_IP_ADDRESS'
]);

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const logTmdbFailure = (operation, error, attempt) => {
  console.error('[TMDB] request failed', {
    operation,
    attempt,
    message: error.message,
    code: error.code,
    status: error.response?.status,
    url: error.config?.url
  });
};

const isRetryable = (error) => {
  if (error.code && RETRYABLE_CODES.has(error.code)) return true;
  if (error.message?.includes('DNS lookup timed out')) return true;
  const status = error.response?.status;
  return status != null && RETRYABLE_STATUS.has(status);
};

export const tmdbRequest = async (config, operation = 'tmdb') => {
  if (!TMDB_API_KEY) {
    const err = new Error('TMDB_API_KEY is not configured on the server');
    err.statusCode = 500;
    throw err;
  }

  let lastError;
  for (let attempt = 1; attempt <= TMDB_MAX_RETRIES; attempt += 1) {
    try {
      const response = await tmdbClient.request(config);
      return response.data;
    } catch (error) {
      lastError = error;
      logTmdbFailure(operation, error, attempt);
      if (attempt >= TMDB_MAX_RETRIES || !isRetryable(error)) break;
      await sleep(500 * 2 ** (attempt - 1));
    }
  }

  const status = lastError.response?.status;
  const err = new Error(
    lastError.response?.data?.status_message ||
      lastError.message ||
      'TMDB request failed'
  );
  err.statusCode = status >= 400 && status < 600 ? status : 502;
  err.cause = lastError;
  throw err;
};

export const verifyTmdbConnection = async () => {
  try {
    const address = await resolveIPv4(TMDB_HOST);
    console.log(`[TMDB] DNS OK — ${TMDB_HOST} → ${address}`);
    await tmdbRequest({ method: 'GET', url: '/configuration' }, 'configuration');
    console.log('[TMDB] API connection OK');
  } catch (error) {
    console.error('[TMDB] Startup check failed:', error.message);
  }
};

export const getTrending = (timeWindow = 'day') =>
  Promise.all([
    tmdbRequest(
      { method: 'GET', url: `/trending/movie/${timeWindow}` },
      'trending/movie'
    ),
    tmdbRequest(
      { method: 'GET', url: `/trending/tv/${timeWindow}` },
      'trending/tv'
    )
  ]).then(([movies, tv]) => ({
    movies: movies.results,
    tvShows: tv.results
  }));

export const getPopularMovies = (page = 1) =>
  tmdbRequest(
    { method: 'GET', url: '/movie/popular', params: { page } },
    'movie/popular'
  );

export const getPopularTVShows = (page = 1) =>
  tmdbRequest(
    { method: 'GET', url: '/tv/popular', params: { page } },
    'tv/popular'
  );

export const searchMulti = (query, page = 1) =>
  tmdbRequest(
    { method: 'GET', url: '/search/multi', params: { query, page } },
    'search/multi'
  );

export const getMovieDetails = (movieId) =>
  tmdbRequest({ method: 'GET', url: `/movie/${movieId}` }, `movie/${movieId}`);

export const getTVDetails = (tvId) =>
  tmdbRequest({ method: 'GET', url: `/tv/${tvId}` }, `tv/${tvId}`);

export const getVideos = (type, id) => {
  const path = type === 'movie' ? `/movie/${id}/videos` : `/tv/${id}/videos`;
  return tmdbRequest({ method: 'GET', url: path }, `${type}/${id}/videos`);
};

export const getWatchProviders = (type, id) => {
  const path =
    type === 'movie'
      ? `/movie/${id}/watch/providers`
      : `/tv/${id}/watch/providers`;
  return tmdbRequest({ method: 'GET', url: path }, path);
};

export const getSimilar = (type, id, page = 1) => {
  const path = type === 'movie' ? `/movie/${id}/similar` : `/tv/${id}/similar`;
  return tmdbRequest(
    { method: 'GET', url: path, params: { page } },
    `${type}/${id}/similar`
  );
};

export const discoverMovies = ({
  genreIds,
  runtimeGte,
  runtimeLte,
  page = 1
} = {}) => {
  const params = { page, sort_by: 'popularity.desc' };
  if (genreIds?.length) {
    params.with_genres = Array.isArray(genreIds)
      ? genreIds.join(',')
      : genreIds;
  }
  if (runtimeGte != null) params['with_runtime.gte'] = runtimeGte;
  if (runtimeLte != null) params['with_runtime.lte'] = runtimeLte;
  return tmdbRequest(
    { method: 'GET', url: '/discover/movie', params },
    'discover/movie'
  );
};

export const discoverTV = ({ genreIds, page = 1 } = {}) => {
  const params = { page, sort_by: 'popularity.desc' };
  if (genreIds?.length) {
    params.with_genres = Array.isArray(genreIds)
      ? genreIds.join(',')
      : genreIds;
  }
  return tmdbRequest(
    { method: 'GET', url: '/discover/tv', params },
    'discover/tv'
  );
};

export const discoverMoviesAdvanced = ({
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
} = {}) => {
  const params = { page, sort_by: sortBy, include_adult: false };
  if (language) params.with_original_language = language;
  if (genreIds?.length) params.with_genres = genreIds.join(',');
  if (ratingGte != null) params['vote_average.gte'] = ratingGte;
  if (ratingLte != null) params['vote_average.lte'] = ratingLte;
  if (voteCountGte != null) params['vote_count.gte'] = voteCountGte;
  if (runtimeGte != null) params['with_runtime.gte'] = runtimeGte;
  if (runtimeLte != null) params['with_runtime.lte'] = runtimeLte;
  if (year) params.primary_release_year = year;
  return tmdbRequest(
    { method: 'GET', url: '/discover/movie', params },
    'discover/movie/advanced'
  );
};

export const discoverTVAdvanced = ({
  page = 1,
  sortBy = 'popularity.desc',
  language,
  genreIds,
  ratingGte,
  ratingLte,
  voteCountGte,
  year
} = {}) => {
  const params = { page, sort_by: sortBy, include_adult: false };
  if (language) params.with_original_language = language;
  if (genreIds?.length) params.with_genres = genreIds.join(',');
  if (ratingGte != null) params['vote_average.gte'] = ratingGte;
  if (ratingLte != null) params['vote_average.lte'] = ratingLte;
  if (voteCountGte != null) params['vote_count.gte'] = voteCountGte;
  if (year) params.first_air_date_year = year;
  return tmdbRequest(
    { method: 'GET', url: '/discover/tv', params },
    'discover/tv/advanced'
  );
};

/** Used by chatbot — returns `results` array from any TMDB list endpoint */
export const fetchTmdbList = async (endpoint, params = {}) => {
  const data = await tmdbRequest(
    { method: 'GET', url: endpoint, params },
    endpoint
  );
  return data?.results || [];
};
