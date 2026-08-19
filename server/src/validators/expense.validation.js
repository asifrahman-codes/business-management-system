const Joi = require("joi");

const expenseCategories = [
  "RENT",
  "UTILITIES",
  "SALARY",
  "SUPPLIES",
  "MAINTENANCE",
  "TRANSPORT",
  "MARKETING",
  "EQUIPMENT",
  "OTHER",
];

const createExpenseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(150)
    .required(),

  category: Joi.string()
    .valid(...expenseCategories)
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

const updateExpenseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(150)
    .optional(),

  category: Joi.string()
    .valid(...expenseCategories)
    .optional(),

  amount: Joi.number()
    .positive()
    .optional(),

  date: Joi.date()
    .optional(),

  description: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .optional(),
}).min(1);

module.exports = {
  createExpenseSchema,
  updateExpenseSchema,
  expenseCategories,
};