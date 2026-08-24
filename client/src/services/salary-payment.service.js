import api from "../api/axios";

const getSalaryPayments = async (params = {}) => {
  const response = await api.get("/salary-payments", {
    params,
  });

  return response.data;
};

const getSalaryPaymentById = async (id) => {
  const response = await api.get(`/salary-payments/${id}`);

  return response.data;
};

const getEmployeeSalaryPayments = async (
  employeeId,
  params = {}
) => {
  const response = await api.get(
    `/salary-payments/employee/${employeeId}`,
    {
      params,
    }
  );

  return response.data;
};

const createSalaryPayment = async (data) => {
  const response = await api.post(
    "/salary-payments",
    data
  );

  return response.data;
};

const updateSalaryPayment = async (id, data) => {
  const response = await api.put(
    `/salary-payments/${id}`,
    data
  );

  return response.data;
};

const updateSalaryPaymentStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/salary-payments/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

const deleteSalaryPayment = async (id) => {
  const response = await api.delete(
    `/salary-payments/${id}`
  );

  return response.data;
};

export {
  getSalaryPayments,
  getSalaryPaymentById,
  getEmployeeSalaryPayments,
  createSalaryPayment,
  updateSalaryPayment,
  updateSalaryPaymentStatus,
  deleteSalaryPayment,
};