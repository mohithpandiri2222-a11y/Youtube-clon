// ============================================
// db.js — MongoDB connection helper
// ============================================
// Connects to MongoDB using the URI from the .env file.
// If the connection fails, the server keeps running
// but database features won't work until it's fixed.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error(`💡 TIP: Make sure MongoDB is running, or update MONGO_URI in .env`);
    console.error(`💡 You can use free MongoDB Atlas: https://www.mongodb.com/atlas`);
    // Don't exit — let the server run so other routes still work
  }
};

module.exports = connectDB;
