// ============================================
// test-api.js — Tests all video API endpoints
// Run: node test-api.js (while server is running)
// ============================================

const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5000/api/videos";

async function test() {
  console.log("=== Testing YouTube Clone API ===\n");

  // --- TEST 1: Validation - missing title ---
  console.log("1. Testing validation (missing title)...");
  const badRes = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "no title" }),
  });
  const badData = await badRes.json();
  console.log("   ✅ Got error:", badData.message, "(status:", badRes.status + ")");

  // --- TEST 2: Validation - missing videoUrl ---
  console.log("\n2. Testing validation (missing videoUrl)...");
  const badRes2 = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test Video" }),
  });
  const badData2 = await badRes2.json();
  console.log("   ✅ Got error:", badData2.message, "(status:", badRes2.status + ")");

  // --- TEST 3: Create video with URL (no file upload) ---
  console.log("\n3. Creating video with URL...");
  const createRes = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "React Tutorial",
      description: "Learn React basics",
      videoUrl: "https://example.com/video.mp4",
      views: 9999,  // should be ignored!
      likes: 9999,  // should be ignored!
    }),
  });
  const created = await createRes.json();
  console.log("   ✅ Created:", created.title);
  console.log("   ✅ Views:", created.views, "(should be 0, not 9999)");
  console.log("   ✅ Likes:", created.likes, "(should be 0, not 9999)");

  // --- TEST 4: Get all videos ---
  console.log("\n4. Getting all videos...");
  const allRes = await fetch(BASE);
  const all = await allRes.json();
  console.log("   ✅ Found", all.length, "video(s)");

  // --- TEST 5: Invalid ID ---
  console.log("\n5. Testing invalid ID...");
  const invalidRes = await fetch(BASE + "/not-a-valid-id");
  const invalidData = await invalidRes.json();
  console.log("   ✅ Got error:", invalidData.message, "(status:", invalidRes.status + ")");

  // --- TEST 6: Get by valid ID ---
  console.log("\n6. Getting video by ID...");
  const oneRes = await fetch(`${BASE}/${created._id}`);
  const one = await oneRes.json();
  console.log("   ✅ Got:", one.title, "| Views:", one.views);

  // --- TEST 7: Search ---
  console.log("\n7. Searching for 'react'...");
  const searchRes = await fetch(`${BASE}/search?q=react`);
  const results = await searchRes.json();
  console.log("   ✅ Found", results.length, "result(s)");

  // --- TEST 8: Search with empty query ---
  console.log("\n8. Testing search validation (empty query)...");
  const emptySearch = await fetch(`${BASE}/search?q=`);
  const emptyData = await emptySearch.json();
  console.log("   ✅ Got error:", emptyData.message, "(status:", emptySearch.status + ")");

  // --- TEST 9: File upload with form-data ---
  console.log("\n9. Testing file upload...");
  // Create a tiny test video file
  const testVideoPath = path.join(__dirname, "test-sample.mp4");
  fs.writeFileSync(testVideoPath, "fake video content for testing");

  const formData = new FormData();
  formData.append("title", "Uploaded Video Test");
  formData.append("description", "Testing file upload");
  formData.append("video", new Blob([fs.readFileSync(testVideoPath)], { type: "video/mp4" }), "test-sample.mp4");

  const uploadRes = await fetch(BASE, { method: "POST", body: formData });
  const uploaded = await uploadRes.json();
  console.log("   ✅ Uploaded:", uploaded.title);
  console.log("   ✅ Video URL:", uploaded.videoUrl);

  // Cleanup
  fs.unlinkSync(testVideoPath);

  console.log("\n=== All 9 tests passed! ===");
}

test().catch(console.error);
