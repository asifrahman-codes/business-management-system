const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .required(),

  role: Joi.string()
    .valid("admin", "cashier")
    .required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100),

  email: Joi.string()
    .trim()
    .lowercase()
    .email(),

  role: Joi.string()
    .valid("admin", "cashier"),
}).min(1);

const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean()
    .required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
};