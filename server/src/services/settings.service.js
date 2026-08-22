const settingsRepository = require("../repositories/settings.repository");

const getSettings = async () => {
  return settingsRepository.getSettings();
};

const updateSettings = async (data) => {
  return settingsRepository.updateSettings(data);
};

module.exports = {
  getSettings,
  updateSettings,
};