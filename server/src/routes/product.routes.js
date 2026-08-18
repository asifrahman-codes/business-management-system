const express = require("express");

const productController =
  require("../controllers/product.controller");

const {authenticate} =
  require("../middleware/auth.middleware");

const authorize =
  require("../middleware/role.middleware");

const validate =
  require("../middleware/validate.middleware");

const validateObjectId =
  require("../middleware/object-id.middleware");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin"),
  productController.getProducts
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  productController.getProductById
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  productController.createProduct
);

router.get(
  "/inventory-summary",
  authenticate,
  authorize("admin"),
  productController.getInventorySummary
);

router.get(
  "/pos-search",
  authenticate,
  authorize("admin", "cashier"),
  productController.searchProductsForPos
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  productController.getProductById
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  productController.deleteProduct
);

module.exports = router;