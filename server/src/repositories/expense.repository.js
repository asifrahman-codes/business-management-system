const Expense = require("../models/expense.model");

const createExpense = async (expenseData) => {
  return await Expense.create(expenseData);
};

const getExpenses = async ({
  filter,
  skip,
  limit,
  sort,
}) => {
  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate(
        "recordedBy",
        "name email role"
      )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    Expense.countDocuments(filter),
  ]);

  return {
    expenses,
    total,
  };
};

const getExpenseById = async (expenseId) => {
  return await Expense.findById(expenseId)
    .populate(
      "recordedBy",
      "name email role"
    )
    .lean();
};


const updateExpense = async (
  expenseId,
  expenseData
) => {
  return await Expense.findByIdAndUpdate(
    expenseId,
    expenseData,
    {
      new: true,
      runValidators: true,
    }
  )
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
  updateExpense,
};