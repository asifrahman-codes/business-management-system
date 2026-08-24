import { useEffect, useState } from "react";

import {
  BarChart3,
  Calendar,
  DollarSign,
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";

import {
  getSalesReport,
  getExpenseReport,
  getProfitReport,
  getMonthlyReport,
  getInventoryReport,
} from "../../services/report.service";

const formatCurrency = (value) => {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
};

const formatMonth = (month) => {
  if (!month) return "-";

  const [year, monthNumber] = month.split("-");

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-gray-100 p-3">
          <Icon className="h-5 w-5 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex items-center gap-3 text-gray-500">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span>Loading report...</span>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => {
  return (
    <div className="py-10 text-center text-sm text-gray-500">
      {message}
    </div>
  );
};

const ReportsPage = () => {
  const today = new Date();

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const formatDateInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(
    formatDateInput(firstDay)
  );

  const [endDate, setEndDate] = useState(
    formatDateInput(today)
  );

  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear()
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [salesReport, setSalesReport] = useState(null);

  const [expenseReport, setExpenseReport] = useState(null);

  const [profitReport, setProfitReport] = useState(null);

  const [monthlyReport, setMonthlyReport] = useState([]);

  const [inventoryReport, setInventoryReport] =
    useState(null);

  const loadReports = async () => {
    if (!startDate || !endDate) {
      setError("Please select both dates.");
      return;
    }

    if (startDate >= endDate) {
      setError(
        "Start date must be before end date."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        salesResponse,
        expenseResponse,
        profitResponse,
        monthlyResponse,
        inventoryResponse,
      ] = await Promise.all([
        getSalesReport(startDate, endDate),
        getExpenseReport(startDate, endDate),
        getProfitReport(startDate, endDate),
        getMonthlyReport(selectedYear),
        getInventoryReport(),
      ]);

      setSalesReport(
        salesResponse?.data || null
      );

      setExpenseReport(
        expenseResponse?.data || null
      );

      setProfitReport(
        profitResponse?.data || null
      );

      setMonthlyReport(
        monthlyResponse?.data || []
      );

      setInventoryReport(
        inventoryResponse?.data || null
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [selectedYear]);

  const handleFilter = (event) => {
    event.preventDefault();

    loadReports();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View sales, expenses, profit and inventory
            performance.
          </p>
        </div>
      </div>

      {/* Date Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleFilter}
          className="flex flex-col gap-4 lg:flex-row lg:items-end"
        >
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Date
            </label>

            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              End Date
            </label>

            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <BarChart3 className="h-4 w-4" />

            {loading
              ? "Loading..."
              : "Generate Report"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* Profit Summary */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Financial Summary
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Revenue"
                value={formatCurrency(
                  profitReport?.revenue
                )}
                icon={DollarSign}
                description="Total sales revenue"
              />

              <StatCard
                title="Cost of Goods"
                value={formatCurrency(
                  profitReport?.costOfGoods
                )}
                icon={Package}
                description="Product cost"
              />

              <StatCard
                title="Gross Profit"
                value={formatCurrency(
                  profitReport?.grossProfit
                )}
                icon={TrendingUp}
                description="Revenue minus product cost"
              />

              <StatCard
                title="Net Profit"
                value={formatCurrency(
                  profitReport?.netProfit
                )}
                icon={
                  Number(
                    profitReport?.netProfit || 0
                  ) >= 0
                    ? TrendingUp
                    : TrendingDown
                }
                description={`Margin: ${
                  profitReport?.profitMargin ?? 0
                }%`}
              />
            </div>
          </div>

          {/* Sales + Expenses */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sales Report */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Sales Report
                </h2>

                <p className="text-sm text-gray-500">
                  Sales for selected date range
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-5">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Total Sales
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {formatCurrency(
                      salesReport?.totalSales
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Total Cost
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {formatCurrency(
                      salesReport?.totalCost
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Number of Sales
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {salesReport?.numberOfSales ?? 0}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Profit
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {formatCurrency(
                      Number(
                        salesReport?.totalSales || 0
                      ) -
                        Number(
                          salesReport?.totalCost || 0
                        )
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Expense Report */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Expense Report
                </h2>

                <p className="text-sm text-gray-500">
                  Expenses for selected date range
                </p>
              </div>

              <div className="p-5">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Total Expenses
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      expenseReport?.totalExpenses
                    )}
                  </p>
                </div>

                <div className="mt-5">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Expenses by Category
                  </h3>

                  {expenseReport?.byCategory
                    ?.length ? (
                    <div className="space-y-2">
                      {expenseReport.byCategory.map(
                        (item, index) => (
                          <div
                            key={
                              item._id || index
                            }
                            className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                          >
                            <span className="text-sm text-gray-600">
                              {item._id}
                            </span>

                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(
                                item.total ||
                                  item.amount ||
                                  item.expenses
                              )}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState message="No expense category data available." />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profit Details */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="font-semibold text-gray-900">
                Profit Details
              </h2>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Business Expenses"
                value={formatCurrency(
                  profitReport?.businessExpenses
                )}
                icon={TrendingDown}
              />

              <StatCard
                title="Salaries"
                value={formatCurrency(
                  profitReport?.salaries
                )}
                icon={DollarSign}
              />

              <StatCard
                title="Profit Margin"
                value={`${profitReport?.profitMargin ?? 0}%`}
                icon={TrendingUp}
              />
            </div>
          </div>

          {/* Monthly Report */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Monthly Report
                </h2>

                <p className="text-sm text-gray-500">
                  Monthly performance
                </p>
              </div>

              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                {Array.from(
                  { length: 5 },
                  (_, index) =>
                    today.getFullYear() -
                    index
                ).map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Month
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Sales
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Cost
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Gross Profit
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Expenses
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Net Profit
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Sales Count
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {monthlyReport.length ? (
                    monthlyReport.map((item) => (
                      <tr
                        key={item.month}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">
                          {formatMonth(
                            item.month
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-gray-700">
                          {formatCurrency(
                            item.sales
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-gray-700">
                          {formatCurrency(
                            item.costOfGoods
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-gray-700">
                          {formatCurrency(
                            item.grossProfit
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-gray-700">
                          {formatCurrency(
                            item.expenses
                          )}
                        </td>

                        <td
                          className={`px-5 py-4 text-right text-sm font-semibold ${
                            Number(
                              item.netProfit
                            ) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(
                            item.netProfit
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-gray-700">
                          {item.numberOfSales ??
                            0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        No monthly data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Report */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Low Stock */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <AlertTriangle className="h-5 w-5 text-gray-700" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Low Stock
                    </h2>

                    <p className="text-sm text-gray-500">
                      Products requiring restock
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                  {inventoryReport?.lowStock
                    ?.count ?? 0}
                </span>
              </div>

              <div className="p-5">
                {inventoryReport?.lowStock
                  ?.products?.length ? (
                  <div className="space-y-3">
                    {inventoryReport.lowStock.products.map(
                      (product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-red-600">
                              {product.quantityInStock}
                            </p>

                            <p className="text-xs text-gray-500">
                              In stock
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <EmptyState message="No low-stock products." />
                )}
              </div>
            </div>

            {/* Expiring */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Clock className="h-5 w-5 text-gray-700" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Expiring Soon
                    </h2>

                    <p className="text-sm text-gray-500">
                      Products expiring within 30 days
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                  {inventoryReport?.expiring
                    ?.count ?? 0}
                </span>
              </div>

              <div className="p-5">
                {inventoryReport?.expiring
                  ?.products?.length ? (
                  <div className="space-y-3">
                    {inventoryReport.expiring.products.map(
                      (product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-orange-600">
                              {product.expiryDate
                                ? new Date(
                                    product.expiryDate
                                  ).toLocaleDateString()
                                : "-"}
                            </p>

                            <p className="text-xs text-gray-500">
                              Expiry date
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <EmptyState message="No products expiring soon." />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;