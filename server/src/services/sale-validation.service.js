const mongoose = require("mongoose");

const AppError =
  require("../utils/app-error.util");

const validateCheckoutItems = async ({
  items,
  productRepository,
}) => {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new AppError(
      "Sale must contain at least one item",
      400
    );
  }

  if (items.length > 100) {
    throw new AppError(
      "A sale cannot contain more than 100 items",
      400
    );
  }

  const productIds = items.map(
    (item) => item.product
  );

  for (const item of items) {
    if (!item.product) {
      throw new AppError(
        "Product is required",
        400
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        item.product
      )
    ) {
      throw new AppError(
        "Invalid product ID",
        400
      );
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new AppError(
        "Quantity must be a positive integer",
        400
      );
    }
  }

  const normalizedIds =
    productIds.map((id) =>
      id.toString()
    );

  if (
    new Set(normalizedIds).size !==
    normalizedIds.length
  ) {
    throw new AppError(
      "Duplicate products are not allowed in a sale",
      400
    );
  }

  const products =
    await productRepository.findByIds(
      productIds
    );

  const productMap = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );

  return items.map((item) => {
    const product =
      productMap.get(
        item.product.toString()
      );

    if (!product) {
      throw new AppError(
        `Product ${item.product} not found`,
        404
      );
    }

    if (
      product.quantityInStock <
      item.quantity
    ) {
      throw new AppError(
        `Insufficient stock for ${product.name}`,
        400
      );
    }

    return {
      product,
      quantity: item.quantity,
    };
  });
};

module.exports = {
  validateCheckoutItems,
};