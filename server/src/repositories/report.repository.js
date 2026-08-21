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

const getSalesReport = async ({
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

        totalDiscount: {
          $sum: "$discount",
        },

        totalTax: {
          $sum: "$tax",
        },

        numberOfSales: {
          $sum: 1,
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
      totalDiscount: 0,
      totalTax: 0,
      numberOfSales: 0,
      totalCost: 0,
    }
  );
};

const getExpenseReport = async ({
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

        numberOfExpenses: {
          $sum: 1,
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalExpenses: 0,
      numberOfExpenses: 0,
    }
  );
};

const getExpenseByCategory = async ({
  startDate,
  endDate,
}) => {
  return await Expense.aggregate([
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
        _id: "$category",

        totalAmount: {
          $sum: "$amount",
        },

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        totalAmount: -1,
      },
    },
  ]);
};

const getSalaryReport = async ({
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

          numberOfPayments: {
            $sum: 1,
          },
        },
      },
    ]);

  return (
    result[0] || {
      totalSalaries: 0,
      numberOfPayments: 0,
    }
  );
};

const getDailySales = async ({
  startDate,
  endDate,
}) => {
  return await Sale.aggregate([
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
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },

        sales: {
          $sum: "$grandTotal",
        },

        cost: {
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

        numberOfSales: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

const getDailyExpenses = async ({
  startDate,
  endDate,
}) => {
  return await Expense.aggregate([
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
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },

        expenses: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

const getLowStockProducts = async () => {
  return await Product.find({
    $expr: {
      $lte: [
        "$quantityInStock",
        "$reorderLevel",
      ],
    },
  })
    .populate(
      "category",
      "name"
    )
    .populate(
      "supplier",
      "name"
    )
    .sort({
      quantityInStock: 1,
    });
};

const getExpiringProducts = async ({
  startDate,
  endDate,
}) => {
  return await Product.find({
    expiryDate: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .populate(
      "category",
      "name"
    )
    .populate(
      "supplier",
      "name"
    )
    .sort({
      expiryDate: 1,
    });
};

const getMonthlySalaries = async ({
  startDate,
  endDate,
}) => {
  return await SalaryPayment.aggregate([
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
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$paidDate",
          },
        },

        salaries: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

module.exports = {
  getSalesReport,
  getExpenseReport,
  getExpenseByCategory,
  getSalaryReport,
  getDailySales,
  getDailyExpenses,
  getLowStockProducts,
  getExpiringProducts,
  getMonthlySalaries,
};