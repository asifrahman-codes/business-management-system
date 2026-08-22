const errorMiddleware = (
  error,
  req,
  res,
  next
) => {

  console.error("ERROR:", error);
console.error("STACK:", error.stack);

  const statusCode =
    error.statusCode || 500;

  const message =
    error.statusCode
      ? error.message
      : "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;