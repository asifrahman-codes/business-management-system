const productRepository =
  require("../repositories/product.repository");

const categoryRepository =
  require("../repositories/category.repository");

const supplierRepository =
  require("../repositories/supplier.repository");

const getQueryOptions =
  require("../utils/query-options");

const AppError =
  require("../utils/app-error.util");

const {
  PRODUCT_SORT_FIELDS,
} = require("../constants/product.constants");

const createProduct = async (data) => {
  if (
    data.sellingPrice <
    data.costPrice
  ) {
    throw new AppError(
      "Selling price cannot be lower than cost price",
      400
    );
  }

  const existingProduct =
    await productRepository.findBySku(
      data.sku
    );

  if (existingProduct) {
    throw new AppError(
      "Product SKU already exists",
      409
    );
  }

  const category =
    await categoryRepository.findById(
      data.category
    );

  if (!category) {
    throw new AppError(
      "Category not found",
      404
    );
  }

  const supplier =
    await supplierRepository.findById(
      data.supplier
    );

  if (!supplier) {
    throw new AppError(
      "Supplier not found",
      404
    );
  }

  return productRepository.create(data);
};


const getProducts = async (query) => {
  const options =
    getQueryOptions(query);

  if (
    !PRODUCT_SORT_FIELDS.includes(
      options.sortBy
    )
  ) {
    options.sortBy = "createdAt";
  }

  const result =
    await productRepository.findAll(
      options
    );

  return {
    data: result.data,
    pagination: {
      total: result.total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(
        result.total / options.limit
      ),
    },
  };
};

const getProductById = async (id) => {
  const product =
    await productRepository.findById(id);

  if (!product) {
    throw new AppError(
      "Product not found",
      404
    );
  }

  return product;
};

const updateProduct = async (
  id,
  data
) => {
  const product =
    await productRepository.findById(id);

  if (!product) {
    throw new AppError(
      "Product not found",
      404
    );
  }

  const newCostPrice =
    data.costPrice ??
    product.costPrice;

  const newSellingPrice =
    data.sellingPrice ??
    product.sellingPrice;

  if (
    newSellingPrice <
    newCostPrice
  ) {
    throw new AppError(
      "Selling price cannot be lower than cost price",
      400
    );
  }

  if (data.sku) {
    const existingProduct =
      await productRepository.findBySku(
        data.sku
      );

    if (
      existingProduct &&
      existingProduct._id.toString() !== id
    ) {
      throw new AppError(
        "Product SKU already exists",
        409
      );
    }
  }

  if (data.category) {
    const category =
      await categoryRepository.findById(
        data.category
      );

    if (!category) {
      throw new AppError(
        "Category not found",
        404
      );
    }
  }

  if (data.supplier) {
    const supplier =
      await supplierRepository.findById(
        data.supplier
      );

    if (!supplier) {
      throw new AppError(
        "Supplier not found",
        404
      );
    }
  }

  return productRepository.updateById(
    id,
    data
  );
};


const deleteProduct = async (id) => {
  const product =
    await productRepository.findById(id);

  if (!product) {
    throw new AppError(
      "Product not found",
      404
    );
  }

  return productRepository.deleteById(id);
};

const isProductLowStock = (product) => {
  return (
    product.quantityInStock <=
    product.reorderLevel
  );
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  isProductLowStock,
};