import {
  ReceiptText,
  AlertCircle,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import saleService from "../../services/sale.service";

import SalesFilters from "../../components/sales/SalesFilters";
import SalesTable from "../../components/sales/SalesTable";

const SalesPage = () => {
  const navigate = useNavigate();

  const [sales, setSales] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });

  const [filters, setFilters] =
    useState({
      startDate: "",
      endDate: "",
      paymentMethod: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await saleService.getSales({
          page: pagination.page,
          limit: pagination.limit,
          startDate:
            filters.startDate || undefined,
          endDate:
            filters.endDate || undefined,
          paymentMethod:
            filters.paymentMethod ||
            undefined,
        });

      const responseData =
        response.data || {};

      setSales(
        responseData.sales || []
      );

      setPagination(
        responseData.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load sales."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [
    pagination.page,
    pagination.limit,
    filters.startDate,
    filters.endDate,
    filters.paymentMethod,
  ]);

  const handleFilterChange = (
    field,
    value
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      paymentMethod: "",
    });

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setPagination((previous) => ({
      ...previous,
      page,
    }));
  };

  const handleView = (sale) => {
    navigate(`/sales/${sale._id}`);
  };

  const handleReceipt = (sale) => {
    navigate(
      `/sales/${sale._id}/receipt`
    );
  };

  const currentPageTotal =
    sales.reduce(
      (total, sale) =>
        total +
        Number(
          sale.grandTotal || 0
        ),
      0
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <ReceiptText size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sales
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage sales history
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
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
            className="transition hover:text-red-900 dark:hover:text-red-300"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Sales Records
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current Page Revenue
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            Rs.{" "}
            {currentPageTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <SalesFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        paymentMethod={
          filters.paymentMethod
        }
        onStartDateChange={(value) =>
          handleFilterChange(
            "startDate",
            value
          )
        }
        onEndDateChange={(value) =>
          handleFilterChange(
            "endDate",
            value
          )
        }
        onPaymentMethodChange={(value) =>
          handleFilterChange(
            "paymentMethod",
            value
          )
        }
        onReset={handleReset}
      />

      {/* Table */}
      <SalesTable
        sales={sales}
        loading={loading}
        onView={handleView}
        onReceipt={handleReceipt}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
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
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

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
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesPage;