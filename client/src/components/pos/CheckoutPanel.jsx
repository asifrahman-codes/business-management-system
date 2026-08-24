import { useState } from "react";
import { CreditCard } from "lucide-react";

function CheckoutPanel({
  cart,
  subtotal,
  onCheckout,
  processing,
}) {
  const [customerName, setCustomerName] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [tax, setTax] = useState(0);

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  const discountAmount =
    Number(discount) || 0;

  const taxAmount =
    Number(tax) || 0;

  const grandTotal =
    subtotal -
    discountAmount +
    taxAmount;

  const handleCheckout = () => {
    onCheckout({
      customerName,
      discount: discountAmount,
      tax: taxAmount,
      paymentMethod,
    });
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <div className="flex items-center gap-3">
          <CreditCard
            size={20}
            className="text-blue-600"
          />

          <div>
            <h2 className="font-semibold text-gray-900">
              Checkout
            </h2>

            <p className="text-sm text-gray-500">
              Complete the sale.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Customer Name
          </label>

          <input
            type="text"
            value={customerName}
            onChange={(event) =>
              setCustomerName(event.target.value)
            }
            placeholder="Walk-in Customer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Discount
            </label>

            <input
              type="number"
              min="0"
              value={discount}
              onChange={(event) =>
                setDiscount(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tax
            </label>

            <input
              type="number"
              min="0"
              value={tax}
              onChange={(event) =>
                setTax(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="cash">
              Cash
            </option>

            <option value="card">
              Card
            </option>

            <option value="bank_transfer">
              Bank Transfer
            </option>
          </select>
        </div>

        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>

            <span>
              Rs. {subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Discount</span>

            <span>
              - Rs. {discountAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>

            <span>
              Rs. {taxAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="font-semibold text-gray-900">
              Grand Total
            </span>

            <span className="text-lg font-bold text-blue-600">
              Rs. {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={
            cart.length === 0 || processing
          }
          onClick={handleCheckout}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing
            ? "Processing Sale..."
            : `Complete Sale - Rs. ${grandTotal.toFixed(
                2
              )}`}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPanel;