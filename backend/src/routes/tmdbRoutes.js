import express from 'express';
import {
  getTrending,
  getPopularMovies,
  getPopularTVShows,
  searchContent,
  getMovieDetails,
  getTVDetails,
  getVideos,
  getWatchProviders,
  getSimilar,
  discoverMovies,
  discoverTV
} from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/trending', getTrending);
router.get('/movies/popular', getPopularMovies);
router.get('/tv/popular', getPopularTVShows);
router.get('/search', searchContent);
router.get('/discover/movie', discoverMovies);
router.get('/discover/tv', discoverTV);
router.get('/movies/:id/videos', (req, res, next) => {
  req.params.type = 'movie';
  getVideos(req, res, next);
});
router.get('/tv/:id/videos', (req, res, next) => {
  req.params.type = 'tv';
  getVideos(req, res, next);
});
router.get('/movies/:id/watch-providers', (req, res, next) => {
  req.params.type = 'movie';
  getWatchProviders(req, res, next);
});
router.get('/tv/:id/watch-providers', (req, res, next) => {
  req.params.type = 'tv';
  getWatchProviders(req, res, next);
});
router.get('/movies/:id/similar', (req, res, next) => {
  req.params.type = 'movie';
  getSimilar(req, res, next);
});
router.get('/tv/:id/similar', (req, res, next) => {
  req.params.type = 'tv';
  getSimilar(req, res, next);
});
router.get('/movies/:id', getMovieDetails);
router.get('/tv/:id', getTVDetails);

export default router;
