import {
  useEffect,
  useState,
} from "react";

import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Package,
  Wallet,
  Receipt,
  RefreshCw,
  AlertCircle,
  X,
  Calendar,
} from "lucide-react";

import financeService from "../../services/finance.service";

const getCurrentMonthStart = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}-01`;
};

const getToday = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatAmount = (value) => {
  return Number(value || 0).toLocaleString();
};

const formatPercentage = (value) => {
  const number = Number(value || 0);

  return `${number.toFixed(2)}%`;
};

const formatMonth = (month) => {
  if (!month) {
    return "-";
  }

  const date = new Date(
    `${month}-01T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return month;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );
};

const FinancePage = () => {
  const [startDate, setStartDate] =
    useState(getCurrentMonthStart);

  const [endDate, setEndDate] =
    useState(getToday);

  const [profit, setProfit] =
    useState(null);

  const [expenseReport, setExpenseReport] =
    useState(null);

  const [monthlyReport, setMonthlyReport] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const fetchFinanceData = async () => {
    if (!startDate || !endDate) {
      setError(
        "Please select both start and end dates."
      );

      return;
    }

    if (startDate > endDate) {
      setError(
        "Start date must be before end date."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const [
        profitResponse,
        expenseResponse,
        monthlyResponse,
      ] = await Promise.all([
        financeService.getProfitReport({
          startDate,
          endDate,
        }),

        financeService.getExpenseReport({
          startDate,
          endDate,
        }),

        financeService.getMonthlyReport({
          year: Number(
            startDate.slice(0, 4)
          ),
        }),
      ]);

      setProfit(
        profitResponse.data || null
      );

      setExpenseReport(
        expenseResponse.data || null
      );

      setMonthlyReport(
        monthlyResponse.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load financial data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleGenerateReport = () => {
    fetchFinanceData();
  };

  const handleReset = () => {
    setStartDate(
      getCurrentMonthStart()
    );

    setEndDate(getToday());

    setTimeout(() => {
      fetchFinanceData();
    }, 0);
  };

  const totalExpenses = Number(
    profit?.businessExpenses || 0
  );

  const totalSalaries = Number(
    profit?.salaries || 0
  );

  const totalRevenue = Number(
    profit?.revenue || 0
  );

  const totalCostOfGoods = Number(
    profit?.costOfGoods || 0
  );

  const grossProfit = Number(
    profit?.grossProfit || 0
  );

  const netProfit = Number(
    profit?.netProfit || 0
  );

  const profitMargin = Number(
    profit?.profitMargin || 0
  );

  const byCategory =
    expenseReport?.byCategory || [];

  const hasExpenseCategories =
    Array.isArray(byCategory) &&
    byCategory.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Wallet size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Finance
            </h1>

            <p className="text-sm text-gray-500">
              Monitor business financial performance
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="flex-1 text-sm">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            className="rounded p-1 hover:bg-red-100"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="rounded p-1 hover:bg-green-100"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Date Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Calendar
            size={20}
            className="text-gray-500"
          />

          <h2 className="font-semibold text-gray-900">
            Financial Period
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                setEndDate(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading
                ? "Loading..."
                : "Generate Report"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Financial Summary
          </h2>

          <p className="text-sm text-gray-500">
            Financial performance for the selected period
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Revenue */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Revenue
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  Rs.{" "}
                  {formatAmount(
                    totalRevenue
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Banknote size={22} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Total sales revenue
            </p>
          </div>

          {/* Cost of Goods */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Cost of Goods
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  Rs.{" "}
                  {formatAmount(
                    totalCostOfGoods
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
                <Package size={22} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Product purchase cost
            </p>
          </div>

          {/* Gross Profit */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Gross Profit
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    grossProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Rs.{" "}
                  {formatAmount(
                    grossProfit
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <TrendingUp size={22} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Revenue minus product cost
            </p>
          </div>

          {/* Net Profit */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Net Profit
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    netProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Rs.{" "}
                  {formatAmount(
                    netProfit
                  )}
                </p>
              </div>

              <div
                className={`rounded-lg p-3 ${
                  netProfit >= 0
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {netProfit >= 0 ? (
                  <TrendingUp size={22} />
                ) : (
                  <TrendingDown size={22} />
                )}
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Margin:{" "}
              {formatPercentage(
                profitMargin
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Expenses + Salaries */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Business Expenses
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                Rs.{" "}
                {formatAmount(
                  totalExpenses
                )}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <Receipt size={22} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Rent, utilities, supplies, maintenance and other expenses
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Salaries
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                Rs.{" "}
                {formatAmount(
                  totalSalaries
                )}
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <Wallet size={22} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Salary payments included in the selected period
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Expense Breakdown
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Expenses grouped by category
          </p>
        </div>

        <div className="p-5">
          {hasExpenseCategories ? (
            <div className="space-y-4">
              {byCategory.map(
                (item, index) => {
                  const category =
                    item.category ||
                    item._id ||
                    "OTHER";

                  const amount = Number(
                    item.amount ??
                      item.total ??
                      item.expenses ??
                      0
                  );

                  const percentage =
                    totalExpenses > 0
                      ? (amount /
                          totalExpenses) *
                        100
                      : 0;

                  return (
                    <div
                      key={
                        item._id ||
                        category ||
                        index
                      }
                    >
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {category}
                        </span>

                        <span className="font-medium text-gray-900">
                          Rs.{" "}
                          {formatAmount(
                            amount
                          )}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {percentage.toFixed(
                          1
                        )}
                        %
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No expense breakdown available for this period.
            </div>
          )}
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Monthly Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monthly sales, expenses and profit
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-5 py-3 text-left font-semibold text-gray-700">
                  Month
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700">
                  Sales
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700">
                  Cost of Goods
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700">
                  Gross Profit
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700">
                  Expenses
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700">
                  Net Profit
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700">
                  Sales Count
                </th>
              </tr>
            </thead>

            <tbody>
              {monthlyReport.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No monthly data available.
                  </td>
                </tr>
              ) : (
                monthlyReport.map(
                  (item) => (
                    <tr
                      key={item.month}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {formatMonth(
                          item.month
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        Rs.{" "}
                        {formatAmount(
                          item.sales
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        Rs.{" "}
                        {formatAmount(
                          item.costOfGoods
                        )}
                      </td>

                      <td
                        className={`px-5 py-4 text-right font-medium ${
                          Number(
                            item.grossProfit
                          ) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Rs.{" "}
                        {formatAmount(
                          item.grossProfit
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        Rs.{" "}
                        {formatAmount(
                          item.expenses
                        )}
                      </td>

                      <td
                        className={`px-5 py-4 text-right font-medium ${
                          Number(
                            item.netProfit
                          ) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Rs.{" "}
                        {formatAmount(
                          item.netProfit
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {
                          item.numberOfSales
                        }
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;