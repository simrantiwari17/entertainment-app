/**
 * TMDB proxy controller (public — browsing does not require auth)
 */

import * as tmdb from '../services/tmdbService.js';

const sendData = (res, data) => res.json({ success: true, data });

const forward = (next, error) => {
  if (!error.statusCode) error.statusCode = 502;
  next(error);
};

const parseGenreIds = (query) => {
  if (!query.genreIds) return [];
  return String(query.genreIds)
    .split(',')
    .map((id) => parseInt(id, 10))
    .filter((id) => !Number.isNaN(id));
};

export const getTrending = async (req, res, next) => {
  try {
    const timeWindow = req.query.timeWindow === 'week' ? 'week' : 'day';
    sendData(res, await tmdb.getTrending(timeWindow));
  } catch (e) {
    forward(next, e);
  }
};

export const getPopularMovies = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    sendData(res, await tmdb.getPopularMovies(page));
  } catch (e) {
    forward(next, e);
  }
};

export const getPopularTVShows = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    sendData(res, await tmdb.getPopularTVShows(page));
  } catch (e) {
    forward(next, e);
  }
};

export const searchContent = async (req, res, next) => {
  try {
    const query = (req.query.q || req.query.query || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query required (?q=)' });
    }
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    sendData(res, await tmdb.searchMulti(query, page));
  } catch (e) {
    forward(next, e);
  }
};

export const getMovieDetails = async (req, res, next) => {
  try {
    sendData(res, await tmdb.getMovieDetails(req.params.id));
  } catch (e) {
    forward(next, e);
  }
};

export const getTVDetails = async (req, res, next) => {
  try {
    sendData(res, await tmdb.getTVDetails(req.params.id));
  } catch (e) {
    forward(next, e);
  }
};

export const getVideos = async (req, res, next) => {
  try {
    sendData(res, await tmdb.getVideos(req.params.type, req.params.id));
  } catch (e) {
    forward(next, e);
  }
};

export const getWatchProviders = async (req, res, next) => {
  try {
    sendData(res, await tmdb.getWatchProviders(req.params.type, req.params.id));
  } catch (e) {
    forward(next, e);
  }
};

export const getSimilar = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    sendData(res, await tmdb.getSimilar(req.params.type, req.params.id, page));
  } catch (e) {
    forward(next, e);
  }
};

export const discoverMovies = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const advanced = req.query.advanced === 'true' || req.query.sortBy;

    if (advanced) {
      sendData(
        res,
        await tmdb.discoverMoviesAdvanced({
          page,
          sortBy: req.query.sortBy,
          language: req.query.language,
          genreIds: parseGenreIds(req.query),
          ratingGte: num(req.query.ratingGte),
          ratingLte: num(req.query.ratingLte),
          voteCountGte: num(req.query.voteCountGte),
          runtimeGte: num(req.query.runtimeGte),
          runtimeLte: num(req.query.runtimeLte),
          year: num(req.query.year)
        })
      );
      return;
    }

    sendData(
      res,
      await tmdb.discoverMovies({
        page,
        genreIds: parseGenreIds(req.query),
        runtimeGte: num(req.query.runtimeGte),
        runtimeLte: num(req.query.runtimeLte)
      })
    );
  } catch (e) {
    forward(next, e);
  }
};

export const discoverTV = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const advanced = req.query.advanced === 'true' || req.query.sortBy;

    if (advanced) {
      sendData(
        res,
        await tmdb.discoverTVAdvanced({
          page,
          sortBy: req.query.sortBy,
          language: req.query.language,
          genreIds: parseGenreIds(req.query),
          ratingGte: num(req.query.ratingGte),
          ratingLte: num(req.query.ratingLte),
          voteCountGte: num(req.query.voteCountGte),
          year: num(req.query.year)
        })
      );
      return;
    }

    sendData(
      res,
      await tmdb.discoverTV({ page, genreIds: parseGenreIds(req.query) })
    );
  } catch (e) {
    forward(next, e);
  }
};

const num = (v) => (v != null && v !== '' ? parseInt(v, 10) : undefined);
