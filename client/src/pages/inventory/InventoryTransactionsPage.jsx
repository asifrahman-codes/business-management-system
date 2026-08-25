import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import {
  getInventoryTransactions,
} from "../../services/inventoryService";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

function InventoryTransactionsPage() {
  const [transactions, setTransactions] =
    useState([]);

  const [pagination, setPagination] =
    useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getInventoryTransactions({
          page,
          limit: 20,
          search,
          type,
        });

      setTransactions(
        response.data?.transactions || []
      );

      setPagination(
        response.data?.pagination || null
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load inventory transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, search, type]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPage(1);
  };

  const getTypeClassName = (
    transactionType
  ) => {
    const typeClasses = {
      SALE:
        "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",

      RETURN:
        "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",

      PURCHASE:
        "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",

      ADJUSTMENT:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
    };

    return (
      typeClasses[transactionType] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  if (
    loading &&
    transactions.length === 0
  ) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Inventory Transactions
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track all product stock movements.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-700 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search product..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <select
            value={type}
            onChange={handleTypeChange}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">
              All Transaction Types
            </option>

            <option value="SALE">
              Sale
            </option>

            <option value="RETURN">
              Return
            </option>

            <option value="PURCHASE">
              Purchase
            </option>

            <option value="ADJUSTMENT">
              Adjustment
            </option>
          </select>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No transactions found"
              message="There are no inventory transactions matching your filters."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Previous Stock
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      New Stock
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Performed By
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Note
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map(
                    (transaction) => (
                      <tr
                        key={transaction._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {new Date(
                            transaction.createdAt
                          ).toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.product
                              ?.name || "-"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {transaction.product
                              ?.sku || "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClassName(
                              transaction.type
                            )}`}
                          >
                            {transaction.type}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.quantity}{" "}
                          {transaction.product
                            ?.unit || ""}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {transaction.previousStock}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.newStock}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {transaction
                              .performedBy
                              ?.name ||
                              "System"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {transaction
                              .performedBy
                              ?.email || ""}
                          </p>
                        </td>

                        <td className="max-w-xs px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {transaction.note ||
                            "-"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages} (
                  {pagination.total} transactions)
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          currentPage - 1
                      )
                    }
                    className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    disabled={
                      page >=
                      pagination.totalPages
                    }
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          currentPage + 1
                      )
                    }
                    className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default InventoryTransactionsPage;