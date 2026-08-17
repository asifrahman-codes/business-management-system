const Joi = require("joi");

const createSupplierSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  contactPerson: Joi.string().trim().max(100).allow("").default(""),
  phone: Joi.string().trim().max(20).allow("").default(""),
  email: Joi.string().trim().email().allow("").default(""),
  address: Joi.string().trim().max(500).allow("").default(""),
});

const updateSupplierSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  contactPerson: Joi.string().trim().max(100).allow(""),
  phone: Joi.string().trim().max(20).allow(""),
  email: Joi.string().trim().email().allow(""),
  address: Joi.string().trim().max(500).allow(""),
}).min(1);

module.exports = {
  createSupplierSchema,
  updateSupplierSchema,
};