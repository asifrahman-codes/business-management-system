const mongoose = require("mongoose");
const AppError = require("../utils/app-error.util");

const validateObjectId = (
  paramName = "id"
) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return next(
        new AppError(
          `Invalid ${paramName}`,
          400
        )
      );
    }

    next();
  };
};

module.exports = validateObjectId;