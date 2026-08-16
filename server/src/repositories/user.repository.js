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

const findUsers = async ({
  skip,
  limit,
  search,
  sortBy,
  sortOrder,
}) => {
  const filter = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [users, total] =
    await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({
          [sortBy]: sortOrder,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

  return {
    data: users,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
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
  findUsers
};