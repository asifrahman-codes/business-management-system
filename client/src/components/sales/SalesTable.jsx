import {
  Eye,
  Receipt,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleString();
};

const formatAmount = (amount) => {
  return Number(amount || 0).toLocaleString();
};

const SalesTable = ({
  sales,
  loading,
  onView,
  onReceipt,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Invoice
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Customer
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Cashier
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Payment
              </th>

              <th className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                Total
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Date
              </th>

              <th className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading sales...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No sales found.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                >
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {sale.invoiceNumber}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {sale.customerName ||
                      "Walk-in Customer"}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {sale.cashier?.name || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {sale.paymentMethod || "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    Rs.{" "}
                    {formatAmount(
                      sale.grandTotal
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {formatDate(sale.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="View Details"
                        onClick={() =>
                          onView(sale)
                        }
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        title="View Receipt"
                        onClick={() =>
                          onReceipt(sale)
                        }
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      >
                        <Receipt size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;