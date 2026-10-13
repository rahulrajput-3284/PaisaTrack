// config/db.js — MongoDB connection
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MONGO_URI .env file me hota hai (example: mongodb+srv://...)
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // connection fail ho to server band kar do
  }
};

module.exports = connectDB;
