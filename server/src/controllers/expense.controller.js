const asyncHandler = require(
  "../utils/async-handler.util"
);

const expenseService = require(
  "../services/expense.service"
);

const createExpense = asyncHandler(
  async (req, res) => {
    const expense =
      await expenseService.createExpense({
        expenseData: req.body,
        userId: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  }
);

const getExpenses = asyncHandler(
  async (req, res) => {
    const expenses =
      await expenseService.getExpenses();

    return res.status(200).json({
      success: true,
      data: expenses,
    });
  }
);

const getExpenseById = asyncHandler(
  async (req, res) => {
    const expense =
      await expenseService.getExpenseById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: expense,
    });
  }
);

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
};