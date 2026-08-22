const mongoose = require("mongoose");

const AppError =
  require("../utils/app-error.util");

const roundMoney = (value) =>
  Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;

const validateAmount = (
  value,
  fieldName
) => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error(
      `${fieldName} must be a non-negative number`
    );
  }
};

const calculateSaleTotals = ({
  items,
  discount = 0,
  tax = 0,
}) => {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new Error(
      "Sale must contain at least one item"
    );
  }

  validateAmount(
    discount,
    "Discount"
  );

  validateAmount(
    tax,
    "Tax"
  );

  items.forEach(({ quantity }) => {
    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        "Quantity must be a positive integer"
      );
    }
  });

  const saleItems = items.map(
  ({ product, quantity }) => {
    const unitPrice =
      product.sellingPrice;

    const costPrice =
      product.costPrice;

    const subtotal = roundMoney(
      unitPrice * quantity
    );

    return {
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity,
      unitPrice,
      costPrice,
      subtotal,
    };
  }
);

  const totalAmount = roundMoney(
    saleItems.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    )
  );

  if (discount > totalAmount) {
    throw new Error(
      "Discount cannot exceed total amount"
    );
  }

  const grandTotal = roundMoney(
    totalAmount - discount + tax
  );

  return {
    items: saleItems,
    totalAmount,
    discount,
    tax,
    grandTotal,
  };
};

module.exports = {
  calculateSaleTotals,
};