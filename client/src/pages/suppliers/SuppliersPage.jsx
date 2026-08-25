import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Truck,
  AlertCircle,
  X,
} from "lucide-react";

import supplierService from "../../services/supplier.service";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await supplierService.getSuppliers({
          page: pagination.page,
          limit: pagination.limit,
          search: search || undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

      setSuppliers(
        response.data || []
      );

      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [
    pagination.page,
    pagination.limit,
    search,
  ]);

  const handleSearchChange = (
    event
  ) => {
    setSearch(event.target.value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleDelete = async (
    supplier
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${supplier.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await supplierService.deleteSupplier(
          supplier._id
        );

      setMessage(
        response.message ||
          "Supplier deleted successfully."
      );

      await fetchSuppliers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete supplier."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    page
  ) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Truck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Suppliers
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage product suppliers and
              their contact information
            </p>
          </div>
        </div>

        <Link
          to="/suppliers/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Supplier
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="flex-1 text-sm">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="hover:text-red-900 dark:hover:text-red-300"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          <span>{message}</span>

          <button
            type="button"
            onClick={() =>
              setMessage("")
            }
            className="hover:text-green-900 dark:hover:text-green-300"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Suppliers
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {suppliers.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={
              handleSearchChange
            }
            placeholder="Search suppliers..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Supplier
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Contact Person
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Phone
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading suppliers...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                suppliers.map(
                  (supplier) => (
                    <tr
                      key={supplier._id}
                      className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {supplier.name}
                        </p>

                        {supplier.address && (
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">
                            {supplier.address}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {supplier.contactPerson ||
                          "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {supplier.phone ||
                          "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {supplier.email ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/suppliers/${supplier._id}/edit`}
                            title="Edit"
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                          >
                            <Pencil
                              size={17}
                            />
                          </Link>

                          <button
                            type="button"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                supplier
                              )
                            }
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={
              pagination.page === 1
            }
            onClick={() =>
              handlePageChange(
                pagination.page - 1
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Previous
          </button>

          <div className="flex items-center px-3 text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </div>

          <button
            type="button"
            disabled={
              pagination.page ===
              pagination.totalPages
            }
            onClick={() =>
              handlePageChange(
                pagination.page + 1
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;