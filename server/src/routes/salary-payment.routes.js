const express = require("express");

const salaryPaymentController =
  require(
    "../controllers/salary-payment.controller"
  );

const {
  authenticate,
} = require(
  "../middleware/auth.middleware"
);

const authorize = require(
  "../middleware/role.middleware"
);

const {
  createSalaryPaymentSchema,
  updateSalaryPaymentSchema,
  updateSalaryStatusSchema,
} = require(
  "../validators/salary-payment.validation"
);

const validate = require("../middleware/validate.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createSalaryPaymentSchema),
  salaryPaymentController
    .createSalaryPayment
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  salaryPaymentController
    .getSalaryPayments
);

router.get(
  "/employee/:employeeId",
  authenticate,
  authorize("admin"),
  salaryPaymentController
    .getEmployeeSalaryPayments
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  salaryPaymentController
    .getSalaryPaymentById
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateSalaryPaymentSchema),
  salaryPaymentController
    .updateSalaryPayment
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validate(updateSalaryStatusSchema),
  salaryPaymentController
    .updateSalaryPaymentStatus
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  salaryPaymentController
    .deleteSalaryPayment
);

module.exports = router;