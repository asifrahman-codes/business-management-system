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

const getExpenseSummary = async ({
  startDate,
  endDate,
}) => {
  const match = {};

  if (startDate || endDate) {
    match.date = {};

    if (startDate) {
      match.date.$gte = startDate;
    }

    if (endDate) {
      match.date.$lte = endDate;
    }
  }

  const result = await Expense.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: "$amount",
        },
        totalExpenses: {
          $sum: 1,
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalAmount: 0,
      totalExpenses: 0,
    }
  );
};

const getExpensesByCategory = async ({
  startDate,
  endDate,
}) => {
  const match = {};

  if (startDate || endDate) {
    match.date = {};

    if (startDate) {
      match.date.$gte = startDate;
    }

    if (endDate) {
      match.date.$lte = endDate;
    }
  }

  return await Expense.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: "$category",
        totalAmount: {
          $sum: "$amount",
        },
        totalExpenses: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalAmount: -1,
      },
    },
  ]);
};

const getExpensesByDate = async ({
  startDate,
  endDate,
}) => {
  const match = {};

  if (startDate || endDate) {
    match.date = {};

    if (startDate) {
      match.date.$gte = startDate;
    }

    if (endDate) {
      match.date.$lte = endDate;
    }
  }

  return await Expense.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },
        totalAmount: {
          $sum: "$amount",
        },
        totalExpenses: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  getExpenseSummary,
  getExpensesByCategory,
  getExpensesByDate,
};