import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  AlertCircle,
  X,
} from "lucide-react";

import supplierService from "../../services/supplier.service";

const initialForm = {
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

const SupplierFormPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(isEditMode);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchSupplier = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await supplierService.getSupplierById(
            id
          );

        const supplier =
          response.data;

        setForm({
          name:
            supplier.name || "",
          contactPerson:
            supplier.contactPerson || "",
          phone:
            supplier.phone || "",
          email:
            supplier.email || "",
          address:
            supplier.address || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load supplier."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id, isEditMode]);

  const handleChange = (
    field
  ) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        event.target.value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (isEditMode) {
        await supplierService.updateSupplier(
          id,
          form
        );
      } else {
        await supplierService.createSupplier(
          form
        );
      }

      navigate("/suppliers");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save supplier."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
        Loading supplier...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/suppliers")
          }
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Suppliers
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditMode
            ? "Edit Supplier"
            : "Add Supplier"}
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEditMode
            ? "Update supplier information."
            : "Add a new supplier to your business."}
        </p>
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
          >
            <X size={18} />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="space-y-5 p-6">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Supplier Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={handleChange(
                "name"
              )}
              required
              minLength={2}
              maxLength={100}
              placeholder="e.g. ABC Distributors"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Person
            </label>

            <input
              type="text"
              value={
                form.contactPerson
              }
              onChange={handleChange(
                "contactPerson"
              )}
              maxLength={100}
              placeholder="e.g. Muhammad Ali"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>

            <input
              type="text"
              value={form.phone}
              onChange={handleChange(
                "phone"
              )}
              maxLength={20}
              placeholder="e.g. 03001234567"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={handleChange(
                "email"
              )}
              maxLength={100}
              placeholder="e.g. supplier@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>

            <textarea
              value={form.address}
              onChange={handleChange(
                "address"
              )}
              maxLength={500}
              rows={4}
              placeholder="Supplier address"
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={() =>
              navigate("/suppliers")
            }
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Update Supplier"
              : "Create Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierFormPage;