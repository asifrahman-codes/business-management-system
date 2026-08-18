router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "CASHIER"),
  saleController.getSales
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "CASHIER"),
  saleController.getSaleById
);