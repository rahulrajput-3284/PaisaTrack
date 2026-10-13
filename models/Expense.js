// models/Expense.js — Expense ka MongoDB schema
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    // Kis user ka expense hai — hamesha ObjectId se link karo
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title zaroori hai"],
      trim: true,
      maxlength: [100, "Title 100 characters se kam rakho"],
    },
    amount: {
      type: Number,
      required: [true, "Amount zaroori hai"],
      min: [0, "Amount negative nahi ho sakta"],
    },
    category: {
      type: String,
      required: [true, "Category zaroori hai"],
      // Ye list frontend dropdown me bhi use kar sakte ho
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment",
        "Health",
        "Education",
        "Other",
      ],
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Date zaroori hai"],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [300, "Note 300 characters se kam rakho"],
    },
    // Optional: agar receipt upload feature jodna ho
    receiptUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Fast sorting + filtering ke liye compound index
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
