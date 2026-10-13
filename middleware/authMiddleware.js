// middleware/authMiddleware.js — JWT protect middleware
// Ye har protected route se pehle chalta hai aur verify karta hai ki user logged-in hai ya nahi.
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Token "Authorization: Bearer <token>" header me aata hai
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Token verify karo JWT_SECRET se
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Password ke bina user nikaalo aur req.user me daal do
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User nahi mila" });
      }

      return next(); // sab theek -> aage badho
    } catch (error) {
      return res.status(401).json({ message: "Token valid nahi hai" });
    }
  }

  return res
    .status(401)
    .json({ message: "Token nahi mila, pehle login karo" });
};

module.exports = { protect };
