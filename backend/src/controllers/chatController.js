/**
 * Chat Controller — movie/TV suggestions via shared TMDB service
 */

import { fetchTmdbList } from '../services/tmdbService.js';

const GENRE_KEYWORDS = {
  action: 28,
  comedy: 35,
  romance: 10749,
  thriller: 53
};

const getKeywordType = (message) => {
  const text = message.toLowerCase();

  for (const [keyword, genreId] of Object.entries(GENRE_KEYWORDS)) {
    if (text.includes(keyword)) {
      return { type: 'genre', keyword, genreId };
    }
  }

  if (text.includes('top movies') || text.includes('top')) {
    return { type: 'top' };
  }

  if (text.includes('latest') || text.includes('new')) {
    return { type: 'latest' };
  }

  if (text.includes('popular') || text.includes('trending')) {
    return { type: 'popular' };
  }

  return null;
};

const mapResults = (items = []) =>
  items.slice(0, 5).map((item) => ({
    id: item.id,
    title: item.title || item.name || 'Unknown Title',
    rating: item.vote_average ?? 0,
    description: item.overview || 'No description available.',
    type: item.media_type || (item.title ? 'movie' : 'tv')
  }));

/**
 * @route   POST /api/chat
 * @desc    Get movie/TV suggestions from chatbot
 * @access  Public
 */
export const chatWithBot = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        message: 'Please provide a valid message.',
        results: []
      });
    }

    const keywordType = getKeywordType(message);

    if (!keywordType) {
      return res.status(200).json({
        message: 'Please ask about genres like action, comedy, thriller, etc.',
        results: []
      });
    }

    let endpoint = '/movie/popular';
    let params = {};
    let responseMessage = 'Here are some suggestions for you.';

    if (keywordType.type === 'genre') {
      endpoint = '/discover/movie';
      params = { with_genres: keywordType.genreId, sort_by: 'popularity.desc' };
      responseMessage = `Here are some ${keywordType.keyword} movies you can watch.`;
    } else if (keywordType.type === 'top') {
      endpoint = '/movie/top_rated';
      responseMessage = 'Here are some top rated movies.';
    } else if (keywordType.type === 'latest') {
      endpoint = '/movie/now_playing';
      responseMessage = 'Here are some latest movies in theatres.';
    } else if (keywordType.type === 'popular') {
      endpoint = '/movie/popular';
      responseMessage = 'Here are some popular movies right now.';
    }

    const tmdbResults = await fetchTmdbList(endpoint, params);
    const results = mapResults(tmdbResults);

    return res.status(200).json({
      message: responseMessage,
      results
    });
  } catch (error) {
    return next(error);
  }
};
