const InventoryTransaction =
  require(
    "../models/inventory-transaction.model"
  );

const create = async (
  transactionData,
  session = null
) => {
  const [transaction] =
    await InventoryTransaction.create(
      [transactionData],
      {
        session,
      }
    );

  return transaction;
};

const findMany = async ({
  filters = {},
  skip = 0,
  limit = 20,
}) => {
  const [
    transactions,
    total,
  ] = await Promise.all([
    InventoryTransaction.find(
      filters
    )
      .populate(
        "product",
        "name sku unit"
      )
      .populate(
        "performedBy",
        "name email role"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    InventoryTransaction.countDocuments(
      filters
    ),
  ]);

  return {
    transactions,
    total,
  };
};

const findByProduct = async ({
  productId,
  skip = 0,
  limit = 20,
}) => {
  const filters = {
    product: productId,
  };

  const [
    transactions,
    total,
  ] = await Promise.all([
    InventoryTransaction.find(
      filters
    )
      .populate(
        "product",
        "name sku unit"
      )
      .populate(
        "performedBy",
        "name email role"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    InventoryTransaction.countDocuments(
      filters
    ),
  ]);

  return {
    transactions,
    total,
  };
};

module.exports = {
  create,
  findMany,
  findByProduct,
};