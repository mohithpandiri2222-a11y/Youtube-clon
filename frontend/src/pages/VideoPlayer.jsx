// ============================================
// VideoPlayer.jsx — Video player page
// ============================================

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getVideoById, getAllVideos, deleteVideo } from "../api/videoApi";
import VideoCard from "../components/VideoCard";

function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video? This cannot be undone.")) {
      try {
        setIsDeleting(true);
        await deleteVideo(id);
        navigate("/");
      } catch (err) {
        alert("Failed to delete video: " + err.message);
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const videoData = await getVideoById(id);
        setVideo(videoData);

        const allVideos = await getAllVideos();
        setRelatedVideos(allVideos.filter((v) => v._id !== id).slice(0, 8));
      } catch (err) {
        setError("Failed to load video.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const formatViews = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getVideoSrc = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:5000${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-red-600 dark:border-t-red-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 dark:bg-red-900/20 px-8 py-10 rounded-2xl border border-red-100 dark:border-red-900 shadow-sm max-w-md">
          <span className="text-6xl mb-4 block">😵</span>
          <p className="text-red-700 dark:text-red-400 font-medium mb-6">{error || "Video not found"}</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* ===== LEFT SIDE: Video Player + Info ===== */}
        <div className="flex-1 min-w-0">
          
          {/* Video player */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800">
            <video
              src={getVideoSrc(video.videoUrl)}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video info */}
          <div className="mt-5">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
              {video.title}
            </h1>

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 mt-3 pb-4 border-b border-gray-200 dark:border-gray-800">
              
              {/* Publisher info & stats */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-400 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {video.title.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">AnonUser</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatViews(video.views)} views</span>
                    <span>•</span>
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shrink-0">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors">
                    <span className="text-lg">👍</span> {video.likes || "Like"}
                  </button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
                  <button className="flex items-center px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors">
                    👎
                  </button>
                </div>
                <button className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                  Share
                </button>

                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="hidden sm:flex items-center gap-2 bg-red-50 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border border-red-100 dark:border-red-900/50"
                  title="Delete Video"
                >
                  {isDeleting ? "Deleting..." : "🗑️ Delete"}
                </button>
              </div>
            </div>

            {/* Description */}
            {video.description && (
              <div className="mt-5 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-800 rounded-2xl p-4 transition-colors">
                <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">{formatViews(video.views)} views • {formatDate(video.createdAt)}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT SIDE: Related Videos ===== */}
        <div className="lg:w-80 xl:w-96 shrink-0 mt-8 lg:mt-0">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wider mb-5">
            Up Next
          </h3>
          {relatedVideos.length > 0 ? (
            <div className="flex flex-col gap-4">
              {relatedVideos.map((v) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No related videos yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default VideoPlayer;
