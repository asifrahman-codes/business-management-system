const Supplier = require("../models/supplier.model");

const create = async (data) => {
  return Supplier.create(data);
};

const findAll = async ({
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
        contactPerson: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
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

  const [suppliers, total] =
    await Promise.all([
      Supplier.find(filter)
        .sort({
          [sortBy]: sortOrder,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Supplier.countDocuments(filter),
    ]);

  return {
    data: suppliers,
    total,
  };
};

const findById = async (id) => {
  return Supplier.findById(id).lean();
};

const updateById = async (id, data) => {
  return Supplier.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).lean();
};

const deleteById = async (id) => {
  return Supplier.findByIdAndDelete(id);
};

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
};