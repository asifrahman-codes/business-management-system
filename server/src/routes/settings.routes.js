const express = require("express");

const settingsController = require("../controllers/settings.controller");

const { authenticate } = require("../middleware/auth.middleware");

const authorize = require("../middleware/role.middleware");

const validate = require("../middleware/validate.middleware");

const { updateSettingsSchema } = require("../validators/settings.validator");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  settingsController.getSettings
);

router.patch(
  "/",
  authenticate,
  authorize("admin"),
  validate(updateSettingsSchema),
  settingsController.updateSettings
);

module.exports = router;