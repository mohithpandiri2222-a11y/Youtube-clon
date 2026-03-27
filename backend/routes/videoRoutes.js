// ============================================
// videoRoutes.js — URL routes for video APIs
// ============================================
// Routes map URLs to controller functions.
// The upload middleware is applied to the POST route.

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

// Import the controller functions
const {
  createVideo,
  getAllVideos,
  getVideoById,
  searchVideos,
  deleteVideo,
} = require("../controllers/videoController");

// ⚠️ /search must come BEFORE /:id (otherwise "search" is treated as an ID)
router.get("/search", searchVideos);   // GET /api/videos/search?q=term

// POST /api/videos — upload.fields() tells Multer to expect
// a "video" file and a "thumbnail" file (both optional)
router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

router.get("/", getAllVideos);           // GET  /api/videos
router.get("/:id", getVideoById);       // GET  /api/videos/abc123
router.delete("/:id", deleteVideo);     // DELETE /api/videos/abc123

module.exports = router;
