// routes/expenseRoutes.js — /api/expenses ke saare routes (sab protected)
const express = require("express");
const router = express.Router();
const {
  addExpense,
  getExpenses,
  getSummary,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

// Har expense route protected hai — pehle login karo
router.use(protect);

// ⚠️ IMPORTANT: "/summary" ko "/:id" se PEHLE likhna zaroori hai,
// warna Express "summary" ko ek id samajh lega.
router.get("/summary", getSummary);

router.route("/").get(getExpenses).post(addExpense);

router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense);

module.exports = router;
