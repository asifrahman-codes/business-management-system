import {
  Plus,
  Receipt,
  AlertCircle,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import expenseService from "../../services/expense.service";

import ExpenseFilters from "../../components/expenses/ExpenseFilters";
import ExpensesTable from "../../components/expenses/ExpensesTable";
import ExpenseFormModal from "../../components/expenses/ExpenseFormModal";

const ExpensesPage = () => {
  const [expenses, setExpenses] =
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
      category: "",
      startDate: "",
      endDate: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  const [formLoading, setFormLoading] =
    useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await expenseService.getExpenses({
          page: pagination.page,
          limit: pagination.limit,
          category:
            filters.category || undefined,
          startDate:
            filters.startDate || undefined,
          endDate:
            filters.endDate || undefined,
          sortBy: "date",
          sortOrder: "desc",
        });

      setExpenses(response.data || []);

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
          "Failed to load expenses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [
    pagination.page,
    pagination.limit,
    filters.category,
    filters.startDate,
    filters.endDate,
  ]);

  const handleAdd = () => {
    setSelectedExpense(null);
    setModalOpen(true);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setModalOpen(true);
  };

  const handleSubmit = async (
    expenseData
  ) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedExpense) {
        const response =
          await expenseService.updateExpense(
            selectedExpense._id,
            expenseData
          );

        setMessage(
          response.message ||
            "Expense updated successfully."
        );
      } else {
        const response =
          await expenseService.createExpense(
            expenseData
          );

        setMessage(
          response.message ||
            "Expense created successfully."
        );
      }

      setModalOpen(false);
      setSelectedExpense(null);

      await fetchExpenses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save expense."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (
    expense
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${expense.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await expenseService.deleteExpense(
          expense._id
        );

      setMessage(
        response.message ||
          "Expense deleted successfully."
      );

      await fetchExpenses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete expense."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    field,
    value
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      category: "",
      startDate: "",
      endDate: "",
    });

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const totalAmount = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Receipt size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Expenses
              </h1>

              <p className="text-sm text-gray-500">
                Manage and track business expenses
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Expense
        </button>
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
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Current Page Total
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            Rs.{" "}
            {totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ExpenseFilters
        category={filters.category}
        startDate={filters.startDate}
        endDate={filters.endDate}
        onCategoryChange={(value) =>
          handleFilterChange(
            "category",
            value
          )
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
        onReset={handleReset}
      />

      {/* Table */}
      <ExpensesTable
        expenses={expenses}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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

      {/* Form Modal */}
      <ExpenseFormModal
        open={modalOpen}
        expense={selectedExpense}
        loading={formLoading}
        onClose={() => {
          if (!formLoading) {
            setModalOpen(false);
            setSelectedExpense(null);
          }
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ExpensesPage;