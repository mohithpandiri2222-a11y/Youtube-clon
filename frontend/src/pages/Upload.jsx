// ============================================
// Upload.jsx — Video upload page
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/videoApi";

function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      // Auto-fill title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!videoFile) {
      setError("Please select a video file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description);
      formData.append("video", videoFile);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const result = await uploadVideo(formData);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/video/${result._id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      
      {/* Page header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Upload Video</h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
        Share your video with the world
      </p>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl px-6 py-5 mb-8 shadow-sm text-center transform animate-[bounce_0.5s_ease-out]">
          <p className="text-green-700 dark:text-green-400 font-bold text-lg">🎉 Video uploaded successfully!</p>
          <p className="text-green-600 dark:text-green-500 mt-1">Redirecting to your video...</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-6 py-4 mb-6">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">❌ {error}</p>
        </div>
      )}

      {/* Upload form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm dark:shadow-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Title input */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is your video about?"
              className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-0 transition-colors font-medium text-lg"
              disabled={loading}
            />
          </div>

          {/* Description input */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              rows={4}
              className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video file input */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                Video File <span className="text-red-500">*</span>
              </label>
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 text-center hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors h-64 flex flex-col justify-center">
                {videoPreview ? (
                  <div className="w-full">
                    <video
                      src={videoPreview}
                      className="max-h-36 mx-auto rounded-lg mb-3 shadow-md bg-black"
                      controls
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-sm truncate px-4 font-medium">{videoFile?.name}</p>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setVideoFile(null); setVideoPreview(null); }}
                      className="text-red-600 dark:text-red-400 text-sm font-bold mt-2 hover:underline relative z-10"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-5xl block mb-3 opacity-80">🎥</span>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mb-1">
                      Drag and drop to upload
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                      MP4, WebM, MKV, AVI, MOV • Max 50MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className={videoPreview ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Thumbnail file input */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                Thumbnail Image <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 text-center hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors h-64 flex flex-col justify-center">
                {thumbnailPreview ? (
                  <div className="w-full">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="max-h-36 mx-auto rounded-lg mb-3 object-cover shadow-md"
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-sm truncate px-4 font-medium">{thumbnailFile?.name}</p>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setThumbnailFile(null); setThumbnailPreview(null); }}
                      className="text-red-600 dark:text-red-400 text-sm font-bold mt-2 hover:underline relative z-10"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-5xl block mb-3 opacity-80">🖼️</span>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mb-1">
                      Custom thumbnail
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                      JPG, PNG, WebP • Max 50MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className={thumbnailPreview ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-800" />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg
              ${loading || success
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed shadow-none"
                : "bg-red-600 hover:bg-red-700 hover:shadow-red-500/30 active:scale-[0.98]"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                Uploading...
              </span>
            ) : success ? (
              "✅ Uploaded!"
            ) : (
              "🚀 Upload Video"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
