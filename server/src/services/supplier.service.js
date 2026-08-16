const supplierRepository =
  require("../repositories/supplier.repository");

const getQueryOptions =
  require("../utils/query-options");

const AppError =
  require("../utils/app-error.util");

const {
  SUPPLIER_SORT_FIELDS,
} = require("../constants/supplier.constants");

const createSupplier = async (data) => {
  return supplierRepository.create(data);
};

const getSuppliers = async (query) => {
  const options =
    getQueryOptions(query);

  if (
    !SUPPLIER_SORT_FIELDS.includes(
      options.sortBy
    )
  ) {
    options.sortBy = "createdAt";
  }

  const result =
    await supplierRepository.findAll(
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

const getSupplierById = async (id) => {
  const supplier =
    await supplierRepository.findById(id);

  if (!supplier) {
    throw new AppError(
      "Supplier not found",
      404
    );
  }

  return supplier;
};

const updateSupplier = async (
  id,
  data
) => {
  const supplier =
    await supplierRepository.findById(id);

  if (!supplier) {
    throw new AppError(
      "Supplier not found",
      404
    );
  }

  return supplierRepository.updateById(
    id,
    data
  );
};

const deleteSupplier = async (id) => {
  const supplier =
    await supplierRepository.findById(id);

  if (!supplier) {
    throw new AppError(
      "Supplier not found",
      404
    );
  }

  return supplierRepository.deleteById(id);
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};