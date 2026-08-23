import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  createSupplier,
  getSupplierById,
  updateSupplier,
} from "../../services/supplierService";

import { supplierSchema } from "../../validators/supplier.schema";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const SupplierFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] =
    useState(isEditMode);

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: yupResolver(supplierSchema),

    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  /*
   * Load supplier when editing
   */
  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchSupplier = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getSupplierById(id);

        const supplier = response.data;

        reset({
          name: supplier.name || "",
          contactPerson:
            supplier.contactPerson || "",
          phone: supplier.phone || "",
          email: supplier.email || "",
          address: supplier.address || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load supplier."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id, isEditMode, reset]);

  /*
   * Submit
   */
  const onSubmit = async (data) => {
    try {
      setError("");

      if (isEditMode) {
        await updateSupplier(id, data);
      } else {
        await createSupplier(data);
      }

      navigate("/suppliers");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save supplier."
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode
            ? "Edit Supplier"
            : "Add Supplier"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update supplier information."
            : "Add a new supplier to your business."}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Supplier Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Supplier Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="name"
              type="text"
              placeholder="e.g. ABC Distributors"
              {...register("name")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label
              htmlFor="contactPerson"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contact Person
            </label>

            <input
              id="contactPerson"
              type="text"
              placeholder="e.g. Ahmed Khan"
              {...register("contactPerson")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.contactPerson && (
              <p className="mt-1 text-sm text-red-600">
                {
                  errors.contactPerson
                    .message
                }
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone
            </label>

            <input
              id="phone"
              type="text"
              placeholder="e.g. 03001234567"
              {...register("phone")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="e.g. supplier@example.com"
              {...register("email")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Address
            </label>

            <textarea
              id="address"
              rows={3}
              placeholder="Supplier address..."
              {...register("address")}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate("/suppliers")
            }
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Supplier"
              : "Create Supplier"}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default SupplierFormPage;