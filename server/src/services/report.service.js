const reportRepository =
  require(
    "../repositories/report.repository"
  );

const AppError = require(
  "../utils/app-error.util"
);

const getDateRange = (
  startDate,
  endDate
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new AppError(
      "Invalid date range",
      400
    );
  }

  if (start >= end) {
    throw new AppError(
      "Start date must be before end date",
      400
    );
  }

  start.setHours(
    0,
    0,
    0,
    0
  );

  end.setHours(
    23,
    59,
    59,
    999
  );

  return {
    startDate: start,
    endDate: end,
  };
};

const getSalesReport = async (
  startDate,
  endDate
) => {
  const range = getDateRange(
    startDate,
    endDate
  );

  return await reportRepository
    .getSalesReport(range);
};

const getExpenseReport = async (
  startDate,
  endDate
) => {
  const range = getDateRange(
    startDate,
    endDate
  );

  const [
    summary,
    byCategory,
  ] = await Promise.all([
    reportRepository
      .getExpenseReport(range),

    reportRepository
      .getExpenseByCategory(range),
  ]);

  return {
    ...summary,
    byCategory,
  };
};

const getProfitReport = async (
  startDate,
  endDate
) => {
  const range = getDateRange(
    startDate,
    endDate
  );

  const [
    sales,
    expenses,
    salaries,
  ] = await Promise.all([
    reportRepository
      .getSalesReport(range),

    reportRepository
      .getExpenseReport(range),

    reportRepository
      .getSalaryReport(range),
  ]);

  const grossProfit =
    sales.totalSales -
    sales.totalCost;

  const netProfit =
    grossProfit -
    expenses.totalExpenses -
    salaries.totalSalaries;

  return {
    revenue: sales.totalSales,

    costOfGoods:
      sales.totalCost,

    grossProfit,

    businessExpenses:
      expenses.totalExpenses,

    salaries:
      salaries.totalSalaries,

    netProfit,

    profitMargin:
      sales.totalSales > 0
        ? (
            (netProfit /
              sales.totalSales) *
            100
          ).toFixed(2)
        : 0,
  };
};

const getMonthlyReport = async (
  year
) => {
  const numericYear =
    Number(year);

  if (
    !Number.isInteger(
      numericYear
    ) ||
    numericYear < 2000
  ) {
    throw new AppError(
      "Invalid year",
      400
    );
  }

  const startDate = new Date(
    numericYear,
    0,
    1
  );

  const endDate = new Date(
    numericYear + 1,
    0,
    1
  );

  const [
    sales,
    expenses,
  ] = await Promise.all([
    reportRepository.getDailySales({
      startDate,
      endDate,
    }),

    reportRepository.getDailyExpenses({
      startDate,
      endDate,
    }),
  ]);

  const monthlyData = {};

  sales.forEach((item) => {
    const month =
      item._id.substring(0, 7);

    if (!monthlyData[month]) {
      monthlyData[month] = {
        sales: 0,
        cost: 0,
        expenses: 0,
        numberOfSales: 0,
      };
    }

    monthlyData[month].sales +=
      item.sales;

    monthlyData[month].cost +=
      item.cost;

    monthlyData[month].numberOfSales +=
      item.numberOfSales;
  });

  expenses.forEach((item) => {
    const month =
      item._id.substring(0, 7);

    if (!monthlyData[month]) {
      monthlyData[month] = {
        sales: 0,
        cost: 0,
        expenses: 0,
        numberOfSales: 0,
      };
    }

    monthlyData[month].expenses +=
      item.expenses;
  });

  return Object.entries(
    monthlyData
  )
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .map(
      ([
        month,
        data,
      ]) => ({
        month,

        sales: data.sales,

        costOfGoods:
          data.cost,

        grossProfit:
          data.sales -
          data.cost,

        expenses:
          data.expenses,

        netProfit:
          data.sales -
          data.cost -
          data.expenses,

        numberOfSales:
          data.numberOfSales,
      })
    );
};

const getInventoryReport =
  async () => {
    const [
      lowStockProducts,
      expiringProducts,
    ] = await Promise.all([
      reportRepository
        .getLowStockProducts(),

      reportRepository
        .getExpiringProducts({
          startDate: new Date(),
          endDate: new Date(
            Date.now() +
              30 *
                24 *
                60 *
                60 *
                1000
          ),
        }),
    ]);

    return {
      lowStock: {
        count:
          lowStockProducts.length,

        products:
          lowStockProducts,
      },

      expiring: {
        count:
          expiringProducts.length,

        products:
          expiringProducts,
      },
    };
  };

module.exports = {
  getSalesReport,
  getExpenseReport,
  getProfitReport,
  getMonthlyReport,
  getInventoryReport,
};