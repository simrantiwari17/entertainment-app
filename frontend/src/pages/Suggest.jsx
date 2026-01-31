/**
 * Suggest Page
 *
 * Mood-based filter, time-based suggestions, and "Suggest 1 Movie Now" button.
 * Ratings are hidden on the suggestion card (shown only after selection on Details).
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tmdbService, getImageUrl, MOOD_GENRE_IDS, TIME_PRESETS } from '../services/tmdb';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😄' },
  { id: 'sad', label: 'Sad', emoji: '😔' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
  { id: 'excited', label: 'Excited', emoji: '🔥' }
];

const TIMES = [
  { id: '20mins', label: '20 mins' },
  { id: '1hour', label: '1 hour' },
  { id: 'binge', label: 'Weekend binge' }
];

const Suggest = () => {
  const [mood, setMood] = useState(null);
  const [time, setTime] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSuggest = async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const preset = time ? TIME_PRESETS[time] : null;
      const genreIds = mood ? MOOD_GENRE_IDS[mood] : null;

      if (preset?.contentType === 'tv') {
        // Weekend binge → pick a TV show (optionally by mood)
        const res = await tmdbService.discoverTV({ genreIds, page: 1 });
        const list = res.results?.filter((i) => i.poster_path) || [];
        if (list.length === 0) {
          const fallback = await tmdbService.getPopularTVShows(1);
          list.push(...(fallback.results || []).filter((i) => i.poster_path));
        }
        const pick = list[Math.floor(Math.random() * list.length)];
        if (pick) setSuggestion({ ...pick, contentType: 'tv' });
        else setError('No TV shows found. Try changing mood or time.');
      } else {
        // Movie: apply optional mood + time (20 mins / 1 hour)
        const runtimeGte = preset?.runtimeGte ?? null;
        const runtimeLte = preset?.runtimeLte ?? null;
        const res = await tmdbService.discoverMovies({
          genreIds,
          runtimeGte,
          runtimeLte,
          page: 1
        });
        let list = res.results?.filter((i) => i.poster_path) || [];
        if (list.length === 0) {
          const fallback = await tmdbService.getPopularMovies(1);
          list = (fallback.results || []).filter((i) => i.poster_path);
        }
        const pick = list[Math.floor(Math.random() * list.length)];
        if (pick) setSuggestion({ ...pick, contentType: 'movie' });
        else setError('No movies found. Try changing mood or time.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not get a suggestion. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const posterUrl = suggestion ? getImageUrl(suggestion.poster_path) : null;
  const releaseDate = suggestion?.release_date || suggestion?.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Suggest something to watch</h1>
        <p className="text-dark-lighter mb-8">
          Pick a mood and time (optional), then get one suggestion. Rating is hidden until you open it—choose by feel.
        </p>

        {/* Mood-based filter */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Mood</h2>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(mood === m.id ? null : m.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  mood === m.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-light text-white hover:bg-dark-lighter'
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </section>

        {/* Time-based suggestions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Time</h2>
          <div className="flex flex-wrap gap-2">
            {TIMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTime(time === t.id ? null : t.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  time === t.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-light text-white hover:bg-dark-lighter'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Suggest 1 Movie Now button */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleSuggest}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-6 rounded-xl transition"
          >
            {loading ? 'Finding one...' : 'Suggest 1 Movie Now'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg">{error}</div>
        )}

        {/* Result card – no rating (reduces decision paralysis); rating shown on Details after selection */}
        {suggestion && !loading && (
          <div className="bg-dark-light rounded-xl overflow-hidden border border-dark-lighter">
            <p className="text-dark-lighter text-sm p-4 pb-0">Your pick — open it to see the rating</p>
            <Link
              to={suggestion.contentType === 'movie' ? `/movie/${suggestion.id}` : `/tv/${suggestion.id}`}
              className="block p-4"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 rounded-lg overflow-hidden bg-dark-lighter">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={suggestion.title || suggestion.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-white text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition line-clamp-2">
                    {suggestion.title || suggestion.name}
                  </h3>
                  <p className="text-dark-lighter mt-1">{year}</p>
                  <p className="text-white mt-2 text-sm line-clamp-3">
                    {suggestion.overview || 'No overview.'}
                  </p>
                  <span className="inline-block mt-3 text-blue-400 text-sm">
                    Open to see rating & details →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggest;
