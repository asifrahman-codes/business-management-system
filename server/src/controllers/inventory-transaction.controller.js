const asyncHandler =
  require("../utils/async-handler.util");

const getInventoryTransactions =
  asyncHandler(async (req, res) => {
    const result =
      await inventoryTransactionService
        .getInventoryTransactions(
          req.query
        );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  module.exports = {
    getInventoryTransactions

};