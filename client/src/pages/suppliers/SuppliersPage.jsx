import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

import {
  deleteSupplier,
  getSuppliers,
} from "../../services/supplierService";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuppliers({
        page,
        limit: 20,
        search: search.trim() || undefined,
      });

      setSuppliers(response.data || []);

      setPagination(
        response.pagination || {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 1,
        }
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page]);

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);

    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteSupplier(id);

      await fetchSuppliers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete supplier."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString();
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
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your product suppliers.
          </p>
        </div>

        <Link
          to="/suppliers/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />

          Add Supplier
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Search */}
      <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search suppliers..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Search
          </button>
        </form>
      </div>

      {/* Empty State */}
      {suppliers.length === 0 ? (
        <EmptyState
          title={
            search
              ? "No suppliers found"
              : "No suppliers yet"
          }
          message={
            search
              ? "Try changing your search."
              : "Create your first supplier to get started."
          }
        />
      ) : (
        <>
          {/* Supplier Table */}
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Supplier
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Contact Person
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Address
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {suppliers.map((supplier) => (
                    <tr
                      key={supplier._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {supplier.name}
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {supplier.contactPerson ||
                          "-"}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {supplier.phone || "-"}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {supplier.email || "-"}
                      </td>

                      {/* Address */}
                      <td className="max-w-[220px] px-5 py-4 text-sm text-gray-600">
                        <span className="block truncate">
                          {supplier.address || "-"}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(
                          supplier.createdAt
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/suppliers/${supplier._id}/edit`}
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                supplier._id
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
            <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing page{" "}
                <span className="font-medium text-gray-700">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {pagination.totalPages}
                </span>{" "}
                ({pagination.total} suppliers)
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(
                      (current) => current - 1
                    )
                  }
                  className="rounded-lg border p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                      (current) => current + 1
                    )
                  }
                  className="rounded-lg border p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default SuppliersPage;