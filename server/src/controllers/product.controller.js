const productService =
  require("../services/product.service");

const asyncHandler =
  require("../utils/async-handler.util");

const createProduct = asyncHandler(
  async (req, res) => {
    const product =
      await productService.createProduct(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: product,
    });
  }
);

const getProducts = asyncHandler(
  async (req, res) => {
    const result =
      await productService.getProducts(
        req.query
      );

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  }
);

const getProductById = asyncHandler(
  async (req, res) => {
    const product =
      await productService.getProductById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: product,
    });
  }
);

const updateProduct = asyncHandler(
  async (req, res) => {
    const product =
      await productService.updateProduct(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: product,
    });
  }
);

const deleteProduct = asyncHandler(
  async (req, res) => {
    await productService.deleteProduct(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);

const getInventorySummary =
  asyncHandler(async (req, res) => {
    const summary =
      await productService
        .getInventorySummary();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  });

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getInventorySummary,
};