import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Users,
  UserCheck,
  UserX,
  Plus,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import employeeService from "../../services/employee.service";

import EmployeeFilters from "../../components/employees/EmployeeFilters";

import EmployeesTable from "../../components/employees/EmployeesTable";

import EmployeeFormModal from "../../components/employees/EmployeeFormModal";

import EmployeeStatusModal from "../../components/employees/EmployeeStatusModal";

const EmployeesPage = () => {
  const [employees, setEmployees] =
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

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [formLoading, setFormLoading] =
    useState(false);

  const [statusLoading, setStatusLoading] =
    useState(false);

  const [formOpen, setFormOpen] =
    useState(false);

  const [statusOpen, setStatusOpen] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Fetch Employees
   */

  const fetchEmployees =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await employeeService.getEmployees(
            {
              page: pagination.page,
              limit: pagination.limit,
              search:
                search.trim() ||
                undefined,
              status:
                status || undefined,
            }
          );

        setEmployees(
          response.data || []
        );

        if (response.pagination) {
          setPagination(
            response.pagination
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load employees."
        );
      } finally {
        setLoading(false);
      }
    }, [
      pagination.page,
      pagination.limit,
      search,
      status,
    ]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  /*
   * Statistics
   *
   * These counts are based on the
   * currently loaded employees.
   */

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status === "ACTIVE"
    ).length;

  const inactiveEmployees =
    employees.filter(
      (employee) =>
        employee.status === "INACTIVE"
    ).length;

  /*
   * Add
   */

  const handleAdd = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  /*
   * Edit
   */

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  /*
   * Create / Update
   */

  const handleFormSubmit = async (
    data
  ) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedEmployee) {
        const response =
          await employeeService.updateEmployee(
            selectedEmployee._id,
            data
          );

        setSuccess(
          response.message ||
            "Employee updated successfully."
        );
      } else {
        const response =
          await employeeService.createEmployee(
            data
          );

        setSuccess(
          response.message ||
            "Employee created successfully."
        );
      }

      setFormOpen(false);
      setSelectedEmployee(null);

      await fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save employee."
      );
    } finally {
      setFormLoading(false);
    }
  };

  /*
   * Status modal
   */

  const handleStatusConfirm = async (
    newStatus
  ) => {
    if (!selectedEmployee) {
      return;
    }

    try {
      setStatusLoading(true);
      setError("");

      const response =
        await employeeService.updateEmployeeStatus(
          selectedEmployee._id,
          newStatus
        );

      setSuccess(
        response.message ||
          "Employee status updated successfully."
      );

      setStatusOpen(false);
      setSelectedEmployee(null);

      await fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update employee status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  /*
   * Delete
   */

  const handleDelete = async (
    employee
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${employee.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await employeeService.deleteEmployee(
          employee._id
        );

      setSuccess(
        response.message ||
          "Employee deleted successfully."
      );

      /*
       * If the last employee on the
       * current page was deleted,
       * move back one page.
       */

      if (
        employees.length === 1 &&
        pagination.page > 1
      ) {
        setPagination((prev) => ({
          ...prev,
          page: prev.page - 1,
        }));
      } else {
        await fetchEmployees();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete employee."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Search
   */

  const handleSearchChange = (
    value
  ) => {
    setSearch(value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  /*
   * Status filter
   */

  const handleStatusChange = (
    value
  ) => {
    setStatus(value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  /*
   * Reset filters
   */

  const handleReset = () => {
    setSearch("");
    setStatus("");

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  /*
   * Pagination
   */

  const handlePageChange = (
    page
  ) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  /*
   * Close modals
   */

  const closeForm = () => {
    if (formLoading) {
      return;
    }

    setFormOpen(false);
    setSelectedEmployee(null);
  };

  const closeStatusModal = () => {
    if (statusLoading) {
      return;
    }

    setStatusOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Page Header */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Employees
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your business employees
          </p>

        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} />

          Add Employee
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            {error}
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-400 hover:text-red-600"
          >
            <X size={17} />
          </button>

        </div>
      )}

      {/* Success */}

      {success && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            {success}
          </div>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
            className="text-green-400 hover:text-green-600"
          >
            <X size={17} />
          </button>

        </div>
      )}

      {/* Statistics */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* Total */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Employees
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={21} />
            </div>

          </div>

        </div>

        {/* Active */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Active Employees
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {activeEmployees}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <UserCheck size={21} />
            </div>

          </div>

        </div>

        {/* Inactive */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Inactive Employees
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {inactiveEmployees}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <UserX size={21} />
            </div>

          </div>

        </div>

      </div>

      {/* Filters */}

      <EmployeeFilters
        search={search}
        status={status}
        onSearchChange={
          handleSearchChange
        }
        onStatusChange={
          handleStatusChange
        }
        onReset={handleReset}
      />

      {/* Table */}

      <EmployeesTable
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={
          handleStatusChange
        }
      />

      {/* Pagination */}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">

          <p className="text-sm text-gray-500">

            Page{" "}
            <span className="font-medium text-gray-900">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {pagination.totalPages}
            </span>

          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={
                pagination.page <= 1
              }
              onClick={() =>
                handlePageChange(
                  pagination.page - 1
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                pagination.page >=
                pagination.totalPages
              }
              onClick={() =>
                handlePageChange(
                  pagination.page + 1
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>
      )}

      {/* Employee Form */}

      <EmployeeFormModal
        show={formOpen}
        employee={selectedEmployee}
        loading={formLoading}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      {/* Status Modal */}

      <EmployeeStatusModal
        show={statusOpen}
        employee={selectedEmployee}
        loading={statusLoading}
        onClose={closeStatusModal}
        onConfirm={
          handleStatusConfirm
        }
      />

    </div>
  );
};

export default EmployeesPage;