const buildReceipt = (sale) => {
  return {
    invoiceNumber: sale.invoiceNumber,

    date: sale.createdAt,

    cashier: sale.cashier
      ? {
          name: sale.cashier.name,
          email: sale.cashier.email,
        }
      : null,

    customerName:
      sale.customerName || "Walk-in Customer",

    items: sale.items.map((item) => ({
      product: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.sellingPrice,
      total: item.total,
    })),

    subtotal: sale.totalAmount,

    discount: sale.discount,

    tax: sale.tax,

    grandTotal: sale.grandTotal,

    paymentMethod:
      sale.paymentMethod,
  };
};

module.exports = {
  buildReceipt,
};