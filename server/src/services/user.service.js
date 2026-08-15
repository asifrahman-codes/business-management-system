const bcrypt = require("bcrypt");
const AppError = require("../utils/app-error.util");
const userRepository = require("../repositories/user.repository");

const createUser = async ({
  name,
  email,
  password,
  role,
}) => {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const existingUser =
    await userRepository.findByEmail(
      normalizedEmail
    );

  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      409
    );
  }

  const allowedRoles = [
    "admin",
    "cashier",
  ];

  if (!allowedRoles.includes(role)) {
    throw new AppError(
      "Invalid user role",
      400
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isActive: true,
  });

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

const getUsers = async () => {
  return userRepository.findAll();
};

const getUserById = async (userId) => {
  const user =
    await userRepository.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return user;
};

const updateUser = async (
  userId,
  updateData
) => {
  const updateFields = {};

  if (updateData.name !== undefined) {
    updateFields.name =
      updateData.name.trim();
  }

  if (updateData.email !== undefined) {
    const normalizedEmail =
      updateData.email
        .trim()
        .toLowerCase();

    const existingUser =
      await userRepository.findByEmail(
        normalizedEmail
      );

    if (
      existingUser &&
      existingUser._id.toString() !== userId
    ) {
      throw new AppError(
        "Email is already registered",
        409
      );
    }

    updateFields.email =
      normalizedEmail;
  }

  if (updateData.role !== undefined) {
    const allowedRoles = [
      "admin",
      "cashier",
    ];

    if (
      !allowedRoles.includes(
        updateData.role
      )
    ) {
      throw new AppError(
        "Invalid user role",
        400
      );
    }

    updateFields.role =
      updateData.role;
  }

  if (
    Object.keys(updateFields).length === 0
  ) {
    throw new AppError(
      "No valid fields provided for update",
      400
    );
  }

  const user =
    await userRepository.updateById(
      userId,
      updateFields
    );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return user;
};

const updateUserStatus = async (
  userId,
  isActive
) => {
  if (typeof isActive !== "boolean") {
    throw new AppError(
      "isActive must be a boolean",
      400
    );
  }

  const user =
    await userRepository.updateStatus(
      userId,
      isActive
    );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
};