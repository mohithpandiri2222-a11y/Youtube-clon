// ============================================
// videoController.js — Functions that handle video requests
// ============================================
// Controllers contain the actual logic for each API endpoint.

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Video = require("../models/Video");

// ---- 1. CREATE A VIDEO (with file upload) ----
// Called when: POST /api/videos
// Now accepts multipart/form-data with video & thumbnail files
const createVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    // --- Input validation ---
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    // Build the video data from safe fields only
    const videoData = {
      title: title.trim(),
      description: description || "",
    };

    // If a video file was uploaded, save its path
    // req.files is populated by Multer middleware
    if (req.files && req.files.video) {
      // Create a URL path that the browser can access
      videoData.videoUrl = "/uploads/videos/" + req.files.video[0].filename;
    }

    // If a thumbnail was uploaded, save its path
    if (req.files && req.files.thumbnail) {
      videoData.thumbnailUrl = "/uploads/thumbnails/" + req.files.thumbnail[0].filename;
    }

    // Check that we have a video (either uploaded or URL in body)
    if (!videoData.videoUrl && req.body.videoUrl) {
      videoData.videoUrl = req.body.videoUrl.trim();
    }

    if (!videoData.thumbnailUrl && req.body.thumbnailUrl) {
      videoData.thumbnailUrl = req.body.thumbnailUrl;
    }

    if (!videoData.videoUrl) {
      return res.status(400).json({ message: "Video file or videoUrl is required" });
    }

    // views and likes always start at 0 — NOT taken from req.body
    const video = await Video.create(videoData);
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ---- 2. GET ALL VIDEOS ----
// Called when: GET /api/videos
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ---- 3. GET ONE VIDEO BY ID ----
// Called when: GET /api/videos/:id
const getVideoById = async (req, res) => {
  try {
    // Check if the ID format is valid (prevents crashes from bad IDs)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Increment the view count by 1
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ---- 4. SEARCH VIDEOS BY TITLE ----
// Called when: GET /api/videos/search?q=term
const searchVideos = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ message: "Search query (q) is required" });
    }

    const videos = await Video.find({
      title: { $regex: searchTerm.trim(), $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ---- 5. DELETE A VIDEO ----
// Called when: DELETE /api/videos/:id
const deleteVideo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete the video file if it exists in our uploads folder
    if (video.videoUrl && video.videoUrl.startsWith("/uploads/")) {
      const videoPath = path.join(__dirname, "..", video.videoUrl);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    // Delete the thumbnail file if it exists
    if (video.thumbnailUrl && video.thumbnailUrl.startsWith("/uploads/")) {
      const thumbPath = path.join(__dirname, "..", video.thumbnailUrl);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    // Remove from database
    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  searchVideos,
  deleteVideo,
};
