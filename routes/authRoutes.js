// routes/authRoutes.js — /api/auth ke saare routes
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private route — protect middleware pehle chalta hai
router.get("/me", protect, getMe);

module.exports = router;
