import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';

const RecentlyViewedSection = ({ items = [], loading = false, title = 'Recently Viewed' }) => {
  if (loading) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="text-gray-300">Loading recently viewed...</div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => {
          const image = item.poster
            ? item.poster.startsWith('http')
              ? item.poster
              : getImageUrl(item.poster)
            : null;
          const detailPath = item.type === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`;

          return (
            <div
              key={`${item.type}-${item.tmdbId}`}
              className="min-w-[180px] max-w-[180px] rounded-lg bg-dark-light border border-dark-lighter overflow-hidden"
            >
              {image ? (
                <img src={image} alt={item.title} className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-dark flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm text-white font-medium line-clamp-2 min-h-[40px]">{item.title}</h3>
                <Link
                  to={detailPath}
                  className="mt-2 inline-block text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Quick View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
