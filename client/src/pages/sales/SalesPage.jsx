import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getSales } from "../../services/sale.service";

function SalesPage() {
  const navigate = useNavigate();

  const [sales, setSales] =
    useState([]);

  const [pagination, setPagination] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [invoiceNumber, setInvoiceNumber] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getSales({
          page,
          limit: 20,
          invoiceNumber,
          paymentMethod,
        });

      setSales(
        response.data?.sales || []
      );

      setPagination(
        response.data?.pagination || null
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load sales."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSales();
    }, 400);

    return () =>
      clearTimeout(timer);
  }, [
    page,
    invoiceNumber,
    paymentMethod,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Sales
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage completed sales.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={invoiceNumber}
              onChange={(event) => {
                setInvoiceNumber(
                  event.target.value
                );

                setPage(1);
              }}
              placeholder="Search invoice number..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={paymentMethod}
            onChange={(event) => {
              setPaymentMethod(
                event.target.value
              );

              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">
              All Payment Methods
            </option>

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

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading sales...
          </div>
        ) : sales.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No sales found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Invoice
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Cashier
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Total
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {sales.map((sale) => (
                    <tr
                      key={sale._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {sale.invoiceNumber}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {sale.customerName ||
                          "Walk-in Customer"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
                          {sale.paymentMethod.replace(
                            "_",
                            " "
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-900">
                          {sale.cashier?.name ||
                            "-"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {sale.cashier?.email ||
                            ""}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        Rs.{" "}
                        {sale.grandTotal.toFixed(
                          2
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {new Date(
                          sale.createdAt
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/sales/${sale._id}`
                            )
                          }
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="flex items-center justify-between border-t px-5 py-4">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          currentPage - 1
                      )
                    }
                    className="rounded-lg border p-2 disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    disabled={
                      page >=
                      pagination.totalPages
                    }
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          currentPage + 1
                      )
                    }
                    className="rounded-lg border p-2 disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SalesPage;