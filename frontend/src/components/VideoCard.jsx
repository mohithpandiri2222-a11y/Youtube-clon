// ============================================
// VideoCard.jsx — A single video thumbnail card
// ============================================

import { Link } from "react-router-dom";

function VideoCard({ video }) {
  const formatViews = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count.toString();
  };

  const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hours ago";
    if (seconds < 2592000) return Math.floor(seconds / 86400) + " days ago";
    return Math.floor(seconds / 2592000) + " months ago";
  };

  const thumbnailSrc = video.thumbnailUrl
    ? (video.thumbnailUrl.startsWith("http")
        ? video.thumbnailUrl
        : `http://localhost:5000${video.thumbnailUrl}`)
    : null;

  return (
    <Link to={`/video/${video._id}`} className="group block">
      {/* Enhance hover: subtle scale up and shadow pop */}
      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/40 hover:-translate-y-1">
        
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-gray-200 dark:from-red-900/40 dark:to-gray-800 flex items-center justify-center">
              <span className="text-4xl opacity-50">🎬</span>
            </div>
          )}

          {/* Hover play icon */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300">
            <span className="text-white text-5xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 drop-shadow-lg">
              ▶
            </span>
          </div>
        </div>

        {/* Video info */}
        <div className="p-3">
          <div className="flex gap-3">
            {/* Publisher Avatar placeholder (optional UI enhancement) */}
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-400 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              {video.title.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AnonUser</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
