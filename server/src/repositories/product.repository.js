const Product = require("../models/product.model");

const create = async (data) => {
  return Product.create(data);
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
        sku: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [products, total] =
    await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .populate("supplier", "name")
        .sort({
          [sortBy]: sortOrder,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

  return {
    data: products,
    total,
  };
};

const findById = async (id) => {
  return Product.findById(id)
    .populate("category", "name")
    .populate("supplier", "name")
    .lean();
};

const findBySku = async (sku) => {
  return Product.findOne({
    sku: sku.toUpperCase(),
  }).lean();
};

const findByCategory = async (categoryId) => {
  return Product.exists({
    category: categoryId,
  });
};

const findBySupplier = async (supplierId) => {
  return Product.exists({
    supplier: supplierId,
  });
};

const updateById = async (id, data) => {
  return Product.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("category", "name")
    .populate("supplier", "name")
    .lean();
};

const deleteById = async (id) => {
  return Product.findByIdAndDelete(id);
};

module.exports = {
  create,
  findAll,
  findById,
  findBySku,
  findByCategory,
  findBySupplier,
  updateById,
  deleteById,
};