import {
  Users,
  Pencil,
  Power,
  Trash2,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

const EmployeesTable = ({
  employees = [],
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex min-h-[300px] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading employees...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Employee
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Position
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Contact
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Joining Date
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Salary
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-16 text-center"
                >
                  <Users
                    size={42}
                    strokeWidth={1.5}
                    className="mx-auto text-gray-300 dark:text-gray-600"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    No employees found
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr
                  key={
                    employee._id ||
                    employee.email ||
                    employee.name
                  }
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {/* Employee */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <Users size={19} />
                      </div>

                      <div>
                        <p className="mb-0 text-sm font-semibold text-gray-900 dark:text-white">
                          {employee.name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          ID:{" "}
                          {employee._id
                            ? String(
                                employee._id
                              ).slice(-6)
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Position */}

                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {employee.position || "-"}
                    </span>
                  </td>

                  {/* Contact */}

                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {employee.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <Phone
                            size={14}
                            className="text-gray-400 dark:text-gray-500"
                          />

                          <span>
                            {employee.phone}
                          </span>
                        </div>
                      )}

                      {employee.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <Mail
                            size={14}
                            className="text-gray-400 dark:text-gray-500"
                          />

                          <span>
                            {employee.email}
                          </span>
                        </div>
                      )}

                      {!employee.phone &&
                        !employee.email && (
                          <span className="text-sm text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                    </div>
                  </td>

                  {/* Joining Date */}

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CalendarDays
                        size={16}
                        className="text-gray-400 dark:text-gray-500"
                      />

                      <span>
                        {employee.joiningDate
                          ? new Date(
                              employee.joiningDate
                            ).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </td>

                  {/* Salary */}

                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Rs.{" "}
                      {Number(
                        employee.baseSalary || 0
                      ).toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}

                  <td className="px-4 py-4">
                    {employee.status ===
                    "ACTIVE" ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(employee)
                        }
                        title="Edit employee"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/50"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(employee)
                        }
                        title={
                          employee.status ===
                          "ACTIVE"
                            ? "Deactivate employee"
                            : "Activate employee"
                        }
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                          employee.status ===
                          "ACTIVE"
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950/50"
                            : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/50"
                        }`}
                      >
                        <Power size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(employee)
                        }
                        title="Delete employee"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesTable;