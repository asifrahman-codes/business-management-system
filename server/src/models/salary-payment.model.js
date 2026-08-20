const mongoose = require("mongoose");

const salaryPaymentSchema =
  new mongoose.Schema(
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 0.01,
      },

      month: {
        type: String,
        required: true,
        enum: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },

      year: {
        type: Number,
        required: true,
        min: 2000,
      },

      paidDate: {
        type: Date,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "PAID",
          "CANCELLED",
        ],
        default: "PENDING",
        required: true,
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
    {
      timestamps: true,
    }
  );

salaryPaymentSchema.index(
  {
    employee: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

const SalaryPayment =
  mongoose.model(
    "SalaryPayment",
    salaryPaymentSchema
  );

module.exports = SalaryPayment;