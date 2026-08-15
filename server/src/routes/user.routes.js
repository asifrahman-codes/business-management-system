const express = require("express");

const userController = require("../controllers/user.controller");

const {authenticate} = require("../middleware/auth.middleware");
const authorize  = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

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
  userController.getUserById
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createUserSchema),
  userController.createUser
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateUserSchema),
  userController.updateUser
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validate(updateUserStatusSchema),
  userController.updateUserStatus
);

module.exports = router;