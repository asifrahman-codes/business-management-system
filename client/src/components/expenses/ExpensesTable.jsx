import {
  Pencil,
  Trash2,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(
    date
  ).toLocaleDateString();
};

const formatAmount = (amount) => {
  return Number(amount || 0).toLocaleString();
};

const ExpensesTable = ({
  expenses,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Title
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Category
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Amount
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Date
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                Description
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
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Loading expenses...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {expense.title}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {expense.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-900">
                    Rs.{" "}
                    {formatAmount(
                      expense.amount
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(
                      expense.date
                    )}
                  </td>

                  <td className="max-w-xs px-5 py-4 text-gray-600">
                    <span className="block truncate">
                      {expense.description ||
                        "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() =>
                          onEdit(expense)
                        }
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() =>
                          onDelete(expense)
                        }
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
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

export default ExpensesTable;