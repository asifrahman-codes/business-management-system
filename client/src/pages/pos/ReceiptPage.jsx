const ReceiptPage = () => {
  const { id } = useParams();

  // fetch receipt

  return (
    <div className="receipt">
      <header>
        <h1>My Business</h1>
        <p>Sales Receipt</p>
      </header>

      <section>
        <p>Invoice: {receipt.invoiceNumber}</p>
        <p>Cashier: {receipt.cashier?.name}</p>
      </section>

      <section>
        {receipt.items.map((item) => (
          <div key={item.sku}>
            <span>{item.product}</span>
            <span>{item.quantity}</span>
            <span>{item.total}</span>
          </div>
        ))}
      </section>

      <section>
        <p>Subtotal: {receipt.subtotal}</p>
        <p>Discount: {receipt.discount}</p>
        <p>Tax: {receipt.tax}</p>
        <strong>
          Grand Total: {receipt.grandTotal}
        </strong>
      </section>

      <button className="no-print" onClick={() => window.print()}>
        Print
      </button>
    </div>
  );
};