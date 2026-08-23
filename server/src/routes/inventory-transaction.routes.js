const express =
  require("express");

const inventoryTransactionController =
  require(
    "../controllers/inventory-transaction.controller"
  );

const {
  authenticate,
} = require(
  "../middleware/auth.middleware"
);

const authorize =
  require(
    "../middleware/role.middleware"
  );

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin"),
  inventoryTransactionController
    .getInventoryTransactions
);

module.exports = router;