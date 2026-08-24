import api from "../api/axios";

const getProfitReport = async (params = {}) => {
  const response = await api.get("/reports/profit", {
    params,
  });

  return response.data;
};

const getExpenseReport = async (params = {}) => {
  const response = await api.get("/reports/expenses", {
    params,
  });

  return response.data;
};

const getSalesReport = async (params = {}) => {
  const response = await api.get("/reports/sales", {
    params,
  });

  return response.data;
};

const getMonthlyReport = async (params = {}) => {
  const response = await api.get("/reports/monthly", {
    params,
  });

  return response.data;
};

export default {
  getProfitReport,
  getExpenseReport,
  getSalesReport,
  getMonthlyReport,
};