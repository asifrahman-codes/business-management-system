const AppError = require(
  "../utils/app-error.util"
);

const expenseRepository = require(
  "../repositories/expense.repository"
);

const createExpense = async ({
  expenseData,
  userId,
}) => {
  const expense =
    await expenseRepository.createExpense({
      ...expenseData,
      recordedBy: userId,
    });

  return expense;
};

const getExpenses = async () => {
  return await expenseRepository.getExpenses();
};

const getExpenseById = async (expenseId) => {
  const expense =
    await expenseRepository.getExpenseById(
      expenseId
    );

  if (!expense) {
    throw new AppError(
      "Expense not found",
      404
    );
  }

  return expense;
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
};