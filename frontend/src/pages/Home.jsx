/**
 * Home Page Component
 * 
 * Displays trending movies and TV shows from TMDB API.
 * Main landing page of the application.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { tmdbService } from '../services/tmdb';
import ContentCard from '../components/ContentCard';
import RecentlyViewedSection from '../components/RecentlyViewedSection';
import { recentAPI } from '../services/api';
import Spinner from '../components/Spinner';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  
  useEffect(() => {
    // Fetch trending content when component mounts
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await tmdbService.getTrending('day');
        setTrendingMovies(data.movies.slice(0, 10)); // Show first 10 movies
        setTrendingTV(data.tvShows.slice(0, 10)); // Show first 10 TV shows
        setError(null);
      } catch (err) {
        console.error('Error fetching trending content:', err);
        setError('Failed to load trending content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      setRecentLoading(true);
      try {
        if (isAuthenticated) {
          const response = await recentAPI.list();
          setRecentlyViewed((response?.data || []).slice(0, 5));
        } else {
          const guestItems = JSON.parse(localStorage.getItem('guest_recently_viewed') || '[]');
          setRecentlyViewed(guestItems.slice(0, 5));
        }
      } catch (err) {
        setRecentlyViewed([]);
      } finally {
        setRecentLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [isAuthenticated]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading content..." />
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
        {/* Login/Signup CTA for guests – enables watching trailers and bookmarks */}
        {!isAuthenticated && (
          <div className="bg-dark-light border border-blue-600/50 rounded-lg p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Watch movies & TV series</h2>
              <p className="text-dark-lighter">
                Sign up or log in to watch trailers, see where to stream, and save your favorites.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-white mb-8">Trending Now</h1>

        <RecentlyViewedSection
          items={recentlyViewed}
          loading={recentLoading}
          title="Recently Viewed"
        />
        {!recentLoading && recentlyViewed.length === 0 && (
          <p className="text-dark-lighter mb-8">No recent activity.</p>
        )}
        
        {/* Trending Movies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Trending Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingMovies.map((movie) => (
              <ContentCard key={movie.id} content={movie} contentType="movie" />
            ))}
          </div>
        </section>
        
        {/* Trending TV Shows Section */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Trending TV Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingTV.map((tv) => (
              <ContentCard key={tv.id} content={tv} contentType="tv" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;



