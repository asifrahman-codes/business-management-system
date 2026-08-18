router.get(
  "/:id/receipt",
  authMiddleware,
  roleMiddleware("ADMIN", "CASHIER"),
  saleController.getSaleReceipt
);