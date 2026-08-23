import * as yup from "yup";

export const supplierSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .required("Supplier name is required"),

  contactPerson: yup
    .string()
    .trim()
    .max(
      100,
      "Contact person cannot exceed 100 characters"
    )
    .default(""),

  phone: yup
    .string()
    .trim()
    .max(
      20,
      "Phone cannot exceed 20 characters"
    )
    .default(""),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .default(""),

  address: yup
    .string()
    .trim()
    .max(
      500,
      "Address cannot exceed 500 characters"
    )
    .default(""),
});