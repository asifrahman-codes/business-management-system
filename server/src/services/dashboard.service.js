const Sale = require("../models/sale.model");
const Expense = require("../models/expense.model");
const Product = require("../models/product.model");

const getDashboardSummary = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 1. Today's Sales
  const todaySales = await Sale.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: "$grandTotal" } } }
  ]);

  // 2. Monthly Sales
  const monthlySales = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$grandTotal" } } }
  ]);

  // 3. Monthly Expenses
  const monthlyExpenses = await Expense.aggregate([
    { $match: { date: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  // 4. Stock Alerts
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  const [lowStockCount, expiryCount] = await Promise.all([
    Product.countDocuments({ $expr: { $lte: ["$quantityInStock", "$reorderLevel"] } }),
    Product.countDocuments({ expiryDate: { $lte: futureDate } })
  ]);

  const salesTotal = monthlySales[0]?.total || 0;
  const expenseTotal = monthlyExpenses[0]?.total || 0;

  return {
    todaySales: todaySales[0]?.total || 0,
    monthlySales: salesTotal,
    monthlyExpenses: expenseTotal,
    netProfit: salesTotal - expenseTotal,
    lowStockCount,
    expiryCount
  };
};

module.exports = { getDashboardSummary };