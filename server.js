// server.js — PaisaTrack backend entry point
// Yahi file Express app ko start karti hai aur DB se connect karti hai.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// .env file se variables load karo (PORT, MONGO_URI, JWT_SECRET ...)
dotenv.config();

// MongoDB se connect karo
connectDB();

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // sirf apne frontend ko allow karo
    credentials: true,
  })
);
app.use(express.json()); // JSON body parse karne ke liye

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "PaisaTrack API chal rahi hai 🚀" });
});

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// ---------- 404 + Error handling (sabse last me) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
