const mongoose = require("mongoose");

const productRepository =
  require("../repositories/product.repository");

const {
  validateCheckoutItems,
} = require("./sale-validation.service");

const {
  calculateSaleTotals,
} = require("./sale-calculation.service");

const {
  generateInvoiceNumber,
} = require("./invoice.service");

const saleRepository =
  require("../repositories/sale.repository");

const inventoryTransactionRepository =
  require(
    "../repositories/inventory-transaction.repository"
  );

const createSale = async ({
  items,
  discount = 0,
  tax = 0,
  paymentMethod,
  customerName = null,
  cashier,
}) => {
  const validatedItems =
    await validateCheckoutItems({
      items,
      productRepository,
    });

  const calculatedSale =
    calculateSaleTotals({
      items: validatedItems,
      discount,
      tax,
    });

  const invoiceNumber =
    generateInvoiceNumber();

  const saleData = {
    invoiceNumber,
    ...calculatedSale,
    paymentMethod,
    customerName,
    cashier,
  };

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    await deductSaleStock({
      items: validatedItems,
      session,
    });

    const sale =
      await saleRepository.create(
        saleData,
        session
      );

    for (const movement of stockMovements) {
  await inventoryTransactionRepository.create(
    {
      product: movement.product._id,

      type: "SALE",

      quantity: movement.quantity,

      previousStock:
        movement.previousStock,

      newStock:
        movement.newStock,

      referenceType: "SALE",

      referenceId: sale._id,

      performedBy: cashier,

      note: "Stock deducted for sale",
    },
    session
  );
}

    await session.commitTransaction();

    return sale;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const deductSaleStock = async ({
  items,
  session,
}) => {
  const movements = [];

  for (const item of items) {
    const updatedProduct =
      await productRepository.deductStock(
        item.product._id,
        item.quantity,
        session
      );

    if (!updatedProduct) {
      throw new AppError(
        `Insufficient stock for ${item.product.name}`,
        400
      );
    }

    const newStock =
      updatedProduct.quantityInStock;

    const previousStock =
      newStock + item.quantity;

    movements.push({
      product: updatedProduct,
      quantity: item.quantity,
      previousStock,
      newStock,
    });
  }

  return movements;
};

const buildSaleFilters = (query) => {
  const filters = {};

  if (query.cashier) {
    filters.cashier = query.cashier;
  }

  if (query.paymentMethod) {
    filters.paymentMethod =
      query.paymentMethod;
  }

  if (query.invoiceNumber) {
    filters.invoiceNumber = {
      $regex: query.invoiceNumber,
      $options: "i",
    };
  }

  if (
    query.startDate ||
    query.endDate
  ) {
    filters.createdAt = {};

    if (query.startDate) {
      filters.createdAt.$gte =
        new Date(query.startDate);
    }

    if (query.endDate) {
      const endDate =
        new Date(query.endDate);

      endDate.setDate(
        endDate.getDate() + 1
      );

      filters.createdAt.$lt = endDate;
    }
  }

  return filters;
};

const getSales = async (query) => {
  const {
    page,
    limit,
    skip,
  } = getQueryOptions(query);

  const filters =
    buildSaleFilters(query);

  const {
    sales,
    total,
  } = await saleRepository.findMany({
    filters,
    skip,
    limit,
  });

  return {
    sales,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

const getSaleById = async (saleId) => {
  const sale =
    await saleRepository.findById(
      saleId
    );

  if (!sale) {
    throw new AppError(
      "Sale not found",
      404
    );
  }

  return sale;
};

module.exports = {
  createSale,
  deductSaleStock,
  buildSaleFilters,
  getSales,
  getSaleById
};