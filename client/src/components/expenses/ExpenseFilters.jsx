import { RotateCcw } from "lucide-react";

const categories = [
  "RENT",
  "UTILITIES",
  "SALARY",
  "SUPPLIES",
  "MAINTENANCE",
  "TRANSPORT",
  "MARKETING",
  "EQUIPMENT",
  "OTHER",
];

const ExpenseFilters = ({
  category,
  startDate,
  endDate,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) => {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              onStartDateChange(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              onEndDateChange(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;