// controllers/authController.js — Register, Login, GetMe logic
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// JWT token banane ka helper (expiry 30 din)
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Naya user register
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ---- Basic validation ----
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email aur password zaroori hain" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password kam se kam 6 characters ka ho" });
    }

    // ---- Duplicate email check ----
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ message: "Ye email pehle se registered hai" });
    }

    // ---- User banao (password pre-save hook me hash ho jayega) ----
    const user = await User.create({ name, email, password });

    // ---- Response: token + user info (password NEVER) ----
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again" });
  }
};

// @desc    User login
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email aur password dono daalo" });
    }

    // password field default me select:false hai, isliye +password karke laao
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      // Security: "email galat hai" ya "password galat hai" alag-alag na batao
      return res.status(401).json({ message: "Email ya password galat hai" });
    }

    // bcrypt se compare karo
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ya password galat hai" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again" });
  }
};

// @desc    Current logged-in user ki detail
// @route   GET /api/auth/me
// @access  Private (protect middleware)
const getMe = async (req, res) => {
  // req.user authMiddleware ne set kiya hai
  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

module.exports = { registerUser, loginUser, getMe };
