const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/app-error.util");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      throw new AppError(
        "User not found",
        401
      );
    }

    if (!user.isActive) {
      throw new AppError(
        "User account is inactive",
        401
      );
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(
        "Invalid or expired token",
        401
      )
    );
  }
};

module.exports = {
  protect,
};