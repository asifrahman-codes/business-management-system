import api from "../api/axios";

const getEmployees = async (params = {}) => {
  const response = await api.get("/employees", {
    params,
  });

  return response.data;
};

const getEmployeeById = async (id) => {
  const response = await api.get(`/employees/${id}`);

  return response.data;
};

const createEmployee = async (data) => {
  const response = await api.post("/employees", data);

  return response.data;
};

const updateEmployee = async (id, data) => {
  const response = await api.put(`/employees/${id}`, data);

  return response.data;
};

const updateEmployeeStatus = async (id, status) => {
  const response = await api.patch(
    `/employees/${id}/status`,
    { status }
  );

  return response.data;
};

const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);

  return response.data;
};

export {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
};