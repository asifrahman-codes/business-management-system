const settingsService = require("../services/settings.service");
const asyncHandler = require("../utils/async-handler.util");

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();

  return res.status(200).json({
    success: true,
    data: settings,
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);

  return res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: settings,
  });
});

module.exports = {
  getSettings,
  updateSettings,
};