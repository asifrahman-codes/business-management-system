const express = require("express");

const dashboardController =
  require(
    "../controllers/dashboard.controller"
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
  "/",
  authenticate,
  authorize("admin", "cashier"),
  dashboardController
    .getDashboardSummary
);

module.exports = router;