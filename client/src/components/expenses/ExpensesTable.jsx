import {
  Pencil,
  Trash2,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Title
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Category
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Amount
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Date
              </th>

              <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Description
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
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading expenses...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
                >
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {expense.title}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {expense.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">
                    Rs. {formatAmount(expense.amount)}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(expense.date)}
                  </td>

                  <td className="max-w-xs px-5 py-4 text-gray-600 dark:text-gray-400">
                    <span className="block truncate">
                      {expense.description || "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(expense)}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(expense)}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
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