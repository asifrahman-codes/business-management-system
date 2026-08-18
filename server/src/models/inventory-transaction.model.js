const mongoose = require("mongoose");

const inventoryTransactionSchema =
  new mongoose.Schema(
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: [
          "SALE",
          "PURCHASE",
          "RETURN",
          "ADJUSTMENT",
        ],
        required: true,
        index: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      previousStock: {
        type: Number,
        required: true,
        min: 0,
      },

      newStock: {
        type: Number,
        required: true,
        min: 0,
      },

      referenceType: {
        type: String,
        enum: [
          "SALE",
          "PURCHASE",
          "RETURN",
          "ADJUSTMENT",
        ],
        required: true,
      },

      referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },

      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      note: {
        type: String,
        default: null,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "InventoryTransaction",
    inventoryTransactionSchema
  );