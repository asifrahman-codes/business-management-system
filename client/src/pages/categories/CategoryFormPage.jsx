import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../services/categoryService";

import { categorySchema } from "../../validators/category.schema";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
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
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCategory = async () => {
      try {
        const response =
          await getCategoryById(id);

        reset({
          name: response.data.name || "",
          description:
            response.data.description || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load category."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      setError("");

      if (isEditMode) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }

      navigate("/categories");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save category."
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode
            ? "Edit Category"
            : "Add Category"}
        </h1>
      </div>

      {error && (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              {...register("name")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="e.g. Beverages"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="Category description..."
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/categories")
            }
            className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </PageContainer>
  );
}

export default CategoryFormPage;