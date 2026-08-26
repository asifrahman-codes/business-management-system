import { useEffect, useState } from "react";

import {
  X,
  UserPlus,
  Save,
} from "lucide-react";

const initialForm = {
  name: "",
  position: "",
  phone: "",
  email: "",
  password: "",
  joiningDate: "",
  baseSalary: "",
};

const EmployeeFormModal = ({
  show,
  employee,
  loading,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        position: employee.position || "",
        phone: employee.phone || "",
        email: employee.email || "",
        password: "",
        joiningDate: employee.joiningDate
          ? employee.joiningDate.slice(0, 10)
          : "",
        baseSalary:
          employee.baseSalary ?? "",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [employee, show]);

  if (!show) {
    return null;
  }

  const isCashier =
    form.position.trim().toLowerCase() ===
    "cashier";

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Name is required";
    }

    if (!form.position.trim()) {
      newErrors.position =
        "Position is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone is required";
    }

    if (!form.joiningDate) {
      newErrors.joiningDate =
        "Joining date is required";
    }

    if (
      !form.baseSalary ||
      Number(form.baseSalary) <= 0
    ) {
      newErrors.baseSalary =
        "Valid base salary is required";
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    /*
     * Cashier login requirements
     */
    if (isCashier) {
      if (!form.email.trim()) {
        newErrors.email =
          "Email is required for cashier login";
      }

      /*
       * Password is required only
       * when creating a new cashier.
       */
      if (!employee) {
        if (!form.password) {
          newErrors.password =
            "Password is required for cashier login";
        } else if (
          form.password.length < 8
        ) {
          newErrors.password =
            "Password must be at least 8 characters";
        }
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = {
      name: form.name.trim(),
      position: form.position.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      joiningDate: form.joiningDate,
      baseSalary: Number(
        form.baseSalary
      ),
    };

    /*
     * Only send password when creating
     * a cashier account.
     */
    if (isCashier && !employee) {
      data.password = form.password;
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {employee
                  ? "Edit Employee"
                  : "Add Employee"}
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {employee
                  ? "Update employee information"
                  : "Add a new employee to your business"}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${
                    errors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100 dark:border-gray-600"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Position
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. Cashier"
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${
                    errors.position
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100 dark:border-gray-600"
                  }`}
                />

                {errors.position && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.position}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />

                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                  {isCashier && (
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  )}
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="employee@example.com"
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-white ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password - Cashier only */}
              {isCashier && !employee && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Login Password
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-white ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Joining Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Joining Date
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />

                {errors.joiningDate && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.joiningDate}
                  </p>
                )}
              </div>

              {/* Salary */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Base Salary
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="number"
                  name="baseSalary"
                  value={form.baseSalary}
                  onChange={handleChange}
                  min="0"
                  placeholder="35000"
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-white ${
                    errors.baseSalary
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.baseSalary && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.baseSalary}
                  </p>
                )}
              </div>

            </div>

            {/* Cashier info */}
            {isCashier && !employee && (
              <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                A login account will be created automatically
                for this cashier using the email and password
                above.
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  {employee
                    ? "Update Employee"
                    : "Create Employee"}
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;