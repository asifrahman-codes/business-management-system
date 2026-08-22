const Sale = require("../models/sale.model");

const create = async (
  saleData,
  session = null
) => {
  const [sale] = await Sale.create(
    [saleData],
    {
      session,
    }
  );

  return sale;
};

const findMany = async ({
  filters = {},
  skip = 0,
  limit = 20,
}) => {
  const [sales, total] =
    await Promise.all([
      Sale.find(filters)
        .populate(
          "cashier",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Sale.countDocuments(filters),
    ]);

  return {
    sales,
    total,
  };
};

const findById = async (id) => {
  return Sale.findOne({ _id: id })
    .populate("cashier", "name email role")
    .lean();
};

module.exports = {
  create,
  findMany,
  findById,
};