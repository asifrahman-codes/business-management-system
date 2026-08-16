const Category = require("../models/category.model");

const create = async (data) => {
  return Category.create(data);
};

const findAll = async () => {
  return Category.find()
    .sort({ name: 1 })
    .lean();
};

const findById = async (id) => {
  return Category.findById(id)
    .lean();
};

const findByName = async (name) => {
  return Category.findOne({
    name,
  }).lean();
};

const updateById = async (id, data) => {
  return Category.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).lean();
};

const deleteById = async (id) => {
  return Category.findByIdAndDelete(id);
};

module.exports = {
  create,
  findAll,
  findById,
  findByName,
  updateById,
  deleteById,
};