const userService = require("../services/user.service");
const asyncHandler = require("../utils/async-handler.util");

const createUser = asyncHandler(
  async (req, res) => {
    const user =
      await userService.createUser(req.body);

    return res.status(201).json({
      success: true,
      data: user,
    });
  }
);

const getUsers = asyncHandler(
  async (req, res) => {
    const result =
      await userService.getUsers(
        req.query
      );

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  }
);

const getUserById = asyncHandler(
  async (req, res) => {
    const user =
      await userService.getUserById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
);

const updateUser = asyncHandler(
  async (req, res) => {
    const user =
      await userService.updateUser(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
);

const updateUserStatus = asyncHandler(
  async (req, res) => {
    const user =
      await userService.updateUserStatus(
        req.params.id,
        req.body.isActive
      );

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
);

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
};