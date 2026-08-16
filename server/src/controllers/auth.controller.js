const { registerUser, loginUser } = require("../services/auth.service");
const formatUserResponse = require("../utils/user-response.util");
const asyncHandler = require("../utils/async-handler.util");
const User = require("../models/User.model");

const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: formatUserResponse(user),
  });
});

const getCurrentUser = (req, res) => {
  res.status(200).json({
    success: true,
    user: formatUserResponse(req.user),
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
};