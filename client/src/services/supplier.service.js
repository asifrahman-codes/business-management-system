import api from "../api/axios";

const getSuppliers = async (params = {}) => {
  const response = await api.get(
    "/suppliers",
    {
      params,
    }
  );

  return response.data;
};

const getSupplierById = async (id) => {
  const response = await api.get(
    `/suppliers/${id}`
  );

  return response.data;
};

const createSupplier = async (
  supplierData
) => {
  const response = await api.post(
    "/suppliers",
    supplierData
  );

  return response.data;
};

const updateSupplier = async (
  id,
  supplierData
) => {
  const response = await api.patch(
    `/suppliers/${id}`,
    supplierData
  );

  return response.data;
};

const deleteSupplier = async (id) => {
  const response = await api.delete(
    `/suppliers/${id}`
  );

  return response.data;
};

export default {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};