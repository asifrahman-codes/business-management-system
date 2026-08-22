const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message('"product" must be a valid product id');

const saleItemSchema = Joi.object({
  product: objectId.required(),
  quantity: Joi.number().integer().min(1).required(),
});

const createSaleSchema = Joi.object({
  items: Joi.array().items(saleItemSchema).min(1).max(100).required(),
  discount: Joi.number().min(0).default(0),
  tax: Joi.number().min(0).default(0),
  paymentMethod: Joi.string().valid("cash", "card", "bank_transfer").required(),
  customerName: Joi.string().trim().max(100).allow("", null),
});

module.exports = { createSaleSchema };