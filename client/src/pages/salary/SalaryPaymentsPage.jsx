import { useEffect, useState } from "react";
import {
  CheckCircle,
  Edit,
  Plus,
  Search,
  Trash2,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";

import {
  createSalaryPayment,
  deleteSalaryPayment,
  getSalaryPayments,
  updateSalaryPayment,
  updateSalaryPaymentStatus,
} from "../../services/salary-payment.service";

import { getEmployees } from "../../services/employee.service";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const statuses = [
  "PENDING",
  "PAID",
  "CANCELLED",
];

const initialForm = {
  employee: "",
  amount: "",
  month: "",
  year: new Date().getFullYear(),
  paidDate: "",
  status: "PENDING",
  notes: "",
};

const getStatusClasses = (status) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const SalaryPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] =
    useState(null);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    employee: "",
    status: "",
    month: "",
    year: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const loadPayments = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getSalaryPayments({
        page,
        limit: pagination.limit,
        employee: filters.employee || undefined,
        status: filters.status || undefined,
        month: filters.month || undefined,
        year: filters.year || undefined,
      });

      setPayments(response.data || []);

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
          "Failed to load salary payments."
      );
    } finally {
      setLoading(false);
    }
  };

const loadEmployees = async () => {
  try {
    const response = await getEmployees({
      page: 1,
      limit: 100,
    });

    console.log("EMPLOYEES RESPONSE:", response);

    setEmployees(response.data || []);
  } catch (err) {
    console.error("EMPLOYEES ERROR:", err);
  }
};

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    loadPayments(1);
  }, [
    filters.employee,
    filters.status,
    filters.month,
    filters.year,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingPayment(null);

    setForm({
      ...initialForm,
      month: months[new Date().getMonth()],
      year: new Date().getFullYear(),
    });

    setShowForm(true);
  };

  const openEditForm = (payment) => {
    setEditingPayment(payment);

    setForm({
      employee:
        payment.employee?._id ||
        payment.employee ||
        "",
      amount: payment.amount,
      month: payment.month,
      year: payment.year,
      paidDate: payment.paidDate
        ? payment.paidDate.substring(0, 10)
        : "",
      status: payment.status,
      notes: payment.notes || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPayment(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        employee: form.employee,
        amount: Number(form.amount),
        month: form.month,
        year: Number(form.year),
        paidDate: form.paidDate || null,
        status: form.status,
        notes: form.notes || "",
      };

      if (editingPayment) {
        await updateSalaryPayment(
          editingPayment._id,
          payload
        );
      } else {
        await createSalaryPayment(payload);
      }

      closeForm();
      await loadPayments(pagination.page);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save salary payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (
    payment,
    status
  ) => {
    try {
      setError("");

      await updateSalaryPaymentStatus(
        payment._id,
        status
      );

      await loadPayments(pagination.page);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update payment status."
      );
    }
  };

  const handleDelete = async (payment) => {
    const confirmed = window.confirm(
      `Delete salary payment for ${
        payment.employee?.name || "this employee"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteSalaryPayment(payment._id);

      await loadPayments(
        payments.length === 1 &&
          pagination.page > 1
          ? pagination.page - 1
          : pagination.page
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete salary payment."
      );
    }
  };

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Salary Payments
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage employee salary payments.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Salary Payment
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <DollarSign size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Current Results
                </p>

                <p className="text-xl font-bold">
                  {payments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
                <Clock size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="text-xl font-bold">
                  {
                    payments.filter(
                      (payment) =>
                        payment.status === "PENDING"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <CheckCircle size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total Amount
                </p>

                <p className="text-xl font-bold">
                  Rs.{" "}
                  {totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <ErrorMessage message={error} />
        )}

        {/* Filters */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <select
              value={filters.employee}
              onChange={(e) =>
                setFilters((previous) => ({
                  ...previous,
                  employee: e.target.value,
                }))
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">
                All Employees
              </option>

              {employees.map((employee) => (
                <option
                  key={employee._id}
                  value={employee._id}
                >
                  {employee.name}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((previous) => ({
                  ...previous,
                  status: e.target.value,
                }))
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">
                All Statuses
              </option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <select
              value={filters.month}
              onChange={(e) =>
                setFilters((previous) => ({
                  ...previous,
                  month: e.target.value,
                }))
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">
                All Months
              </option>

              {months.map((month) => (
                <option
                  key={month}
                  value={month}
                >
                  {month}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(e) =>
                setFilters((previous) => ({
                  ...previous,
                  year: e.target.value,
                }))
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {loading ? (
            <div className="flex justify-center p-10">
              <LoadingSpinner />
            </div>
          ) : payments.length === 0 ? (
            <div className="p-10 text-center">
              <Search
                size={40}
                className="mx-auto mb-3 text-gray-400"
              />

              <h3 className="font-semibold text-gray-800">
                No salary payments found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your filters or add
                a new salary payment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Employee
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Month
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Year
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Paid Date
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {payment.employee?.name ||
                          payment.employee ||
                          "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {payment.month}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {payment.year}
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-900">
                        Rs.{" "}
                        {Number(
                          payment.amount
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {payment.paidDate
                          ? new Date(
                              payment.paidDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          {payment.status ===
                            "PENDING" && (
                            <button
                              title="Mark as paid"
                              onClick={() =>
                                handleStatusChange(
                                  payment,
                                  "PAID"
                                )
                              }
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle
                                size={17}
                              />
                            </button>
                          )}

                          {payment.status !==
                            "CANCELLED" && (
                            <button
                              title="Cancel payment"
                              onClick={() =>
                                handleStatusChange(
                                  payment,
                                  "CANCELLED"
                                )
                              }
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            >
                              <XCircle
                                size={17}
                              />
                            </button>
                          )}

                          <button
                            title="Edit"
                            onClick={() =>
                              openEditForm(payment)
                            }
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            title="Delete"
                            onClick={() =>
                              handleDelete(payment)
                            }
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading &&
            pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-4">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={
                      pagination.page === 1
                    }
                    onClick={() =>
                      loadPayments(
                        pagination.page - 1
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    disabled={
                      pagination.page ===
                      pagination.totalPages
                    }
                    onClick={() =>
                      loadPayments(
                        pagination.page + 1
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingPayment
                      ? "Edit Salary Payment"
                      : "Add Salary Payment"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Enter salary payment details.
                  </p>
                </div>

                <button
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <XCircle size={22} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Employee
                    </label>

                    <select
                      name="employee"
                      value={form.employee}
                      onChange={handleChange}
                      disabled={Boolean(
                        editingPayment
                      )}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        Select employee
                      </option>

                      {employees.map(
                        (employee) => (
                          <option
                            key={employee._id}
                            value={employee._id}
                          >
                            {employee.name} -{" "}
                            {employee.position}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount
                    </label>

                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      placeholder="35000"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Month
                    </label>

                    <select
                      name="month"
                      value={form.month}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">
                        Select month
                      </option>

                      {months.map((month) => (
                        <option
                          key={month}
                          value={month}
                        >
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Year
                    </label>

                    <input
                      type="number"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      min="2000"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Paid Date
                    </label>

                    <input
                      type="date"
                      name="paidDate"
                      value={form.paidDate}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      {statuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    placeholder="Optional notes..."
                  />
                </div>

                <div className="flex justify-end gap-3 border-t pt-5">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingPayment
                      ? "Update Payment"
                      : "Create Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default SalaryPaymentsPage;