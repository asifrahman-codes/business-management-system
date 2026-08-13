const AppError = require("../utils/app-error.util");
const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "cashier",
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(
  "Invalid email or password",
  401
);
  }

  if (!user.isActive) {
    throw new AppError(
  "User account is inactive",
  401
);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};