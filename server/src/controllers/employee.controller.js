const employeeService = require(
  "../services/employee.service"
);

const asyncHandler = require(
  "../utils/async-handler.util"
);

const createEmployee =
  asyncHandler(async (req, res) => {
    const employee =
      await employeeService
        .createEmployee(req.body);

    return res.status(201).json({
      success: true,
      message:
        "Employee created successfully",
      data: employee,
    });
  });

const getEmployees =
  asyncHandler(async (req, res) => {
    let {
      page = 1,
      limit = 10,
      status,
      search,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const result =
      await employeeService
        .getEmployees({
          page,
          limit,
          status,
          search,
        });

    return res.status(200).json({
      success: true,
      data: result.employees,
      pagination:
        result.pagination,
    });
  });

const getEmployeeById =
  asyncHandler(async (req, res) => {
    const employee =
      await employeeService
        .getEmployeeById(
          req.params.id
        );

    return res.status(200).json({
      success: true,
      data: employee,
    });
  });

const updateEmployee =
  asyncHandler(async (req, res) => {
    const employee =
      await employeeService
        .updateEmployee(
          req.params.id,
          req.body
        );

    return res.status(200).json({
      success: true,
      message:
        "Employee updated successfully",
      data: employee,
    });
  });

const updateEmployeeStatus =
  asyncHandler(async (req, res) => {
    const employee =
      await employeeService
        .updateEmployeeStatus(
          req.params.id,
          req.body.status
        );

    return res.status(200).json({
      success: true,
      message:
        "Employee status updated successfully",
      data: employee,
    });
  });

const deleteEmployee =
  asyncHandler(async (req, res) => {
    await employeeService
      .deleteEmployee(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Employee deleted successfully",
    });
  });

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
};