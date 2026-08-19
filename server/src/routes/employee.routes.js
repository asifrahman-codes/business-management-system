const express = require("express");

const employeeController = require(
  "../controllers/employee.controller"
);

const {
  authenticate,
} = require(
  "../middleware/auth.middleware"
);

const authorize = require(
  "../middleware/role.middleware"
);

const validate = require(
  "../middleware/validate.middleware"
);

const {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeStatusSchema,
} = require(
  "../validators/employee.validation"
);

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createEmployeeSchema),
  employeeController.createEmployee
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  employeeController.getEmployees
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  employeeController.getEmployeeById
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validate(updateEmployeeStatusSchema),
  employeeController.updateEmployeeStatus
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  employeeController.deleteEmployee
);

module.exports = router;