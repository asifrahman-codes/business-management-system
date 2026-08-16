const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    contactPerson: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 150,
    },

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model(
  "Supplier",
  supplierSchema
);

module.exports = Supplier;