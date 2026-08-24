import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Receipt,
} from "lucide-react";

import {
  getSaleById,
  getSaleReceipt,
} from "../../services/sale.service";

function SaleDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [sale, setSale] =
    useState(null);

  const [receipt, setReceipt] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);

      const [
        saleResponse,
        receiptResponse,
      ] = await Promise.all([
        getSaleById(id),
        getSaleReceipt(id),
      ]);

      setSale(saleResponse.data);
      setReceipt(receiptResponse.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load sale details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-gray-500">
        Loading sale details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!sale) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() => navigate("/sales")}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={18} />

        Back to Sales
      </button>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sale Details
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Invoice:{" "}
              <span className="font-medium text-gray-900">
                {sale.invoiceNumber}
              </span>
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium capitalize text-green-700">
            {sale.paymentMethod.replace(
              "_",
              " "
            )}
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Customer
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {sale.customerName ||
                "Walk-in Customer"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Cashier
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {sale.cashier?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Date
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {new Date(
                sale.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Payment Method
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-gray-900">
              {sale.paymentMethod.replace(
                "_",
                " "
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-y bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Product
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  SKU
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  Unit Price
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {sale.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {item.sku}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-gray-600">
                    Rs.{" "}
                    {item.unitPrice.toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-gray-600">
                    {item.quantity}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                    Rs.{" "}
                    {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto mt-8 max-w-sm space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>

            <span>
              Rs.{" "}
              {sale.totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Discount</span>

            <span>
              - Rs.{" "}
              {sale.discount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>

            <span>
              Rs. {sale.tax.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-900">
            <span>Grand Total</span>

            <span>
              Rs.{" "}
              {sale.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {receipt && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Receipt
              size={20}
              className="text-blue-600"
            />

            <h2 className="text-lg font-semibold text-gray-900">
              Receipt Information
            </h2>
          </div>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <p>
              <span className="font-medium">
                Invoice:
              </span>{" "}
              {receipt.invoiceNumber}
            </p>

            <p>
              <span className="font-medium">
                Customer:
              </span>{" "}
              {receipt.customerName ||
                "Walk-in Customer"}
            </p>

            <p>
              <span className="font-medium">
                Cashier:
              </span>{" "}
              {receipt.cashier?.name}
            </p>

            <p>
              <span className="font-medium">
                Total:
              </span>{" "}
              Rs.{" "}
              {receipt.grandTotal.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaleDetailsPage;