import {
  ArrowLeft,
  Printer,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import saleService from "../../services/sale.service";

const formatAmount = (amount) => {
  return Number(
    amount || 0
  ).toLocaleString();
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString();
};

const SaleReceiptPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [receipt, setReceipt] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await saleService.getSaleReceipt(
            id
          );

        setReceipt(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load receipt."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-gray-500">
        Loading receipt...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/sales")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Sales
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!receipt) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            navigate(`/sales/${id}`)
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Sale
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 print:hidden"
        >
          <Printer size={18} />
          Print Receipt
        </button>
      </div>

      {/* Receipt */}
      <div className="mx-auto w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:max-w-none print:border-0 print:p-0 print:shadow-none">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Business Management System
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Sales Receipt
          </p>
        </div>

        <div className="my-6 border-t border-dashed border-gray-300" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">
              Invoice
            </p>

            <p className="font-semibold text-gray-900">
              {receipt.invoiceNumber}
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-500">
              Date
            </p>

            <p className="font-semibold text-gray-900">
              {formatDate(
                receipt.createdAt
              )}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Customer
            </p>

            <p className="font-semibold text-gray-900">
              {receipt.customerName ||
                "Walk-in Customer"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-500">
              Payment
            </p>

            <p className="font-semibold capitalize text-gray-900">
              {receipt.paymentMethod ||
                "-"}
            </p>
          </div>
        </div>

        <div className="my-6 border-t border-gray-200" />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left">
                  Product
                </th>

                <th className="py-3 text-right">
                  Qty
                </th>

                <th className="py-3 text-right">
                  Price
                </th>

                <th className="py-3 text-right">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {(receipt.items || []).map(
                (item, index) => (
                  <tr
                    key={`${item.product}-${index}`}
                    className="border-b border-gray-100"
                  >
                    <td className="py-3">
                      <p className="font-medium text-gray-900">
                        {item.name}
                      </p>

                      {item.sku && (
                        <p className="text-xs text-gray-500">
                          {item.sku}
                        </p>
                      )}
                    </td>

                    <td className="py-3 text-right">
                      {item.quantity}
                    </td>

                    <td className="py-3 text-right">
                      Rs.{" "}
                      {formatAmount(
                        item.unitPrice
                      )}
                    </td>

                    <td className="py-3 text-right font-medium">
                      Rs.{" "}
                      {formatAmount(
                        item.subtotal
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="my-6 border-t border-gray-200" />

        <div className="ml-auto max-w-sm space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span>
              Rs.{" "}
              {formatAmount(
                receipt.totalAmount
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Discount
            </span>

            <span>
              Rs.{" "}
              {formatAmount(
                receipt.discount
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Tax
            </span>

            <span>
              Rs.{" "}
              {formatAmount(
                receipt.tax
              )}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>

              <span>
                Rs.{" "}
                {formatAmount(
                  receipt.grandTotal
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-dashed border-gray-300 pt-5 text-center">
          <p className="text-sm text-gray-500">
            Thank you for your business.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleReceiptPage;