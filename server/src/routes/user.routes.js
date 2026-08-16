const express = require("express");

const userController = require("../controllers/user.controller");

const {authenticate} = require("../middleware/auth.middleware");
const authorize  = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/object-id.middleware");

const {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} = require("../validators/user.validator");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin"),
  userController.getUsers
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  userController.getUserById
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  validate(createUserSchema),
  userController.createUser
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  validate(updateUserSchema),
  userController.updateUser
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validateObjectId(),
  validate(updateUserStatusSchema),
  userController.updateUserStatus
);

module.exports = router;