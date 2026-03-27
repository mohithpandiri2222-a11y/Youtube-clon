// ============================================
// Home.jsx — Home page showing video grid
// ============================================

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import SkeletonCard from "../components/SkeletonCard";
import { getAllVideos, searchVideos } from "../api/videoApi";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (searchQuery) {
          data = await searchVideos(searchQuery);
        } else {
          data = await getAllVideos();
        }
        setVideos(data);
      } catch (err) {
        setError("Failed to load videos. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  return (
    <div className="px-4 md:px-6 py-6 pb-20">
      
      {/* Page heading */}
      {searchQuery ? (
        <div className="mb-6">
          <h2 className="text-lg text-gray-700 dark:text-gray-300">
            Search results for: <span className="text-gray-900 dark:text-white font-semibold">"{searchQuery}"</span>
          </h2>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Recommended</h2>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-6 py-4 max-w-md text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">❌ {error}</p>
            <p className="text-red-500/70 dark:text-gray-500 text-sm mt-2">
              Make sure to run: cd backend && node server.js
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && videos.length === 0 && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <span className="text-6xl mb-4 block opacity-50">📭</span>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {searchQuery ? "No videos found" : "No videos yet"}
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              {searchQuery ? "Try searching for something else" : "Upload an awesome video to get started!"}
            </p>
          </div>
        </div>
      )}

      {/* Video grid (Skeleton loader OR actual videos) */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? // Show 8 skeleton cards while loading
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : // Show actual videos
              videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
        </div>
      )}
    </div>
  );
}

export default Home;
