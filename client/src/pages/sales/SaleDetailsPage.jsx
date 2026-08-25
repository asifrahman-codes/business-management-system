import {
  ArrowLeft,
  Receipt,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import saleService from "../../services/sale.service";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString();
};

const formatAmount = (amount) => {
  return Number(amount || 0).toLocaleString();
};

const SaleDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await saleService.getSaleById(id);

        setSale(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load sale details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-gray-500 dark:text-gray-400">
        Loading sale details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/sales")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Sales
        </button>

        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!sale) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={() => navigate("/sales")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Sales
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sale Details
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Invoice: {sale.invoiceNumber}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/sales/${sale._id}/receipt`
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Receipt size={18} />
          View Receipt
        </button>
      </div>

      {/* Sale Information */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Sale Information
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Invoice Number
              </span>

              <span className="font-medium text-gray-900 dark:text-gray-100">
                {sale.invoiceNumber}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Customer
              </span>

              <span className="font-medium text-gray-900 dark:text-gray-100">
                {sale.customerName ||
                  "Walk-in Customer"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Payment Method
              </span>

              <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
                {sale.paymentMethod || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Date
              </span>

              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatDate(sale.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Cashier
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Name
              </span>

              <span className="font-medium text-gray-900 dark:text-gray-100">
                {sale.cashier?.name || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Email
              </span>

              <span className="font-medium text-gray-900 dark:text-gray-100">
                {sale.cashier?.email || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Role
              </span>

              <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
                {sale.cashier?.role || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Items
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Product
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  SKU
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Quantity
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Unit Price
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody>
              {(sale.items || []).map(
                (item, index) => (
                  <tr
                    key={`${item.product}-${index}`}
                    className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {item.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                      {item.sku || "-"}
                    </td>

                    <td className="px-5 py-4 text-right text-gray-600 dark:text-gray-400">
                      {item.quantity}
                    </td>

                    <td className="px-5 py-4 text-right text-gray-600 dark:text-gray-400">
                      Rs.{" "}
                      {formatAmount(
                        item.unitPrice
                      )}
                    </td>

                    <td className="px-5 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
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
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Total Amount
              </span>

              <span className="text-gray-900 dark:text-gray-100">
                Rs.{" "}
                {formatAmount(
                  sale.totalAmount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Discount
              </span>

              <span className="text-gray-900 dark:text-gray-100">
                Rs.{" "}
                {formatAmount(
                  sale.discount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Tax
              </span>

              <span className="text-gray-900 dark:text-gray-100">
                Rs.{" "}
                {formatAmount(sale.tax)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Grand Total</span>

                <span>
                  Rs.{" "}
                  {formatAmount(
                    sale.grandTotal
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsPage;