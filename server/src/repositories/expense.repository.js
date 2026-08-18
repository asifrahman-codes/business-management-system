const Expense = require("../models/expense.model");

const createExpense = async (expenseData) => {
  return await Expense.create(expenseData);
};

const getExpenses = async () => {
  return await Expense.find()
    .populate(
      "recordedBy",
      "name email role"
    )
    .sort({
      date: -1,
      createdAt: -1,
    })
    .lean();
};

const getExpenseById = async (expenseId) => {
  return await Expense.findById(expenseId)
    .populate(
      "recordedBy",
      "name email role"
    )
    .lean();
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
};