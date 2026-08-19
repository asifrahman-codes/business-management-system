const employeeRepository = require(
  "../repositories/employee.repository"
);

const AppError = require(
  "../utils/app-error.util"
);

const {
  isValidObjectId,
} = require(
  "../utils/validate-object-id"
);

const createEmployee = async (
  employeeData
) => {
  return await employeeRepository
    .createEmployee(employeeData);
};

const getEmployees = async ({
  page = 1,
  limit = 10,
  status,
  search,
}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        position: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip =
    (page - 1) * limit;

  const {
    employees,
    total,
  } = await employeeRepository
    .getEmployees({
      filter,
      skip,
      limit,
    });

  return {
    employees,
    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

const getEmployeeById = async (
  employeeId
) => {
  if (!isValidObjectId(employeeId)) {
    throw new AppError(
      "Invalid employee ID",
      400
    );
  }

  const employee =
    await employeeRepository
      .getEmployeeById(employeeId);

  if (!employee) {
    throw new AppError(
      "Employee not found",
      404
    );
  }

  return employee;
};

const updateEmployee = async (
  employeeId,
  employeeData
) => {
  if (!isValidObjectId(employeeId)) {
    throw new AppError(
      "Invalid employee ID",
      400
    );
  }

  const employee =
    await employeeRepository
      .updateEmployee(
        employeeId,
        employeeData
      );

  if (!employee) {
    throw new AppError(
      "Employee not found",
      404
    );
  }

  return employee;
};

const updateEmployeeStatus = async (
  employeeId,
  status
) => {
  if (!isValidObjectId(employeeId)) {
    throw new AppError(
      "Invalid employee ID",
      400
    );
  }

  const employee =
    await employeeRepository
      .updateEmployeeStatus(
        employeeId,
        status
      );

  if (!employee) {
    throw new AppError(
      "Employee not found",
      404
    );
  }

  return employee;
};

const deleteEmployee = async (
  employeeId
) => {
  if (!isValidObjectId(employeeId)) {
    throw new AppError(
      "Invalid employee ID",
      400
    );
  }

  const employee =
    await employeeRepository
      .deleteEmployee(employeeId);

  if (!employee) {
    throw new AppError(
      "Employee not found",
      404
    );
  }

  return employee;
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
};