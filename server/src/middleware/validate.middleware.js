const AppError = require("../utils/app-error.util");

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        errors[field] = detail.message;
      });

      return next(
        new AppError("Validation failed", 400, errors)
      );
    }

    req.body = value;

    next();
  };
};

module.exports = validate;