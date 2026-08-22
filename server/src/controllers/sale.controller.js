const saleService =
  require("../services/sale.service");

const receiptService =
  require("../services/receipt.service");

const asyncHandler =
  require("../utils/async-handler.util");

const createSale =
  asyncHandler(async (req, res) => {
    const sale =
      await saleService.createSale({
        items: req.body.items,
        discount: req.body.discount,
        tax: req.body.tax,
        paymentMethod:
          req.body.paymentMethod,
        customerName:
          req.body.customerName,
        cashier: req.user.id,
      });

    return res.status(201).json({
      success: true,
      data: sale,
    });
  });

const getSales =
  asyncHandler(async (req, res) => {
    const result =
      await saleService.getSales(
        req.query
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

const getSaleById =
  asyncHandler(async (req, res) => {
    const sale =
      await saleService.getSaleById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: sale,
    });
  });


const getSaleReceipt =
  asyncHandler(async (req, res) => {
    const sale =
      await saleService.getSaleById(
        req.params.id
      );

    const receipt =
      receiptService.buildReceipt(sale);

    return res.status(200).json({
      success: true,
      data: receipt,
    });
  });

module.exports = {
  createSale,
  getSales,
  getSaleById,
  getSaleReceipt,
};