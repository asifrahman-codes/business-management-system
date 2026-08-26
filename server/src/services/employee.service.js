const employeeRepository = require(
  "../repositories/employee.repository"
);

const AppError = require(
  "../utils/app-error.util"
);

const User = require(
  "../models/User.model"
);

const {
  isValidObjectId,
} = require(
  "../utils/validate-object-id"
);

/*
 * Create Employee
 *
 * If position is Cashier:
 * - Create Employee
 * - Create User login account
 */
const createEmployee = async (
  employeeData
) => {
  const {
    name,
    email,
    password,
    position,
    ...employeeFields
  } = employeeData;

  const isCashier =
    position.trim().toLowerCase() ===
    "cashier";

  /*
   * Cashier must have login credentials.
   */
  if (isCashier) {
    if (!email) {
      throw new AppError(
        "Email is required for cashier login",
        400
      );
    }

    if (!password) {
      throw new AppError(
        "Password is required for cashier login",
        400
      );
    }

    if (password.length < 8) {
      throw new AppError(
        "Password must be at least 8 characters",
        400
      );
    }

    /*
     * Check if email already belongs
     * to another login account.
     */
    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existingUser) {
      throw new AppError(
        "A user with this email already exists",
        409
      );
    }
  }

  /*
   * Create employee record.
   */
  const employee =
    await employeeRepository.createEmployee({
      name,
      email,
      position,
      ...employeeFields,
    });

  /*
   * Create login account for cashier.
   */
  if (isCashier) {
    try {
      await User.create({
        name,
        email,
        password,
        role: "cashier",
        isActive: true,
      });
    } catch (error) {
      /*
       * If User creation fails,
       * remove the employee we just created.
       */
      await employeeRepository.deleteEmployee(
        employee._id
      );

      throw error;
    }
  }

  return employee;
};

/*
 * Get Employees
 */
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
  } =
    await employeeRepository.getEmployees({
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

/*
 * Get Employee By ID
 */
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

/*
 * Update Employee
 */
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

/*
 * Update Employee Status
 */
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

/*
 * Delete Employee
 */
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