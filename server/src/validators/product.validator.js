const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required(),

  sku: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  costPrice: Joi.number()
    .min(0)
    .required(),

  sellingPrice: Joi.number()
    .min(0)
    .required(),

  quantityInStock: Joi.number()
    .integer()
    .min(0)
    .default(0),

  reorderLevel: Joi.number()
    .integer()
    .min(0)
    .default(0),

  unit: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .required(),

  expiryDate: Joi.date()
    .allow(null)
    .default(null),

  category: Joi.string()
    .required(),

  supplier: Joi.string()
    .required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150),

  sku: Joi.string()
    .trim()
    .min(2)
    .max(50),

  costPrice: Joi.number()
    .min(0),

  sellingPrice: Joi.number()
    .min(0),

  quantityInStock: Joi.number()
    .integer()
    .min(0),

  reorderLevel: Joi.number()
    .integer()
    .min(0),

  unit: Joi.string()
    .trim()
    .min(1)
    .max(30),

  expiryDate: Joi.date()
    .allow(null),

  category: Joi.string(),

  supplier: Joi.string(),
}).min(1);

module.exports = {
  createProductSchema,
  updateProductSchema,
};