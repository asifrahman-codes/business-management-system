const Employee = require(
  "../models/employee.model"
);

const createEmployee = async (
  employeeData
) => {
  return await Employee.create(
    employeeData
  );
};

const getEmployees = async ({
  filter = {},
  skip = 0,
  limit = 10,
}) => {
  const [employees, total] =
    await Promise.all([
      Employee.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Employee.countDocuments(filter),
    ]);

  return {
    employees,
    total,
  };
};

const getEmployeeById = async (
  employeeId
) => {
  return await Employee.findById(
    employeeId
  );
};

const updateEmployee = async (
  employeeId,
  employeeData
) => {
  return await Employee.findByIdAndUpdate(
    employeeId,
    employeeData,
    {
      new: true,
      runValidators: true,
    }
  );
};

const updateEmployeeStatus = async (
  employeeId,
  status
) => {
  return await Employee.findByIdAndUpdate(
    employeeId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteEmployee = async (
  employeeId
) => {
  return await Employee.findByIdAndDelete(
    employeeId
  );
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
};