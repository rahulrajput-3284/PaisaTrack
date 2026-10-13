// models/User.js — User ka MongoDB schema
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name zaroori hai"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Sahi email daalo"],
    },
    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: [6, "Password kam se kam 6 characters ka ho"],
      select: false, // default me password query nahi hoga (security)
    },
  },
  { timestamps: true }
);

// ---------- Pre-save hook: password hash karo ----------
// Hamesha yahi tarika use karo — plain text password kabhi DB me na jaaye.
userSchema.pre("save", async function (next) {
  // Agar password change nahi hua to dobara hash karne ki zarurat nahi
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------- Helper: login ke waqt password compare karo ----------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
