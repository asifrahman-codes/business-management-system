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
      message:
        "Expense created successfully",
      data: expense,
    });
  }
);

const getExpenses = asyncHandler(
  async (req, res) => {
    const {
      page,
      limit,
      category,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    } = req.query;

    const result =
      await expenseService.getExpenses({
        page: page
          ? Number(page)
          : 1,

        limit: limit
          ? Number(limit)
          : 10,

        category,
        startDate,
        endDate,
        sortBy: sortBy || "date",
        sortOrder:
          sortOrder || "desc",
      });

    return res.status(200).json({
      success: true,
      data: result.expenses,
      pagination:
        result.pagination,
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

const updateExpense = asyncHandler(
  async (req, res) => {
    const expense =
      await expenseService.updateExpense(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Expense updated successfully",
      data: expense,
    });
  }
);

const deleteExpense = asyncHandler(
  async (req, res) => {
    await expenseService.deleteExpense(
      req.params.id
    );

    return res.status(204).send();
  }
);


const getExpenseSummary = asyncHandler(
  async (req, res) => {
    const {
      startDate,
      endDate,
    } = req.query;

    const summary =
      await expenseService.getExpenseSummary({
        startDate,
        endDate,
      });

    return res.status(200).json({
      success: true,
      data: summary,
    });
  }
);

const getExpensesByCategory = asyncHandler(
  async (req, res) => {
    const {
      startDate,
      endDate,
    } = req.query;

    const result =
      await expenseService.getExpensesByCategory({
        startDate,
        endDate,
      });

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);

const getExpensesByDate = asyncHandler(
  async (req, res) => {
    const {
      startDate,
      endDate,
    } = req.query;

    const result =
      await expenseService.getExpensesByDate({
        startDate,
        endDate,
      });

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpensesByCategory,
  getExpensesByDate,
};