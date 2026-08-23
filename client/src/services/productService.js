import api from "../api/axios";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post(
    "/products",
    productData
  );

  return response.data;
};

export const updateProduct = async (
  id,
  productData
) => {
  const response = await api.patch(
    `/products/${id}`,
    productData
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};

export const getInventorySummary = async () => {
  const response = await api.get(
    "/products/inventory-summary"
  );

  return response.data;
};

export const searchProductsForPos = async (
  search
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