import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .required("Category name is required"),

  description: yup
    .string()
    .trim()
    .max(
      500,
      "Description cannot exceed 500 characters"
    )
    .default(""),
});