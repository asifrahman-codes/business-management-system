const Joi = require("joi");

const updateSettingsSchema = Joi.object({
  shopName: Joi.string().trim().max(150),
  shopAddress: Joi.string().trim().max(300).allow(""),
  shopPhone: Joi.string().trim().max(30).allow(""),
  shopEmail: Joi.string().trim().email().max(150).allow(""),
  taxRate: Joi.number().min(0).max(100),
  currency: Joi.string().trim().max(10),
  currencySymbol: Joi.string().trim().max(5),
}).min(1);

module.exports = {
  updateSettingsSchema,
};