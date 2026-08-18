const Joi = require("joi");

const createExpenseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(150)
    .required(),

  category: Joi.string()
    .valid(
      "RENT",
      "UTILITIES",
      "SALARY",
      "SUPPLIES",
      "MAINTENANCE",
      "TRANSPORT",
      "MARKETING",
      "EQUIPMENT",
      "OTHER"
    )
    .required(),

  amount: Joi.number()
    .positive()
    .required(),

  date: Joi.date()
    .required(),

  description: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .optional(),
});

module.exports = {
  createExpenseSchema,
};