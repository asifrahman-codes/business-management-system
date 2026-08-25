import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";

import { productSchema } from "../../validators/product.schema";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getCategories } from "../../services/categoryService";
import { getSuppliers } from "../../services/supplierService";

function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitError, setSubmitError] = useState("");

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      costPrice: "",
      sellingPrice: "",
      quantityInStock: 0,
      reorderLevel: 0,
      unit: "",
      expiryDate: "",
      category: "",
      supplier: "",
    },
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await getProductById(id);

        const product = response.data;

        reset({
          name: product.name || "",
          sku: product.sku || "",
          costPrice: product.costPrice ?? "",
          sellingPrice: product.sellingPrice ?? "",
          quantityInStock:
            product.quantityInStock ?? 0,
          reorderLevel:
            product.reorderLevel ?? 0,
          unit: product.unit || "",
          expiryDate: product.expiryDate
            ? product.expiryDate.split("T")[0]
            : "",
          category:
            product.category?.id ||
            product.category ||
            "",
          supplier:
            product.supplier?.id ||
            product.supplier ||
            "",
        });
      } catch (error) {
        setSubmitError(
          error.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, reset]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [
          categoryResponse,
          supplierResponse,
        ] = await Promise.all([
          getCategories(),
          getSuppliers({
            page: 1,
            limit: 100,
          }),
        ]);

        setCategories(categoryResponse.data || []);
        setSuppliers(supplierResponse.data || []);
      } catch (error) {
        setSubmitError(
          error.response?.data?.message ||
            "Failed to load categories and suppliers."
        );
      }
    };

    fetchFormData();
  }, []);

  const onSubmit = async (formData) => {
    try {
      setSubmitError("");

      const payload = {
        ...formData,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        quantityInStock: Number(
          formData.quantityInStock
        ),
        reorderLevel: Number(
          formData.reorderLevel
        ),
        expiryDate:
          formData.expiryDate || null,
      };

      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/products");
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Failed to save product."
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEditMode
            ? "Edit Product"
            : "Add Product"}
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEditMode
            ? "Update product information."
            : "Add a new product to your inventory."}
        </p>
      </div>

      {submitError && (
        <div className="mb-5">
          <ErrorMessage message={submitError} />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="Product Name"
            error={errors.name?.message}
          >
            <input
              {...register("name")}
              className="input"
              placeholder="Enter product name"
            />
          </FormField>

          <FormField
            label="SKU"
            error={errors.sku?.message}
          >
            <input
              {...register("sku")}
              className="input"
              placeholder="Enter SKU"
            />
          </FormField>

          <FormField
            label="Cost Price"
            error={errors.costPrice?.message}
          >
            <input
              {...register("costPrice")}
              type="number"
              step="0.01"
              className="input"
              placeholder="0.00"
            />
          </FormField>

          <FormField
            label="Selling Price"
            error={errors.sellingPrice?.message}
          >
            <input
              {...register("sellingPrice")}
              type="number"
              step="0.01"
              className="input"
              placeholder="0.00"
            />
          </FormField>

          <FormField
            label="Quantity in Stock"
            error={errors.quantityInStock?.message}
          >
            <input
              {...register("quantityInStock")}
              type="number"
              className="input"
            />
          </FormField>

          <FormField
            label="Reorder Level"
            error={errors.reorderLevel?.message}
          >
            <input
              {...register("reorderLevel")}
              type="number"
              className="input"
            />
          </FormField>

          <FormField
            label="Unit"
            error={errors.unit?.message}
          >
            <input
              {...register("unit")}
              className="input"
              placeholder="e.g. piece, box, kg"
            />
          </FormField>

          <FormField
            label="Expiry Date"
            error={errors.expiryDate?.message}
          >
            <input
              {...register("expiryDate")}
              type="date"
              className="input"
            />
          </FormField>

          <FormField
            label="Category"
            error={errors.category?.message}
          >
            <select
              {...register("category")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Supplier"
            error={errors.supplier?.message}
          >
            <select
              {...register("supplier")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">
                Select supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier._id}
                  value={supplier._id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </PageContainer>
  );
}

function FormField({
  label,
  error,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default ProductFormPage;