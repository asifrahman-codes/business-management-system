import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

import {
  deleteProduct,
  getProducts,
} from "../../services/productService";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page,
        limit: 20,
        search: appliedSearch || undefined,
      });

      setProducts(response.data || []);
      setPagination(response.pagination || null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, appliedSearch]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch = search.trim();

    setPage(1);
    setAppliedSearch(trimmedSearch);
  };

  const handleClearSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProduct(id);

      /*
       * If the deleted product was the last item
       * on the current page, move to the previous page.
       */
      if (
        products.length === 1 &&
        page > 1
      ) {
        setPage((currentPage) => currentPage - 1);
        return;
      }

      await fetchProducts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) {
      return "-";
    }

    return new Date(
      expiryDate
    ).toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your products and pricing.
          </p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-5 flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-sm">
          <Search
            size={19}
            className="shrink-0 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by product name or SKU..."
            className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Search
        </button>

        {appliedSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </form>

      {/* Products */}
      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          message={
            appliedSearch
              ? "No products match your search."
              : "Start by adding your first product."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    SKU
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Supplier
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Selling Price
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Expiry
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          Unit: {product.unit}
                        </p>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.sku}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.category?.name || "-"}
                    </td>

                    {/* Supplier */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.supplier?.name || "-"}
                    </td>

                    {/* Selling Price */}
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(
                        product.sellingPrice
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className={
                          product.quantityInStock <=
                          product.reorderLevel
                            ? "text-sm font-medium text-red-600"
                            : "text-sm text-gray-600"
                        }
                      >
                        {product.quantityInStock}{" "}
                        {product.unit}
                      </span>
                    </td>

                    {/* Expiry */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatExpiryDate(
                        product.expiryDate
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          View
                        </Link>

                        <Link
                          to={`/products/${product._id}/edit`}
                          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                          className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination &&
            pagination.totalPages > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Showing page{" "}
                    <span className="font-medium text-gray-700">
                      {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                      {pagination.totalPages}
                    </span>
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {pagination.total}{" "}
                    {pagination.total === 1
                      ? "product"
                      : "products"}{" "}
                    total
                  </p>
                </div>

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
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
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
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </PageContainer>
  );
}

export default ProductsPage;