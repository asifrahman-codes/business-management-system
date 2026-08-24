import api from "../api/axios";

const searchProductsForPos = async (
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

const createSale = async (saleData) => {
  const response = await api.post(
    "/sales",
    saleData
  );

  return response.data;
};

const getSales = async (params = {}) => {
  const response = await api.get(
    "/sales",
    {
      params,
    }
  );

  return response.data;
};

const getSaleById = async (saleId) => {
  const response = await api.get(
    `/sales/${saleId}`
  );

  return response.data;
};

const getSaleReceipt = async (
  saleId
) => {
  const response = await api.get(
    `/sales/${saleId}/receipt`
  );

  return response.data;
};

export default {
  searchProductsForPos,
  createSale,
  getSales,
  getSaleById,
  getSaleReceipt,
};