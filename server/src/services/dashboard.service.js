const dashboardRepository =
  require(
    "../repositories/dashboard.repository"
  );

const getDayRange = (date) => {
  const startDate = new Date(date);

  startDate.setHours(
    0,
    0,
    0,
    0
  );

  const endDate = new Date(startDate);

  endDate.setDate(
    endDate.getDate() + 1
  );

  return {
    startDate,
    endDate,
  };
};

const getDashboardSummary = async () => {
  const today = new Date();

  const {
    startDate,
    endDate,
  } = getDayRange(today);

  const [
    sales,
    expenses,
    salaries,
    lowStockProducts,
    expiringProducts,
  ] = await Promise.all([
    dashboardRepository
      .getSalesSummary({
        startDate,
        endDate,
      }),

    dashboardRepository
      .getExpenseSummary({
        startDate,
        endDate,
      }),

    dashboardRepository
      .getSalarySummary({
        startDate,
        endDate,
      }),

    dashboardRepository
      .getLowStockCount(),

    dashboardRepository
      .getExpiringProductsCount({
        startDate: today,
        endDate: new Date(
          today.getTime() +
            7 * 24 * 60 * 60 * 1000
        ),
      }),
  ]);

  const grossProfit =
    sales.totalSales -
    sales.totalCost;

  const netProfit =
    grossProfit -
    expenses.totalExpenses -
    salaries.totalSalaries;

  return {
    sales: {
      today: sales.totalSales,
    },

    expenses: {
      today: expenses.totalExpenses,
    },

    salaries: {
      today: salaries.totalSalaries,
    },

    profit: {
      gross: grossProfit,
      net: netProfit,
    },

    inventory: {
      lowStockProducts,
      expiringProducts,
    },
  };
};

module.exports = {
  getDashboardSummary,
};