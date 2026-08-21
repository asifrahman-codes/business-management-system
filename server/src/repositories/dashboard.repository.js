const Sale = require(
  "../models/sale.model"
);

const Expense = require(
  "../models/expense.model"
);

const SalaryPayment = require(
  "../models/salary-payment.model"
);

const Product = require(
  "../models/product.model"
);

const getSalesSummary = async ({
  startDate,
  endDate,
}) => {
  const result = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,

        totalSales: {
          $sum: "$grandTotal",
        },

        totalCost: {
          $sum: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: {
                  $multiply: [
                    "$$item.costPrice",
                    "$$item.quantity",
                  ],
                },
              },
            },
          },
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalSales: 0,
      totalCost: 0,
    }
  );
};

const getExpenseSummary = async ({
  startDate,
  endDate,
}) => {
  const result = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,

        totalExpenses: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalExpenses: 0,
    }
  );
};

const getSalarySummary = async ({
  startDate,
  endDate,
}) => {
  const result =
    await SalaryPayment.aggregate([
      {
        $match: {
          status: "PAID",
          paidDate: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,

          totalSalaries: {
            $sum: "$amount",
          },
        },
      },
    ]);

  return (
    result[0] || {
      totalSalaries: 0,
    }
  );
};

const getLowStockCount = async () => {
  return await Product.countDocuments({
    $expr: {
      $lte: [
        "$quantityInStock",
        "$reorderLevel",
      ],
    },
  });
};

const getExpiringProductsCount = async ({
  startDate,
  endDate,
}) => {
  return await Product.countDocuments({
    expiryDate: {
      $gte: startDate,
      $lte: endDate,
    },
  });
};

module.exports = {
  getSalesSummary,
  getExpenseSummary,
  getSalarySummary,
  getLowStockCount,
  getExpiringProductsCount,
};