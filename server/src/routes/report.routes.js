const express = require("express");

const reportController =
  require(
    "../controllers/report.controller"
  );

const {
  authenticate,
} = require(
  "../middleware/auth.middleware"
);

const authorize = require(
  "../middleware/role.middleware"
);

const router = express.Router();

router.get(
  "/sales",
  authenticate,
  authorize("admin"),
  reportController.getSalesReport
);

router.get(
  "/expenses",
  authenticate,
  authorize("admin"),
  reportController.getExpenseReport
);

router.get(
  "/profit",
  authenticate,
  authorize("admin"),
  reportController.getProfitReport
);

router.get(
  "/monthly",
  authenticate,
  authorize("admin"),
  reportController.getMonthlyReport
);

router.get(
  "/inventory",
  authenticate,
  authorize("admin"),
  reportController.getInventoryReport
);

module.exports = router;