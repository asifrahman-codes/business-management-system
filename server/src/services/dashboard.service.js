const Sale = require("../models/sale.model");
const Expense = require("../models/expense.model");
const Product = require("../models/product.model");

const getDashboardSummary = async () => {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const futureDate = new Date();
  futureDate.setDate(
    futureDate.getDate() + 30
  );

  const [
    todaySalesResult,
    monthlySalesResult,
    monthlyExpensesResult,
    lowStockCount,
    expiryCount,
  ] = await Promise.all([
    Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$grandTotal",
          },
        },
      },
    ]),

    Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$grandTotal",
          },
        },
      },
    ]),

    Expense.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]),

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
        $gte: now,
        $lte: futureDate,
      },
    }),
  ]);

  const todaySales =
    todaySalesResult[0]?.total || 0;

  const monthlySales =
    monthlySalesResult[0]?.total || 0;

  const monthlyExpenses =
    monthlyExpensesResult[0]?.total || 0;

  return {
    todaySales,
    monthlySales,
    monthlyExpenses,
    netProfit:
      monthlySales - monthlyExpenses,
    lowStockCount,
    expiryCount,
  };
};

module.exports = {
  getDashboardSummary,
};