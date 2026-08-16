const categoryRepository =
  require("../repositories/category.repository");

const AppError =
  require("../utils/app-error");

const createCategory = async (data) => {
  const existingCategory =
    await categoryRepository.findByName(
      data.name
    );

  if (existingCategory) {
    throw new AppError(
      "Category already exists",
      409
    );
  }

  return categoryRepository.create(data);
};

const getCategories = async () => {
  return categoryRepository.findAll();
};

const getCategoryById = async (id) => {
  const category =
    await categoryRepository.findById(id);

  if (!category) {
    throw new AppError(
      "Category not found",
      404
    );
  }

  return category;
};

const updateCategory = async (
  id,
  data
) => {
  const category =
    await categoryRepository.findById(id);

  if (!category) {
    throw new AppError(
      "Category not found",
      404
    );
  }

  if (data.name) {
    const existingCategory =
      await categoryRepository.findByName(
        data.name
      );

    if (
      existingCategory &&
      existingCategory._id.toString() !== id
    ) {
      throw new AppError(
        "Category already exists",
        409
      );
    }
  }

  const updatedCategory =
    await categoryRepository.updateById(
      id,
      data
    );

  return updatedCategory;
};

const deleteCategory = async (id) => {
  const category =
    await categoryRepository.findById(id);

  if (!category) {
    throw new AppError(
      "Category not found",
      404
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