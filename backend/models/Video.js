// ============================================
// Video.js — MongoDB schema for a video
// ============================================
// This file defines the "shape" of a video document
// in our MongoDB database. Think of it like a template
// that every video must follow.

const mongoose = require("mongoose");

// Define the schema (structure) for a video
const videoSchema = new mongoose.Schema(
  {
    // Video title — required, every video needs a name
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true, // removes extra spaces
    },

    // Optional description
    description: {
      type: String,
      default: "",
    },

    // URL where the video file is stored
    videoUrl: {
      type: String,
      default: "",
    },

    // URL for the video's thumbnail image
    thumbnailUrl: {
      type: String,
      default: "",
    },

    // Number of views — starts at 0
    views: {
      type: Number,
      default: 0,
    },

    // Number of likes — starts at 0
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    // This option automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create the model from the schema and export it
// "Video" = name of the collection in MongoDB (becomes "videos")
module.exports = mongoose.model("Video", videoSchema);
