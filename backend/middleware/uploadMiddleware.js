// ============================================
// uploadMiddleware.js — Multer configuration for file uploads
// ============================================
// Multer is a middleware that handles file uploads.
// It saves uploaded files to specific folders on the server.

const multer = require("multer");
const path = require("path");

// --- Storage configuration ---
// This tells Multer WHERE to save files and WHAT to name them
const storage = multer.diskStorage({
  // WHERE to save — decide folder based on the field name
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, "uploads/videos");       // Video files go here
    } else if (file.fieldname === "thumbnail") {
      cb(null, "uploads/thumbnails");   // Thumbnail images go here
    } else {
      cb(null, "uploads");              // Everything else goes here
    }
  },

  // WHAT to name the file — use timestamp + original name to avoid duplicates
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// --- File filter ---
// Only allow specific file types (security!)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    // Allow common video formats
    const videoTypes = [".mp4", ".webm", ".mkv", ".avi", ".mov"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (videoTypes.includes(ext)) {
      cb(null, true);    // Accept the file
    } else {
      cb(new Error("Only video files (mp4, webm, mkv, avi, mov) are allowed"), false);
    }
  } else if (file.fieldname === "thumbnail") {
    // Allow common image formats
    const imageTypes = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (imageTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"), false);
    }
  } else {
    cb(null, true);
  }
};

// --- Create the upload middleware ---
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max file size
  },
});

module.exports = upload;
