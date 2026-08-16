const supplierService =
  require("../services/supplier.service");

const asyncHandler =
  require("../utils/async-handler.util");

const createSupplier = asyncHandler(
  async (req, res) => {
    const supplier =
      await supplierService.createSupplier(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: supplier,
    });
  }
);

const getSuppliers = asyncHandler(
  async (req, res) => {
    const result =
      await supplierService.getSuppliers(
        req.query
      );

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  }
);

const getSupplierById = asyncHandler(
  async (req, res) => {
    const supplier =
      await supplierService.getSupplierById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: supplier,
    });
  }
);

const updateSupplier = asyncHandler(
  async (req, res) => {
    const supplier =
      await supplierService.updateSupplier(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: supplier,
    });
  }
);

const deleteSupplier = asyncHandler(
  async (req, res) => {
    await supplierService.deleteSupplier(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  }
);

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};