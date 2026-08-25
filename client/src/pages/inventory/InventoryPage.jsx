import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Archive,
  CalendarClock,
  Package,
  Search,
  XCircle,
} from "lucide-react";

import { getInventorySummary } from "../../services/inventoryService";
import { getProducts } from "../../services/productService";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import InventoryStatCard from "../../components/inventory/InventoryStatCard";

function InventoryPage() {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStockStatus = (
    quantity,
    reorderLevel
  ) => {
    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
      };
    }

    if (quantity <= reorderLevel) {
      return {
        label: "Low Stock",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
    };
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) {
      return {
        label: "No Expiry",
        className:
          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      };
    }

    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today) {
      return {
        label: "Expired",
        className:
          "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
      };
    }

    const difference =
      expiry.getTime() - today.getTime();

    const daysRemaining = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 30) {
      return {
        label: "Expiring Soon",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
      };
    }

    return {
      label: "Valid",
      className:
        "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
    };
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryResponse,
        productsResponse,
      ] = await Promise.all([
        getInventorySummary(),
        getProducts({
          page,
          limit: 20,
          search,
        }),
      ]);

      setSummary(summaryResponse.data);

      setProducts(
        productsResponse.data || []
      );

      setPagination(
        productsResponse.pagination || null
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  if (loading && !summary) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Inventory
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor product stock levels and expiry
          status.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InventoryStatCard
          title="Total Products"
          value={summary?.totalProducts}
          icon={Package}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
        />

        <InventoryStatCard
          title="Low Stock Products"
          value={summary?.lowStockProducts}
          icon={AlertTriangle}
          iconClassName="bg-yellow-100 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400"
        />

        <InventoryStatCard
          title="Expired Products"
          value={summary?.expiredProducts}
          icon={XCircle}
          iconClassName="bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
        />

        <InventoryStatCard
          title="Expiring Soon"
          value={summary?.expiringSoonProducts}
          icon={CalendarClock}
          iconClassName="bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-5 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Inventory
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View current stock and expiry status.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No products found"
              message="No products match your inventory search."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      SKU
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Current Stock
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Reorder Level
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Stock Status
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Expiry Date
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Expiry Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product) => {
                    const stockStatus =
                      getStockStatus(
                        product.quantityInStock,
                        product.reorderLevel
                      );

                    const expiryStatus =
                      getExpiryStatus(
                        product.expiryDate
                      );

                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                              <Archive size={18} />
                            </div>

                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {product.sku}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {product.category?.name || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {product.quantityInStock}{" "}
                          {product.unit}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {product.reorderLevel}{" "}
                          {product.unit}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                          >
                            {stockStatus.label}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {product.expiryDate
                            ? new Date(
                                product.expiryDate
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${expiryStatus.className}`}
                          >
                            {expiryStatus.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages} (
                  {pagination.total} products)
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
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Previous
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
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Next
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

export default InventoryPage;