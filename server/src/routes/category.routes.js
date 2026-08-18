const express = require("express");
const categoryController = require("../controllers/category.controller");
const {authenticate} = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/object-id.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin"),
  categoryController.getCategories
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  categoryController.getCategoryById
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  categoryController.deleteCategory
);

module.exports = router;