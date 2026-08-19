const express = require("express");

const expenseController = require(
  "../controllers/expense.controller"
);

const {
  authenticate,
} = require("../middleware/auth.middleware");

const authorize = require(
  "../middleware/role.middleware"
);

const validate = require("../middleware/validate.middleware");

const {
  createExpenseSchema,
  updateExpenseSchema,
} = require(
  "../validators/expense.validation"
);

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createExpenseSchema),
  expenseController.createExpense
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  expenseController.getExpenses
);

router.get(
  "/reports/summary",
  authenticate,
  authorize("admin"),
  expenseController.getExpenseSummary
);

router.get(
  "/reports/by-category",
  authenticate,
  authorize("admin"),
  expenseController.getExpensesByCategory
);

router.get(
  "/reports/by-date",
  authenticate,
  authorize("admin"),
  expenseController.getExpensesByDate
);

router.get(
  "/reports/monthly",
  authenticate,
  authorize("admin"),
  expenseController
    .getMonthlyExpenses
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateExpenseSchema),
  expenseController.updateExpense
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  expenseController.deleteExpense
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  expenseController.getExpenseById
);

module.exports = router;