const Joi = require("joi");

const months = [
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
];

const createSalaryPaymentSchema =
  Joi.object({
    employee: Joi.string()
      .required(),

    amount: Joi.number()
      .positive()
      .required(),

    month: Joi.string()
      .valid(...months)
      .required(),

    year: Joi.number()
      .integer()
      .min(2000)
      .required(),

    paidDate: Joi.date()
      .allow(null),

    status: Joi.string()
      .valid(
        "PENDING",
        "PAID",
        "CANCELLED"
      )
      .default("PENDING"),

    notes: Joi.string()
      .trim()
      .max(500)
      .allow("", null),
  });

const updateSalaryPaymentSchema =
  Joi.object({
    amount: Joi.number()
      .positive(),

    month: Joi.string()
      .valid(...months),

    year: Joi.number()
      .integer()
      .min(2000),

    paidDate: Joi.date()
      .allow(null),

    status: Joi.string()
      .valid(
        "PENDING",
        "PAID",
        "CANCELLED"
      ),

    notes: Joi.string()
      .trim()
      .max(500)
      .allow("", null),
  }).min(1);

const updateSalaryStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid(
        "PENDING",
        "PAID",
        "CANCELLED"
      )
      .required(),
  });

module.exports = {
  createSalaryPaymentSchema,
  updateSalaryPaymentSchema,
  updateSalaryStatusSchema,
};
