const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      trim: true,
      default: "My Shop",
      maxlength: 150,
    },

    shopAddress: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },

    shopPhone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },

    shopEmail: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    currency: {
      type: String,
      trim: true,
      default: "USD",
      maxlength: 10,
    },

    currencySymbol: {
      type: String,
      trim: true,
      default: "$",
      maxlength: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;