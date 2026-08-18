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

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  expenseController.createExpense
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  expenseController.getExpenses
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  expenseController.getExpenseById
);

module.exports = router;