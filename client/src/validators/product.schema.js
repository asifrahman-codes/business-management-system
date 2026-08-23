import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name cannot exceed 150 characters")
    .required("Product name is required"),

  sku: yup
    .string()
    .trim()
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU cannot exceed 50 characters")
    .required("SKU is required"),

  costPrice: yup
    .number()
    .typeError("Cost price must be a number")
    .min(0, "Cost price cannot be negative")
    .required("Cost price is required"),

  sellingPrice: yup
    .number()
    .typeError("Selling price must be a number")
    .min(0, "Selling price cannot be negative")
    .required("Selling price is required"),

  quantityInStock: yup
    .number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),

  reorderLevel: yup
    .number()
    .typeError("Reorder level must be a number")
    .integer("Reorder level must be a whole number")
    .min(0, "Reorder level cannot be negative")
    .required("Reorder level is required"),

  unit: yup
    .string()
    .trim()
    .min(1, "Unit is required")
    .max(30, "Unit cannot exceed 30 characters")
    .required("Unit is required"),

  expiryDate: yup
    .date()
    .nullable()
    .typeError("Please enter a valid date"),

  category: yup
    .string()
    .required("Category is required"),

  supplier: yup
    .string()
    .required("Supplier is required"),
});