// controllers/expenseController.js — Expense ka CRUD + summary (aggregation)
const mongoose = require("mongoose");
const Expense = require("../models/Expense");

// @desc    Naya expense add karo
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note, receiptUrl } = req.body;

    if (!title || amount === undefined || !category) {
      return res
        .status(400)
        .json({ message: "Title, amount aur category zaroori hain" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount 0 se bada hona chahiye" });
    }

    // Dhyan do: user hamesha req.user se lo, kabhi frontend se nahi
    // (warna koi bhi kisi aur ka expense bana sakta hai)
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      note,
      receiptUrl,
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    // Validation error ho to saaf message do
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error, try again" });
  }
};

// @desc    Logged-in user ke saare expenses (filter + search + sort)
// @route   GET /api/expenses?category=Food&startDate=2026-09-01&endDate=2026-09-30&search=chai&sort=amount_desc
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, search, sort } = req.query;

    // Query hamesha current user se bound hai
    const query = { user: req.user._id };

    if (category) query.category = category;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Title/note me text search (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options — frontend se aane wali value ko whitelist karo
    const sortMap = {
      date_desc: { date: -1 },
      date_asc: { date: 1 },
      amount_desc: { amount: -1 },
      amount_asc: { amount: 1 },
    };
    const sortBy = sortMap[sort] || { date: -1 };

    const expenses = await Expense.find(query).sort(sortBy);
    return res.json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again" });
  }
};

// @desc    Category-wise total + overall total + monthly trend (MongoDB aggregation)
// @route   GET /api/expenses/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Pipeline 1: category-wise sum (pie chart ke liye)
    const byCategory = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, category: "$_id", total: 1, count: 1 } },
    ]);

    // Pipeline 2: mahine-wise total (bar chart ke liye)
    const monthly = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          count: 1,
        },
      },
    ]);

    // Overall total (sabka jod)
    const grandTotal = byCategory.reduce((sum, item) => sum + item.total, 0);

    return res.json({ grandTotal, byCategory, monthly });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again" });
  }
};

// @desc    Ek expense ki detail
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    // id valid ObjectId hai ya nahi check karo, warna Mongoose crash karta hai
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Galat expense id" });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id, // sirf apna expense dekh sakta hai
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense nahi mila" });
    }

    return res.json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again" });
  }
};

// @desc    Expense update karo
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Galat expense id" });
    }

    // user: req.user._id condition hai isliye dusre user ka expense update nahi hoga
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense nahi mila" });
    }

    const { title, amount, category, date, note, receiptUrl } = req.body;

    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (note !== undefined) expense.note = note;
    if (receiptUrl !== undefined) expense.receiptUrl = receiptUrl;

    const updated = await expense.save(); // save() se validators chalte hain
    return res.json(updated);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error, try again" });
  }
};

// @desc    Expense delete karo
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Galat expense id" });
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense nahi mila" });
    }

    return res.json({ message: "Expense delete ho gaya", id: expense._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again" });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getSummary,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
