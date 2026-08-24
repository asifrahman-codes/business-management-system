import api from "../api/axios";

export const getSalesReport = async (startDate, endDate) => {
  const response = await api.get("/reports/sales", {
    params: {
      startDate,
      endDate,
    },
  });

  return response.data;
};

export const getExpenseReport = async (startDate, endDate) => {
  const response = await api.get("/reports/expenses", {
    params: {
      startDate,
      endDate,
    },
  });

  return response.data;
};

export const getProfitReport = async (startDate, endDate) => {
  const response = await api.get("/reports/profit", {
    params: {
      startDate,
      endDate,
    },
  });

  return response.data;
};

export const getMonthlyReport = async (year) => {
  const response = await api.get("/reports/monthly", {
    params: {
      year,
    },
  });

  return response.data;
};

export const getInventoryReport = async () => {
  const response = await api.get("/reports/inventory");

  return response.data;
};