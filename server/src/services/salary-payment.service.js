const salaryPaymentRepository =
  require(
    "../repositories/salary-payment.repository"
  );

const Employee = require(
  "../models/employee.model"
);

const AppError = require(
  "../utils/app-error.util"
);

const {
  isValidObjectId,
} = require(
  "../utils/validate-object-id"
);

const createSalaryPayment =
  async (paymentData) => {
    const {
      employee,
      month,
      year,
    } = paymentData;

    if (!isValidObjectId(employee)) {
      throw new AppError(
        "Invalid employee ID",
        400
      );
    }

    const employeeExists =
      await Employee.exists({
        _id: employee,
      });

    if (!employeeExists) {
      throw new AppError(
        "Employee not found",
        404
      );
    }

    const duplicate =
      await salaryPaymentRepository
        .findPaymentByEmployeeMonthYear(
          employee,
          month,
          year
        );

    if (duplicate) {
      throw new AppError(
        "Salary payment already exists for this employee and month",
        409
      );
    }

    return await salaryPaymentRepository
      .createSalaryPayment(paymentData);
  };

const getSalaryPayments =
  async ({
    page = 1,
    limit = 10,
    employee,
    status,
    month,
    year,
  }) => {
    const filter = {};

    if (employee) {
      if (!isValidObjectId(employee)) {
        throw new AppError(
          "Invalid employee ID",
          400
        );
      }

      filter.employee = employee;
    }

    if (status) {
      filter.status = status;
    }

    if (month) {
      filter.month = month;
    }

    if (year) {
      filter.year = Number(year);
    }

    const skip =
      (page - 1) * limit;

    const {
      payments,
      total,
    } =
      await salaryPaymentRepository
        .getSalaryPayments({
          filter,
          skip,
          limit,
        });

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    };
  };

const getSalaryPaymentById =
  async (paymentId) => {
    if (!isValidObjectId(paymentId)) {
      throw new AppError(
        "Invalid salary payment ID",
        400
      );
    }

    const payment =
      await salaryPaymentRepository
        .getSalaryPaymentById(
          paymentId
        );

    if (!payment) {
      throw new AppError(
        "Salary payment not found",
        404
      );
    }

    return payment;
  };

const getEmployeeSalaryPayments =
  async (
    employeeId,
    { page = 1, limit = 10 }
  ) => {
    if (!isValidObjectId(employeeId)) {
      throw new AppError(
        "Invalid employee ID",
        400
      );
    }

    const employee =
      await Employee.findById(
        employeeId
      );

    if (!employee) {
      throw new AppError(
        "Employee not found",
        404
      );
    }

    const skip =
      (page - 1) * limit;

    const {
      payments,
      total,
    } =
      await salaryPaymentRepository
        .getEmployeeSalaryPayments(
          employeeId,
          {
            skip,
            limit,
          }
        );

    return {
      employee,
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    };
  };

const updateSalaryPayment =
  async (
    paymentId,
    paymentData
  ) => {
    if (!isValidObjectId(paymentId)) {
      throw new AppError(
        "Invalid salary payment ID",
        400
      );
    }

    const existing =
      await salaryPaymentRepository
        .getSalaryPaymentById(
          paymentId
        );

    if (!existing) {
      throw new AppError(
        "Salary payment not found",
        404
      );
    }

    const employee =
      paymentData.employee ||
      existing.employee._id;

    const month =
      paymentData.month ||
      existing.month;

    const year =
      paymentData.year ||
      existing.year;

    if (
      paymentData.employee &&
      !isValidObjectId(
        paymentData.employee
      )
    ) {
      throw new AppError(
        "Invalid employee ID",
        400
      );
    }

    const employeeExists =
      await Employee.exists({
        _id: employee,
      });

    if (!employeeExists) {
      throw new AppError(
        "Employee not found",
        404
      );
    }

    const duplicate =
      await salaryPaymentRepository
        .findPaymentByEmployeeMonthYear(
          employee,
          month,
          year,
          paymentId
        );

    if (duplicate) {
      throw new AppError(
        "Salary payment already exists for this employee and month",
        409
      );
    }

    return await salaryPaymentRepository
      .updateSalaryPayment(
        paymentId,
        paymentData
      );
  };

const updateSalaryPaymentStatus =
  async (
    paymentId,
    status
  ) => {
    if (!isValidObjectId(paymentId)) {
      throw new AppError(
        "Invalid salary payment ID",
        400
      );
    }

    const payment =
      await salaryPaymentRepository
        .updateSalaryPaymentStatus(
          paymentId,
          status
        );

    if (!payment) {
      throw new AppError(
        "Salary payment not found",
        404
      );
    }

    return payment;
  };

const deleteSalaryPayment =
  async (paymentId) => {
    if (!isValidObjectId(paymentId)) {
      throw new AppError(
        "Invalid salary payment ID",
        400
      );
    }

    const payment =
      await salaryPaymentRepository
        .deleteSalaryPayment(
          paymentId
        );

    if (!payment) {
      throw new AppError(
        "Salary payment not found",
        404
      );
    }

    return payment;
  };

module.exports = {
  createSalaryPayment,
  getSalaryPayments,
  getSalaryPaymentById,
  getEmployeeSalaryPayments,
  updateSalaryPayment,
  updateSalaryPaymentStatus,
  deleteSalaryPayment,
};