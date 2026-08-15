const User = require("../models/user.model");

const findById = async (userId) => {
  return User.findById(userId);
};

const findByEmail = async (email) => {
  return User.findOne({ email });
};

const findByEmailWithPassword = async (email) => {
  return User
    .findOne({ email })
    .select("+password");
};

const findAll = async () => {
  return User.find();
};

const create = async (userData) => {
  return User.create(userData);
};

const updateById = async (userId, updateData) => {
  return User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

const updateStatus = async (userId, isActive) => {
  return User.findByIdAndUpdate(
    userId,
    { isActive },
    {
      new: true,
      runValidators: true,
    }
  );
};

module.exports = {
  findById,
  findByEmail,
  findByEmailWithPassword,
  findAll,
  create,
  updateById,
  updateStatus,
};