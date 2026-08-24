import {
  Search,
  RotateCcw,
} from "lucide-react";

const EmployeeFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">

        {/* Search */}

        <div className="md:col-span-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search Employee
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                onSearchChange(
                  e.target.value
                )
              }
              placeholder="Search by name, email or phone..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Status */}

        <div className="md:col-span-3">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>

        {/* Reset */}

        <div className="md:col-span-3">
          <button
            type="button"
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RotateCcw size={17} />

            Reset Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeFilters;