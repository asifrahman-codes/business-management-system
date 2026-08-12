const AppError = require("../utils/app-error.util");

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    const response = {
      success: false,
      message: err.message,
    };

    if (err.errors) {
      response.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = errorMiddleware;