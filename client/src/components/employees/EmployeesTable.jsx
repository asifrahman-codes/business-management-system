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
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading employees...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-[1000px] w-full">

          <thead className="border-b border-gray-200 bg-gray-50">

            <tr>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Employee
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Position
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Joining Date
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Salary
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

            {employees.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="px-5 py-16 text-center"
                >
                  <Users
                    size={42}
                    strokeWidth={1.5}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-600">
                    No employees found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
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
                  className="transition hover:bg-gray-50"
                >

                  {/* Employee */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Users size={19} />
                      </div>

                      <div>

                        <p className="mb-0 text-sm font-semibold text-gray-900">
                          {employee.name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
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

                    <span className="text-sm text-gray-600">
                      {employee.position ||
                        "-"}
                    </span>

                  </td>

                  {/* Contact */}

                  <td className="px-4 py-4">

                    <div className="space-y-1">

                      {employee.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone
                            size={14}
                            className="text-gray-400"
                          />

                          <span>
                            {employee.phone}
                          </span>
                        </div>
                      )}

                      {employee.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail
                            size={14}
                            className="text-gray-400"
                          />

                          <span>
                            {employee.email}
                          </span>
                        </div>
                      )}

                      {!employee.phone &&
                        !employee.email && (
                          <span className="text-sm text-gray-400">
                            -
                          </span>
                        )}

                    </div>

                  </td>

                  {/* Joining Date */}

                  <td className="px-4 py-4">

                    <div className="flex items-center gap-2 text-sm text-gray-600">

                      <CalendarDays
                        size={16}
                        className="text-gray-400"
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

                    <span className="text-sm font-semibold text-gray-900">
                      Rs.{" "}
                      {Number(
                        employee.baseSalary ||
                          0
                      ).toLocaleString()}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-4 py-4">

                    {employee.status ===
                    "ACTIVE" ? (

                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        Active
                      </span>

                    ) : (

                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
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
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            employee
                          )
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
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                            : "border-green-200 text-green-600 hover:bg-green-50"
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
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
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