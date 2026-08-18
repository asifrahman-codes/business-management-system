const categoryRepository = require("../repositories/category.repository");

const productRepository = require("../repositories/product.repository");
const AppError = require("../utils/app-error.util");

const createCategory = async (data) => {
  const existingCategory = await categoryRepository.findByName(data.name);

  if (existingCategory) {
    throw new AppError("Category already exists", 409);
  }

  return categoryRepository.create(data);
};

const getCategories = async () => {
  return categoryRepository.findAll();
};

const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

const updateCategory = async (id, data) => {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (data.name) {
    const existingCategory = await categoryRepository.findByName(data.name);

    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new AppError("Category already exists", 409);
    }
  }

  return categoryRepository.updateById(id, data);
};

const deleteCategory = async (id) => {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // PROTECT AGAINST DELETING CATEGORIES IN USE
  const productsUsingCategory = await productRepository.findByCategory(id);

  if (productsUsingCategory) {
    throw new AppError(
      "Cannot delete category because products are using it",
      409
    );
  }

  return categoryRepository.deleteById(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};