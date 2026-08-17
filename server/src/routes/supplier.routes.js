const express = require("express");

const supplierController =
  require("../controllers/supplier.controller");

const {authenticate} =
  require("../middleware/auth.middleware");

const authorize =
  require("../middleware/role.middleware");

const validate =
  require("../middleware/validate.middleware");

const validateObjectId =
  require("../middleware/object-id.middleware");

const {
  createSupplierSchema,
  updateSupplierSchema,
} = require("../validators/supplier.validator");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin"),
  supplierController.getSuppliers
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  supplierController.getSupplierById
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createSupplierSchema),
  supplierController.createSupplier
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  validate(updateSupplierSchema),
  supplierController.updateSupplier
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  supplierController.deleteSupplier
);

module.exports = router;