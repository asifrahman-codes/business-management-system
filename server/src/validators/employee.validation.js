const Joi = require("joi");

const createEmployeeSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  position: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  phone: Joi.string()
    .trim()
    .min(7)
    .max(30)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .allow("", null),

  joiningDate: Joi.date()
    .required(),

  baseSalary: Joi.number()
    .positive()
    .required(),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .default("ACTIVE"),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100),

  position: Joi.string()
    .trim()
    .min(2)
    .max(100),

  phone: Joi.string()
    .trim()
    .min(7)
    .max(30),

  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .allow("", null),

  joiningDate: Joi.date(),

  baseSalary: Joi.number()
    .positive(),
}).min(1);

const updateEmployeeStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid("ACTIVE", "INACTIVE")
      .required(),
  });

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeStatusSchema,
};