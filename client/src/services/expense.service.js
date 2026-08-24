import api from "../api/axios";

const getExpenses = async (params = {}) => {
  const response = await api.get("/expenses", {
    params,
  });

  return response.data;
};

const getExpenseById = async (id) => {
  const response = await api.get(
    `/expenses/${id}`
  );

  return response.data;
};

const createExpense = async (expenseData) => {
  const response = await api.post(
    "/expenses",
    expenseData
  );

  return response.data;
};

const updateExpense = async (
  id,
  expenseData
) => {
  const response = await api.put(
    `/expenses/${id}`,
    expenseData
  );

  return response.data;
};

const deleteExpense = async (id) => {
  const response = await api.delete(
    `/expenses/${id}`
  );

  return response.data;
};

const getExpenseSummary = async (
  params = {}
) => {
  const response = await api.get(
    "/expenses/reports/summary",
    { params }
  );

  return response.data;
};

const getExpensesByCategory = async (
  params = {}
) => {
  const response = await api.get(
    "/expenses/reports/by-category",
    { params }
  );

  return response.data;
};

const getExpensesByDate = async (
  params = {}
) => {
  const response = await api.get(
    "/expenses/reports/by-date",
    { params }
  );

  return response.data;
};

const getMonthlyExpenses = async (
  params = {}
) => {
  const response = await api.get(
    "/expenses/reports/monthly",
    { params }
  );

  return response.data;
};

export default {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpensesByCategory,
  getExpensesByDate,
  getMonthlyExpenses,
};