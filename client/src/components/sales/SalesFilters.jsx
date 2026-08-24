import { RotateCcw } from "lucide-react";

const SalesFilters = ({
  startDate,
  endDate,
  paymentMethod,
  onStartDateChange,
  onEndDateChange,
  onPaymentMethodChange,
  onReset,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(event) =>
              onStartDateChange(
                event.target.value
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
            onChange={(event) =>
              onEndDateChange(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(event) =>
              onPaymentMethodChange(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

            <option value="bank">
              Bank
            </option>
          </select>
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

export default SalesFilters;