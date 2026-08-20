const salaryPaymentService =
  require(
    "../services/salary-payment.service"
  );

const asyncHandler = require(
  "../utils/async-handler.util"
);

const createSalaryPayment =
  asyncHandler(async (req, res) => {
    const payment =
      await salaryPaymentService
        .createSalaryPayment(
          req.body
        );

    return res.status(201).json({
      success: true,
      message:
        "Salary payment created successfully",
      data: payment,
    });
  });

const getSalaryPayments =
  asyncHandler(async (req, res) => {
    let {
      page = 1,
      limit = 10,
      employee,
      status,
      month,
      year,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      page = 1;
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      limit = 10;
    }

    const result =
      await salaryPaymentService
        .getSalaryPayments({
          page,
          limit,
          employee,
          status,
          month,
          year,
        });

    return res.status(200).json({
      success: true,
      data: result.payments,
      pagination:
        result.pagination,
    });
  });

const getSalaryPaymentById =
  asyncHandler(async (req, res) => {
    const payment =
      await salaryPaymentService
        .getSalaryPaymentById(
          req.params.id
        );

    return res.status(200).json({
      success: true,
      data: payment,
    });
  });

const getEmployeeSalaryPayments =
  asyncHandler(async (req, res) => {
    let {
      page = 1,
      limit = 10,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      page = 1;
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      limit = 10;
    }

    const result =
      await salaryPaymentService
        .getEmployeeSalaryPayments(
          req.params.employeeId,
          {
            page,
            limit,
          }
        );

    return res.status(200).json({
      success: true,
      employee: result.employee,
      data: result.payments,
      pagination:
        result.pagination,
    });
  });

const updateSalaryPayment =
  asyncHandler(async (req, res) => {
    const payment =
      await salaryPaymentService
        .updateSalaryPayment(
          req.params.id,
          req.body
        );

    return res.status(200).json({
      success: true,
      message:
        "Salary payment updated successfully",
      data: payment,
    });
  });

const updateSalaryPaymentStatus =
  asyncHandler(async (req, res) => {
    const payment =
      await salaryPaymentService
        .updateSalaryPaymentStatus(
          req.params.id,
          req.body.status
        );

    return res.status(200).json({
      success: true,
      message:
        "Salary payment status updated successfully",
      data: payment,
    });
  });

const deleteSalaryPayment =
  asyncHandler(async (req, res) => {
    await salaryPaymentService
      .deleteSalaryPayment(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Salary payment deleted successfully",
    });
  });

module.exports = {
  createSalaryPayment,
  getSalaryPayments,
  getSalaryPaymentById,
  getEmployeeSalaryPayments,
  updateSalaryPayment,
  updateSalaryPaymentStatus,
  deleteSalaryPayment,
};