const express = require("express");

const saleController = require("../controllers/sale.controller");

const {authenticate} = require("../middleware/auth.middleware");
const authorize  = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/object-id.middleware");

const {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} = require("../validators/user.validator");

const {
  createSaleSchema,
} = require("../validators/sale.validation");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  saleController.getSales
);

router.post(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  validate(createSaleSchema),
  saleController.createSale
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  saleController.getSaleById
);

router.get(
  "/:id/receipt",
  authenticate,
  authorize("admin", "cashier"),
  validateObjectId(),
  saleController.getSaleReceipt
);

module.exports = router;