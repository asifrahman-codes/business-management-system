import {
  Eye,
  Receipt,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(
    date
  ).toLocaleString();
};

const formatAmount = (amount) => {
  return Number(
    amount || 0
  ).toLocaleString();
};

const SalesTable = ({
  sales,
  loading,
  onView,
  onReceipt,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Invoice
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Customer
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Cashier
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Payment
              </th>

              <th className="px-5 py-3 text-right font-semibold text-gray-700">
                Total
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Date
              </th>

              <th className="px-5 py-3 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Loading sales...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No sales found.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {sale.invoiceNumber}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {sale.customerName ||
                      "Walk-in Customer"}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {sale.cashier?.name || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                      {sale.paymentMethod || "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right font-medium text-gray-900">
                    Rs.{" "}
                    {formatAmount(
                      sale.grandTotal
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(
                      sale.createdAt
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="View Details"
                        onClick={() =>
                          onView(sale)
                        }
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        title="View Receipt"
                        onClick={() =>
                          onReceipt(sale)
                        }
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
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