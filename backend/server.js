// ============================================
// server.js — Main entry point for the backend
// ============================================

// 1. Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();

// Fix: Use Google DNS so MongoDB Atlas SRV records resolve correctly
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// 2. Import packages
const path = require("path");
const express = require("express");   // Web framework
const cors = require("cors");         // Allow frontend to talk to backend
const connectDB = require("./config/db"); // MongoDB connection helper

// 3. Import routes
const videoRoutes = require("./routes/videoRoutes");

// 4. Connect to MongoDB
connectDB();

// 5. Create the Express app
const app = express();

// 6. Middleware (runs on every request)
app.use(cors());                      // Allow cross-origin requests
app.use(express.json());              // Parse JSON request bodies

// 7. Serve uploaded files as static files
// This means: /uploads/videos/myfile.mp4 → serves the actual file
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 8. A simple test route to check if server is working
app.get("/", (req, res) => {
  res.json({ message: "YouTube Clone API is running!" });
});

// 9. Use video routes — all video endpoints start with /api/videos
app.use("/api/videos", videoRoutes);

// 10. Handle Multer errors (file too large, wrong type, etc.)
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Maximum size is 50MB." });
  }
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// 11. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
