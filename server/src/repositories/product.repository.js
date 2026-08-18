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
  category,
  supplier,
  lowStock,
  expired,
  expiringWithin,
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

  if (category) {
    filter.category = category;
  }

  if (supplier) {
    filter.supplier = supplier;
  }

  if (lowStock === true) {
    filter.$expr = {
      $lte: [
        "$quantityInStock",
        "$reorderLevel",
      ],
    };
  }

  if (expired === true) {
    filter.expiryDate = {
      $lt: new Date(),
    };
  }

  if (
    expiringWithin !== undefined
  ) {
    const now = new Date();

    const futureDate = new Date();
    futureDate.setDate(
      futureDate.getDate() +
        expiringWithin
    );

    filter.expiryDate = {
      $gte: now,
      $lte: futureDate,
    };
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


const getInventorySummary = async () => {
  const now = new Date();

  const futureDate = new Date();
  futureDate.setDate(
    futureDate.getDate() + 30
  );

  const [
    totalProducts,
    lowStockProducts,
    expiredProducts,
    expiringSoonProducts,
  ] = await Promise.all([
    Product.countDocuments(),

    Product.countDocuments({
      $expr: {
        $lte: [
          "$quantityInStock",
          "$reorderLevel",
        ],
      },
    }),

    Product.countDocuments({
      expiryDate: {
        $lt: now,
      },
    }),

    Product.countDocuments({
      expiryDate: {
        $gte: now,
        $lte: futureDate,
      },
    }),
  ]);

  return {
    totalProducts,
    lowStockProducts,
    expiredProducts,
    expiringSoonProducts,
  };
};

const searchForPos = async (search) => {
  const filter = {
    quantityInStock: {
      $gt: 0,
    },
  };

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

  return Product.find(filter)
    .select(
      "_id name sku sellingPrice quantityInStock unit expiryDate"
    )
    .sort({
      name: 1,
    })
    .limit(20)
    .lean();
};

const findByIds = async (productIds) => {
  return Product.find({
    _id: {
      $in: productIds,
    },
  });
};

const deductStock = async (
  productId,
  quantity,
  session = null
) => {
  return Product.findOneAndUpdate(
    {
      _id: productId,
      quantityInStock: {
        $gte: quantity,
      },
    },
    {
      $inc: {
        quantityInStock: -quantity,
      },
    },
    {
      new: true,
      session,
    }
  );
};

module.exports = {
  create,
  findAll,
  findById,
  findBySku,
  findByCategory,
  findBySupplier,
  getInventorySummary,
  updateById,
  deleteById,
  searchForPos,
  findByIds,
  deductStock,
};