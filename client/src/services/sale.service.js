import api from "../api/axios";

export const searchProductsForPos = async (
  search = ""
) => {
  const response = await api.get(
    "/products/pos-search",
    {
      params: {
        search,
      },
    }
  );

  return response.data;
};

export const createSale = async (saleData) => {
  const response = await api.post(
    "/sales",
    saleData
  );

  return response.data;
};

export const getSales = async (params = {}) => {
  const response = await api.get(
    "/sales",
    {
      params,
    }
  );

  return response.data;
};

export const getSaleById = async (saleId) => {
  const response = await api.get(
    `/sales/${saleId}`
  );

  return response.data;
};

export const getSaleReceipt = async (
  saleId
) => {
  const response = await api.get(
    `/sales/${saleId}/receipt`
  );

  return response.data;
};