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
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Truck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Suppliers
            </h1>

            <p className="text-sm text-gray-500">
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
            onClick={() =>
              setError("")
            }
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
            onClick={() =>
              setMessage("")
            }
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Suppliers
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Showing
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {suppliers.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
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
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-5 py-3 text-left font-semibold text-gray-700">
                  Supplier
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-700">
                  Contact Person
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-700">
                  Phone
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading suppliers...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                suppliers.map(
                  (supplier) => (
                    <tr
                      key={supplier._id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {supplier.name}
                        </p>

                        {supplier.address && (
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {supplier.address}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {supplier.contactPerson ||
                          "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {supplier.phone ||
                          "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {supplier.email ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/suppliers/${supplier._id}/edit`}
                            title="Edit"
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
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
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
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
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex items-center px-3 text-sm text-gray-600">
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
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;