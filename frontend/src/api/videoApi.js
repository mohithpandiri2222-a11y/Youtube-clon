// ============================================
// videoApi.js — API calls to the backend
// ============================================
// This file keeps all backend communication in one place.
// Components just call these functions instead of writing fetch() everywhere.

const API_BASE = "http://localhost:5000/api/videos";

// Get all videos (for the Home page grid)
export const getAllVideos = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error("Failed to fetch videos");
  return response.json();
};

// Get one video by ID (for the Video Player page)
export const getVideoById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch video");
  return response.json();
};

// Search videos by title
export const searchVideos = async (query) => {
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Search failed");
  return response.json();
};

// Upload a new video (sends FormData with video file + thumbnail + metadata)
export const uploadVideo = async (formData) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    body: formData, // No Content-Type header! Browser sets it automatically for FormData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
};

// Delete a video by ID
export const deleteVideo = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Delete failed");
  }
  
  return data;
};
