const Settings = require("../models/settings.model");

const getSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
};

const updateSettings = async (data) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(data);
    return settings;
  }

  Object.assign(settings, data);
  await settings.save();

  return settings;
};

module.exports = {
  getSettings,
  updateSettings,
};