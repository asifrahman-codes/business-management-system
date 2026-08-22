const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const AppError = require("../utils/app-error.util");
const env = require("../config/env.config");
const userRepository = require("../repositories/user.repository");

const authenticate = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const parts =
      authorization.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      throw new AppError(
        "Invalid authentication format",
        401
      );
    }

    const token = parts[1];

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError"
      ) {
        throw new AppError(
          "Invalid or expired token",
          401
        );
      }

      throw error;
    }

    const user =
      await userRepository.findById(
        decoded.userId
      );

    if (!user) {
      throw new AppError(
        "User not found",
        401
      );
    }

    if (!user.isActive) {
      throw new AppError(
        "Account is inactive",
        401
      );
    }
    
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate
};