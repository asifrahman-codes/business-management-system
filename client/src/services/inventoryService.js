import api from "../api/axios";

export const getInventorySummary = async () => {
  const response = await api.get(
    "/products/inventory-summary"
  );

  return response.data;
};

export const getInventoryTransactions = async (
  params = {}
) => {
  const response = await api.get(
    "/inventory-transactions",
    {
      params,
    }
  );

  return response.data;
};